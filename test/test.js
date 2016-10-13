var fs = require('fs');
var htmlclean = require('htmlclean');
var assert = require('assert');

// The module should load:
var stripJs = require('../index.js');

// Testing bad inputs:
assert(stripJs('') === '');
assert(stripJs(null) === '');
assert(stripJs(undefined) === '');

// Test non HTML strings with whitespace:
assert(stripJs('  foo bar  ') === '  foo bar  ');

// Load an HTML file and strip out all JS, and remove whitespace from it:
var inputHtml = fs.readFileSync('./test/input.html').toString();
var processedHtml = stripJs(inputHtml);
processedHtml = htmlclean(processedHtml);

// and it shouldn't have any JS in it:
assert(processedHtml === '<html><body> <img src="image.gif" foo="bar"> ' +
   '<a target="_blank">Dangerous Link</a> <a href="http://www.google.com" ' +
   'target="_blank">Safe Link</a><p> This is some text in a p tag, but the p ' +
   'tag is not closed!</p></body></html>');

// TODO: More test cases?

console.log('All tests pass.');
