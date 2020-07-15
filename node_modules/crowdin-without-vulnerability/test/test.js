var bodyParser = require('body-parser');
var express = require('express');
var fs = require('graceful-fs');
var del = require('del');
var should = require('should');
var stream = require('stream');

var Crowdin = require('../');
var config = {
    endpointUrl: 'http://localhost:9999/test',
    apiKey: '12345'
};
var crowdin = new Crowdin(config);

var api = express();

// Generic API calls

api.get('/test/400', function(req, res) {
    res.status(400).end();
});

api.get('/test/error', function(req, res) {
    res.send({
        error: new Error('test')
    });
});

api.get('/test/ok', function(req, res) {
    res.send({
        test: 'OK'
    });
});

// getRequest

api.get('/test/get', function(req, res) {
    req.query.should.have.property('key').equal(config.apiKey);
    req.query.should.have.property('json');
    res.send();
});

// postRequest

api.post('/test/post', bodyParser.urlencoded({extended: false}), function(req, res) {
    req.body.should.have.property('key').equal(config.apiKey);
    req.query.should.have.property('json');
    res.send();
});

// getInfo

api.post('/test/info', function(req, res) {
    res.send({
        languages:
            [ { name: 'French', code: 'fr' },
            { name: 'Spanish', code: 'es-ES' } ],
        files:
            [ { name: 'content.yml',
               node_type: 'file',
               created: '2014-06-23 07:03:54',
               last_updated: '2014-06-23 07:03:54',
               last_accessed: '2014-06-23 07:06:00' },
              { name: 'about.yml',
               node_type: 'file',
               created: '2014-06-30 12:44:06',
               last_updated: '2014-07-01 11:42:42',
               last_accessed: '2014-07-01 07:33:00' } ],
        details:
            { source_language: { name: 'English', code: 'en' } }
    });
});

// export

api.get('/test/export', function(req, res) {
    res.send();
});

// download

var sendZip = 'yaml';
api.get('/test/download/all.zip', function(req, res) {
    fs.createReadStream(__dirname + '/' + sendZip + '.zip')
    .pipe(res);
});

// Start server

api.listen(9999);

// Tests before/after

var tmpDir = __dirname + '/temp';

before(function(done) {
    fs.exists(tmpDir, function(exists) {
        if (exists) done();
        else fs.mkdir(tmpDir, done);
    });
});

after(function(done) {
    del(tmpDir, done);
});

// Tests

describe('Crowdin()', function() {
    it('should throw an error if no `apiKey` is set', function() {
        (function() {
            new Crowdin({endpointUrl: '//'});
        }).should.throw();
    });

    it('should throw an error if no `endpointUrl` is set', function() {
        (function() {
            new Crowdin({apiKey: '123'});
        }).should.throw();
    });

    it('should not throw an error if `apiKey` and `endpointUrl` are set', function() {
        (function() {
            new Crowdin({
                apiKey: '123',
                endpointUrl: '//'
            });
        }).should.not.throw();
    });
});

describe('#requestData', function() {

    it('should return an error if the endpoint does not exist', function(done) {
        crowdin.requestData({
            uri: config.endpointUrl + '/not-here'
        })
        .then(function() {
            throw new Error('should not be resolved');
        })
        .catch(function() {
            done();
        });
    });

    it('should return an error if the request is invalid', function(done) {
        crowdin.requestData({
            uri: config.endpointUrl + '/400'
        })
        .then(function() {
            throw new Error('should not be resolved');
        })
        .catch(function() {
            done();
        });
    });

    it('should return an error if the response contains an error', function(done) {
        crowdin.requestData({
            uri: config.endpointUrl + '/error'
        })
        .then(function() {
            throw new Error('should not be resolved');
        })
        .catch(function() {
            done();
        });
    });

    it('should return the requested data', function(done) {
        crowdin.requestData({
            uri: config.endpointUrl + '/ok'
        })
        .then(function(data) {
            data.should.have.property('test').equal('OK');
            done();
        })
        .catch(done);
    });
});

describe('#getRequest', function() {
    it('should send a GET request with proper parameters to the server', function(done) {
        crowdin.getRequest('get')
        .then(function() {
            done();
        })
        .catch(done);
    });
});

describe('#postRequest', function() {
    it('should send a POST request with proper parameters to the server', function(done) {
        crowdin.postRequest('post')
        .then(function() {
            done();
        })
        .catch(done);
    });
});

describe('#getInfo', function() {
    it('should return the project info', function(done) {
        crowdin.getInfo()
        .then(function(data) {
            data.should.be.type('object');
            done();
        })
        .catch(done);
    });
});

describe('#getLanguages', function() {
    it('should return the project languages', function(done) {
        crowdin.getLanguages()
        .then(function(languages) {
            languages.should.eql(
                [ { name: 'French', code: 'fr' },
                { name: 'Spanish', code: 'es-ES' } ]
            );
            done();
        })
        .catch(done);
    });
});

describe('#export', function() {
    it('should call the `export` API endpoint', function(done) {
        crowdin.export()
        .then(function() {
            done();
        })
        .catch(done);
    });
});

describe('#download', function() {
    it('should return the ZIP file stream', function(done) {
        crowdin.download()
        .on('error', done)
        .on('end', done);
    });
});

describe('#downloadToStream', function() {
    it('should return a promise', function(done) {
        var toStream = new stream.PassThrough();
        toStream.resume();

        crowdin.downloadToStream(toStream)
        .then(function() {
            done();
        })
        .catch(done);
    });
});

describe('#downloadToZip', function() {
    it('should download the ZIP file to the specified path', function(done) {
        var toPath = __dirname + '/temp/test.zip';
        crowdin.downloadToZip(toPath)
        .then(function() {
            fs.exists(toPath, function(exists) {
                exists.should.be.true;
                fs.unlink(toPath, done);
            });
        })
        .catch(done);
    });
});

describe('#downloadToPath', function() {
    it('should download and extract the ZIP file to the specified path', function(done) {
        var toPath = __dirname + '/temp/extract';
        crowdin.downloadToPath(toPath)
        .then(function() {
            // Only check existence of one of the files, should be enough for a simple test
            fs.exists(toPath + '/fr/content.yml', function(exists) {
                exists.should.be.true;
                done();
            });
        })
        .catch(done);
    });
});

describe('#downloadAndParse', function() {
    it('should download and stream the ZIP file entries', function(done) {
        // Count entries in the ZIP file, should be 6 (4 files in 2 folders)
        var entriesCount = 0;
        crowdin.downloadAndParse()
        .on('error', done)
        .on('entry', function() {
            entriesCount++;
        })
        .on('close', function() {
            entriesCount.should.equal(6);
            done();
        });
    });
});

describe('#downloadToObject', function() {
    it('should download the ZIP contents and resolve a JS object', function(done) {
        sendZip = 'yaml';
        crowdin.downloadToObject()
        .then(function(data) {
            data.should.be.a.type('object');
            data.should.have.property('fr');
            data.should.have.property('es-ES');
            done();
        })
        .catch(done);
    });

    it('should detect and parse JSON', function(done) {
        sendZip = 'json';
        crowdin.downloadToObject()
        .then(function(data) {
            data.should.be.a.type('object');
            data.should.have.property('fr');
            data.fr.should.be.a.type('object');
            data.fr.should.have.property('hello');
            data.fr.hello.should.equal('Bonjour');
            done();
        })
        .catch(done);
    });

    it('should detect and parse YAML', function(done) {
        sendZip = 'yaml';
        crowdin.downloadToObject()
        .then(function(data) {
            data.should.be.a.type('object');
            data.should.have.property('fr');
            data.fr.should.be.a.type('object');
            data.fr.should.have.property('hello');
            data.fr.hello.should.equal('Bonjour');
            done();
        })
        .catch(done);
    });
});
