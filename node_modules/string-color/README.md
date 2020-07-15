String ANSI
----------------

A minimalist color extension module for Node.JS.

Extends the String prototype with the function `color`, which inserts ANSI color codes in place of color string names.

Run `node test.js` to see a demonstrative list of all possible colors.

Supported Color Codes
-----------------

* reset
* bold
* italic
* underline
* conceal
* strike
* reverse
* blink
* blink2
* black
* red
* green
* yellow 
* blue
* purple
* cyan
* white
* default
* bgblack
* bgred
* bggreen
* bgyellow
* bgblue
* bgpurple
* bgcyan
* bgwhite
* bgdefault

Example Usage
-----------------

    console.log("There has been an error!".color('red', 'bold');

Any number of arguments may be passed to the color method.
