#!/usr/bin/env node

let cli = require("commander");
let defaults = require("../defaults");
let pkg = require("../../package.json");

// service collect helper
let serviceFactory = (service, services) => {
    services.push(service);
    return services;
};

// version
// noinspection JSCheckFunctionSignatures
cli.version(pkg.version);

// cli option parameters
// noinspection JSCheckFunctionSignatures
cli.option("-R, --replace", "replace internal services instead of extending them")
   .option("-a, --userAgent <ua>", "set user agent for requests")
   .option("-F, --follow", "follow 3xx http redirects")
   .option("-s, --services <url>", "service url, see examples, required if using -R", serviceFactory, [])
   .option("-t, --timeout <msec>", "set timeout per request", parseInt)
   .option("-P, --parallel", "set to parallel mode");

// cli custom help output
// noinspection JSUnresolvedFunction
cli.on("--help", () => {
    console.log("  Description:");
    console.log("");
    console.log("    This program prints the external IP of the machine.");
    console.log("    All arguments are optional.");
    console.log("");
    console.log("  Examples:");
    console.log("");
    console.log("    $ ext-ip");
    console.log("    $ ext-ip -P -t 1500 -R -s http://icanhazip.com -s http://ifconfig.io/ip");
    console.log("");
});

// start I/O immediately
cli.parse(process.argv);

// create get ip instance
let extIP = require("../ext-ip")(((cliParams) => {
    // noinspection JSUnresolvedVariable
    let config = {
        mode           : cliParams.parallel ? "parallel" : "sequential",
        timeout        : cliParams.timeout || defaults.timeout,
        userAgent      : cliParams.userAgent || defaults.userAgent,
        followRedirect : cliParams.follow || defaults.followRedirect,
    };

    if( cliParams.services.length ) {
        // passing replace is only needed when additional services are passed
        config.replace  = cliParams.replace || defaults.replace;
        config.services = cliParams.services;
    }

    return config;
})(cli));

// execute ip address receive
extIP.get().then(ip => {
    console.log(ip);
})

// error while receive
.catch(err => {
    console.error(err);
    process.exit(1);
});
