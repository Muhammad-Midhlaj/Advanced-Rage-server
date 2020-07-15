# ext-ip

[![GitHub version](https://badge.fury.io/gh/eisbehr-%2Fexternal-ip.svg)](https://github.com/eisbehr-/external-ip)
[![NPM version](https://badge.fury.io/js/ext-ip.svg)](https://www.npmjs.org/package/ext-ip)
[![Build Status](https://travis-ci.org/eisbehr-/external-ip.svg)](https://travis-ci.org/eisbehr-/external-ip)
[![Coverage Status](https://coveralls.io/repos/github/eisbehr-/external-ip/badge.svg)](https://coveralls.io/github/eisbehr-/external-ip)
[![Dependency Status](https://david-dm.org/eisbehr-/external-ip.svg)](https://david-dm.org/eisbehr-/external-ip)
[![devDependencies Status](https://david-dm.org/eisbehr-/external-ip/dev-status.svg)](https://david-dm.org/eisbehr-/external-ip?type=dev)

`ext-ip` is a node.js library to get your external IP from multiple services.
It's the successor of the meanwhile unmaintained `external-ip` module.

---

### Table of Contents
* [Why a fork?](#why-a-fork)
* [Installation](#installation)
* [Basic Usage](#basic-usage)
  * [Ready to Use](#ready-to-use)
  * [Configure Instance](#configure-instance)
* [Response Handling](#response-handling)
  * [Promises and `.get()` Function](#promises-and-get-function)
  * [Events](#events)
  * [Callback](#callback)
  * [Combine all Response Handlers](#combine-all-response-handlers)
* [Configuration](#configuration)
  * [Default Services](#default-services)
* [Command Line](#)
* [Code Validation](#code-validation)
* [Tests](#tests)
* [Bugs / Feature request](#bugs--feature-request)
* [License](#license)
* [Donation](#donation)

---

## Why a fork?
This project is a fork from the original [`external-ip`](https://github.com/J-Chaniotis/external-ip) module.
But this was unmaintained for a long time, was very old-fashioned and had some code issues as well.
So there is a update now, featuring some improvements ...

- Completely rewritten in ECMAScript 6 / ES6
- Nearly completely event driven
- Now supports `events` and `promieses` beside the old `callback`
- Added and extended features all over
- Uses more natively ways where possible
- Way more custom request options
- Uses real Errors instead of plain text for failure handling
- Fully tested with 100% code coverage
- Has only half the dependencies as before
- Fixed all Issues and added all pull requests of the original repository
- But is still fully compatible to the original ...


## Installation
The module can be easily installed by [`npm`](https://www.npmjs.com/package/ext-ip):

```SH
$ npm install ext-ip
```


## Basic Usage
Usage of this module is pretty straight forward.
Just import `ext-ip` module and call constructor function.
Afterwards it's possible to gather the external IP as often as wanted.


### Ready to Use
The module is completely configured by default and ready to gather the external IP address.

```JS
let extIP = require("ext-ip")();

extIP.get().then(ip => {
    console.log(ip);
}, err => {
    console.error(err);
});
```


### Configure Instance
Each instance of `ext-ip` can be configured with custom options.
More details about the parameters can be found in [configuration description](#configuration).

```JS
let extIP = require("ext-ip")({
    mode           : "parallel",
    replace        : true,
    timeout        : 500,
    agent          : http.Agent,
    userAgent      : "curl/ext-ip-getter",
    followRedirect : true,
    maxRedirects   : 10,
    services       : [
        "http://ifconfig.co/x-real-ip",
        "http://ifconfig.io/ip"
    ]
});

extIP.get().then(ip => {
    console.log(ip);
});
```


## Response Handling
There are three different ways to handle any response:
`promises`, `events` or an old-school `callback` function.
An example for each type is listed below.


### Promises and `.get()` Function
Using a `promise` for response handling is directly possible.
But best practice is to use the `.get()` function then, what is just a wrapper of `extIP`.
Its used to prevent _unhandled promise rejection_ warning on normal use of this module.
Whenever wanted to use `promises` the `.get()` wrapper should be picked!

A `promise` is even returned by `extIP` function and is fully supported.
Only difference is, that on `rejection` the `err` variable only contains a `string` instead of an `Error` object.  

The usage of `.get()` will even fix some problems recognizing the response type of module exports in IntelliJ IDEs.
So using this function will prevent you from automatically code completion highlights, but it will work even without.

```JS
let extIP = require("ext-ip")();

extIP.get().then(ip => {
    console.log(ip);
})
.catch(err => {
    console.error(err);
});
```


### Events
There are two event types used by this module: `ip` and `err`.
Both will have one parameter given to the listener function when event is triggered.

```JS
let extIP = require("ext-ip")();

extIP.on("ip", ip => {
    console.log(ip);
});

extIP.on("err", err => {
    console.error(err);
});

extIP();
```


### Callback
The callback has up to two prarameters on execution: `err` (_instance of Error_) and `ip` (_string_).
Whenever the first one is not `null`, there has been at least one error while execution.

```JS
let extIP = require("ext-ip")();

extIP((err, ip) => {
    if( err ){
        throw err;
    }

    console.log(ip);
});
```


### Combine all Response Handlers
It's no problem to combine every response handlers in one instance too:

```JS
let extIP = require("ext-ip")();

// events
extIP.on("ip", ip => {
    console.log("event ip: " + ip);
});

extIP.on("err", err => {
    console.error("event error: " + err);
});

// callback
extIP.get((err, ip) => {
    if( err ) {
        console.error("callback error: " + err);
    }
    else {
        console.log("callback ip: " + ip);
    }
})

// promise
.then(ip => {
    console.log("promise ip: " + ip);
})
.catch(err => {
    console.error("promise error: " + err);
});
```


## Configuration
The constructor function accepts a configuration object with different options to customize each instance.

Name           | Type          | Default        | Description
---------------|---------------|----------------|-------------
mode           | *string*      | *"sequential"* | 'sequential' or 'parallel' IP fetching
replace        | *boolean*     | *false*        | true: replaces the default services, false: extends them
services       | *array*       | *[...]*        | array of urls that return the IP in the document body
timeout        | *number*      | *1000*         | timeout per request
agent          | *constructor* | *null*         | http(s).Agent instance to use
userAgent      | *string*      | *"curl/"*      | user agent used for IP requests
followRedirect | *boolean*     | *true*         | follow htt 3xx responses as redirects
maxRedirects   | *number*      | *10*           | maximum redirect count


### Default Services
Below list is showing all default configured services in given order, used by this module.
This is the default of the `services` configuration parameter.

```TEXT
http://icanhazip.com/
http://ifconfig.io/ip
http://ip.appspot.com/
http://ident.me/
http://whatismyip.akamai.com/
http://tnx.nl/ip
http://myip.dnsomatic.com/
http://ipecho.net/plain
http://diagnostic.opendns.com/myip
http://api.ipify.org/
http://trackip.net/ip
```


## Command Line
The `ext-ip` command is available via command line or `CLI`.
Copy of the help info text:

```TEXT
$ ext-ip -h

  Usage: ext-ip [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -R, --replace         replace internal services instead of extending them
    -a, --userAgent <ua>  set user agent for requests
    -F, --follow          follow 3xx http redirects
    -s, --services <url>  service url, see examples, required if using -R
    -t, --timeout <msec>  set timeout per request
    -P, --parallel        set to parallel mode

  Description:

    This program prints the external IP of the machine.
    All arguments are optional.

  Examples:

    $ ext-ip
    $ ext-ip -P -t 1500 -R -s http://icanhazip.com -s http://ifconfig.io/ip
```


## Code Validation
This project uses `jshint` to validate the basic coding style and to prevent some basic design problems.
A validation can be executed at any time with `gulp`.

```SH
$ gulp validate
```


## Tests
Tests can be executed in the root directory.
It uses `mocha`, `chai` and `sinon` to run those.

```SH
$ npm test
```

For code coverage `istanbul` is used.
In-deep details about testing can be found in `coverage/` folder after execution.

```SH
$ npm run cover
```


## Bugs / Feature request
Please [report](http://github.com/eisbehr-/external-ip/issues) bugs and feel free to [ask](http://github.com/eisbehr-/external-ip/issues) for new features directly on GitHub.


## License
This project is licensed under [ISC](https://opensource.org/licenses/ISC) license.


## Donation
_You like to support me?_  
_You appreciate my work?_  
_You use it in commercial projects?_  
  
Feel free to make a little [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FFL6VQJCUZMXC)! :wink:
