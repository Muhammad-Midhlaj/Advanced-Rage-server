var describe        = require('../describe'),
    tests           = require('./tests');

describe.getResults(function(data) {
	var groups = data.results, failures = {};
	for (var n in groups) {
		for (var o in groups[n].results) {
			if (o.match(/\(this should fail\)$/)) {
				if (!groups[n].results[o]) {
					failures[n+'#'+o] = new Error("Expected test failure.");
				}
			} else if (groups[n].results[o]) {
				failures[n+'#'+o] = groups[n].results[o];
			}
		} 
	}console.log(failures);
});