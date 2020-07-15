require('./string-ansi').test();

console.log("This line should be red and bold.".color('red', 'bold'));
console.log("This line should be green with a yellow background.".color('green', 'bgyellow'));
