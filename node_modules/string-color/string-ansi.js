String.prototype.color = function() {
	if (!arguments) return this;
	var colors;
	if (arguments.length==1 && typeof(colors)=="string") colors = [arguments[i]];
	colors = arguments;
	var code = '';
	for (var i = 0;i<colors.length;i++) code+=ANSI.get(colors[i]);
	return code+this+ANSI.get('reset');
};

//ANSI color and style codes.
var ANSI = {

	'prefix'    : "\u001B[",
	'suffix'    : "m",

	//Styles
	
	'reset'     :  0,
	'bold'      :  1,
	'/bold'     : 22,
	'italic'    :  3,
	'/italic'   : 23,
	'underline' :  4,
	'/underline': 24,
	'conceal'   :  8,
	'strike'    :  9,
	'/strike'   : 29,
	'reverse'   :  7,
	'blink'     :  5,
	'blink2'    :  6,
	
	//Colors
	
	'black'     : 30,
	'red'       : 31,
	'green'     : 32,
	'yellow'    : 33,
	'blue'      : 34,
	'purple'    : 35,
	'cyan'      : 36,
	'white'     : 37,
	'default'   : 39,

	//Backgrounds

	'bgblack'   : 40,
	'bgred'     : 41,
	'bggreen'   : 42,
	'bgyellow'  : 43,
	'bgblue'    : 44,
	'bgpurple'  : 45,
	'bgcyan'    : 46,
	'bgwhite'   : 47,
	'bgdefault' : 49,

	'get': function(color) {
		code = this[color];
		if (code===false) return 0;
		return this.prefix+code+this.suffix;
	}

};

exports.test = function() {
	var supported = [];
	for (code in ANSI) {
		if (!ANSI.hasOwnProperty(code)) continue;
		if (code.match(/\W/)) continue;
		if (typeof(ANSI[code])!="number") continue;
		supported[supported.length] = code;
	}
	str = "Supported color codes are: ";
	for (var i = 0;i<supported.length;i++) {
		str += supported[i].color(supported[i])+' ';
	}
	console.log(str);
};
