# describe

Describe provides a simple method for testing asynchronous and synchronous
code within JavaScript projects.

## API Documentation

### describe

describe( *groupName*, *tests*[, *options*] );

#### Arguments

- *groupName* (string): A human-readable description of the test group.
- *tests* (object): An object made up of human-readable test descriptions as 
keys and functions to run as tests.  Tests functions will be given access to
`this.expect`.
- *options*: Configuration options.  Possible values:
	- timeout (int): The max amount of time in milliseconds to wait for a test 
to run before timing out.
	- callbackMode (string): if set to 'node', this.expect will treat the first
argument to the callback as an error and the second argument as the result.

### describe.config

describe.config( *key*, *value* )

Sets the global configuration for tests.

### Synchronous Assertions

this.expect( *subject*, *expected* )

#### Arguments

- *subject* (mixed): the actual result.
- *expected* (mixed): the expected result.

#### Example

```javascript
describe("assertions", {
	'basic synchronous expectation': function() {
		this.expect(42, 42);
	}
});
```

### Asynchronous Assertions

By passing this.expect as the callback parameter to an asynchronous function,
describe will know to wait for the result of the operation before checking to
see if the result matches what was expected.

this.expect( *expected* )

#### Basic Callbacks

```javascript
function addNumbersAsync(a, b, callback) {
	callback(a+b);
}

describe("assertions", {
	'basic asynchronous expectation': function() {
		addNumbersAsync(2, 2, this.expect(4));
	}
});
```

#### Node.js-style (e, data) Callbacks

```javascript
function addNumbersAsync(a, b, callback) {
	callback(null, a+b);
}

describe("assertions", {
	'basic asynchronous expectation': function() {
		addNumbersAsync(2, 2, this.expect(4));
	}
}, { callbackMode: 'node' });
```

#### Promises-style Callbacks

```javascript
function addThingsPromise() {
	var n = 0;
	for (var i in arguments) n+=arguments[i];
	return {
		then: function(success, failure) {
			success(n);
		}
	};
}

describe("promise callback style", {
	'promises-style addition': function() {
		this.expect(addThingsPromise(2, 2), 4);
	}
}, {
	callbackMode: 'promises'
});
```

### describe.getResults

An asynchronous method.  Calls back with the results of all tests described up
to that point.  You should probably wait until you're done defining tests to
call this.

#### Example Results

```javascript
{ 
	passed: 1,
	total: 2,
	results: {
		"sample test group": {
			passed: 1,
			total: 2,
			results: {
				"this test passed because its error is null": null,
				"this test failed because there's an error": "Error or message"
			}
		}
	}
}
```

### describe.logResults

Gets the results and outputs them either to the DOM or the console.

### Test Hooks

Each test group supports beforeEach, afterEach, beforeAll, and afterAll as
test hooks.

#### Example

```javascript
(function() {

	var arr = [], bowties;

	describe('array stuff', {
		beforeAll: function() {
			bowties = 'cool';
		},
		beforeEach: function() {
			arr = arr.concat(1,2,3);
		},
		afterEach: function() {
			arr = [];
		},
		afterAll: function() {
			tests = null;
		},
		'bowties are cool': function() {
			this.expect(bowties, 'cool');
		},
		'arrays have three things': function() {
			this.expect(arr.length, 3);
			arr.push(5);
		},
		'arrays still have three things': function() {
			this.expect(arr.length, 3);
		}
	});

}());
```