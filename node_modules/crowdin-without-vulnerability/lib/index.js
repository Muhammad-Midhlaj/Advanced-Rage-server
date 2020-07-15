// Copyright 2015 Hailo
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var Promise = require('bluebird');
var request = require('request');
var requestPromise = Promise.promisify(request);
var unzip = require('unzip');
var yaml = require('js-yaml');

function Crowdin(config) {
    this.config = config || {};
    if (!this.config.apiKey) throw new Error('Missing apiKey');
    if (!this.config.endpointUrl) throw new Error('Missing endpointUrl');
}

// return Promise
Crowdin.prototype.requestData = function(params) {
    return requestPromise(params)
    // Catch response errors
    .then(function(res) {
        if (!res || !res[0]) throw new Error('No response');
        if (res[0].statusCode >= 400) throw new Error(res[1]);
        return res[1]; // Return response body
    })
    // Parse JSON
    .then(function(body) {
        if (body) return JSON.parse(body);
        return {};
    })
    // Throw error if present
    .then(function(data) {
        if (data.error) throw new Error(data.error.message);
        else return data;
    });
};

// return Promise
Crowdin.prototype.getRequest = function(uri) {
    return this.requestData({
        uri: this.config.endpointUrl + '/' + uri,
        method: 'GET',
        qs: {
            key: this.config.apiKey,
            json: 'json'
        }
    });
};

// return Promise
Crowdin.prototype.postRequest = function(uri) {
    return this.requestData({
        uri: this.config.endpointUrl + '/' + uri,
        method: 'POST',
        form: {
            key: this.config.apiKey
        },
        qs: {
            json: 'json'
        }
    });
};

// return Promise
Crowdin.prototype.getInfo = function() {
    return this.postRequest('info');
};

// return Promise
Crowdin.prototype.export = function() {
    return this.getRequest('export');
};

// return Promise
Crowdin.prototype.getLanguages = function() {
    return this.getInfo()
    .then(function(data) {
        return data.languages;
    });
};

// return Stream
Crowdin.prototype.download = function() {
    return request.get(this.config.endpointUrl + '/download/all.zip?key=' + this.config.apiKey);
};

// return Promise
Crowdin.prototype.downloadToStream = function(toStream) {
    var that = this;
    return new Promise(function(resolve, reject) {
        that.download()
        .pipe(toStream)
        .on('error', reject)
        .on('close', resolve)
        .on('end', resolve);
    });
};

// return Promise
Crowdin.prototype.downloadToZip = function(zipPath) {
    return this.downloadToStream(fs.createWriteStream(zipPath));
};

// return Promise
Crowdin.prototype.downloadToPath = function(toPath) {
    return this.downloadToStream(unzip.Extract({path: toPath}));
};

// return Stream
Crowdin.prototype.downloadAndParse = function() {
    return this.download()
    .pipe(unzip.Parse());
};

// return Promise
Crowdin.prototype.downloadToObject = function() {
    var that = this;
    var promises = [];

    var parseEntry = function(ext, entry) {
        return new Promise(function(resolve, reject) {
            var buffer = '';

            entry
            .on('error', reject)
            .on('data', function(chunk) {
                buffer += chunk.toString();
            })
            .on('end', function() {
                var lang = entry.path.split('/')[0];
                var values = {};

                if (ext === '.json') values[ lang ] = JSON.parse(buffer);
                else values[ lang ] = yaml.safeLoad(buffer); // YAML

                resolve(values);
            });
        });
    };

    return new Promise(function(resolve, reject) {
        that.downloadAndParse()
        .on('entry', function(entry) {
            // Only process files
            if (entry.type === 'File') {
                var ext = path.extname(entry.path);
                // Only handle JSON and YAML files
                if (ext === '.json' || ext === '.yml') {
                    return promises.push(parseEntry(ext, entry));
                }
            }
            entry.autodrain();
        })
        .on('error', reject)
        .on('close', function() {
            Promise.all(promises)
            .then(function(items) {
                // Merge all results in a single object
                return _.reduce(items, function(res, item) {
                    return _.merge(res, item);
                }, {});
            })
            .then(resolve);
        });
    });
};

module.exports = Crowdin;
