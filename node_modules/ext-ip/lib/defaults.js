module.exports = {
    /**
     * 'sequential' or 'parallel' ip fetching
     * @type {string}
     */
    mode: "sequential",

    /**
     * true: replaces the default services
     * false: extends them
     * @type {boolean}
     */
    replace: false,

    /**
     * array of urls that return the ip in the document body
     * @type {Array}
     */
    services: [
        "http://icanhazip.com/",
        "http://ifconfig.io/ip",
        "http://ip.appspot.com/",
        "http://ident.me/",
        "http://whatismyip.akamai.com/",
        "http://tnx.nl/ip",
        "http://myip.dnsomatic.com/",
        "http://ipecho.net/plain",
        "http://diagnostic.opendns.com/myip",
        "http://api.ipify.org/",
        "http://trackip.net/ip"
    ],

    /**
     * timeout per request
     * @type {number}
     */
    timeout: 1000,

    /**
     * http(s).Agent instance to use
     * @type {http.Agent|https.Agent}
     */
    agent: null,

    /**
     * user agent used for ip requests
     * @type {string}
     */
    userAgent: "curl/",

    /**
     * follow htt 3xx responses as redirects
     * @type {boolean}
     */
    followRedirect: true,

    /**
     * maximum redirect count
     * @type {number}
     */
    maxRedirects: 10
};