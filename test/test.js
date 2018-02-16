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

// Load an HTML file and strip out all JS, and remove whitespace from it
// While preserving its doctype
var inputHtml = fs.readFileSync('./test/input.html').toString();
var processedHtml = stripJs(inputHtml, { preserveDoctypes: true });
processedHtml = htmlclean(processedHtml);

// and it shouldn't have any JS in it:
assert(processedHtml === '<!DOCTYPE html><html><body> <img src="image.gif" foo="bar"> ' +
   '<a target="_blank">Dangerous Link</a> <a href="http://www.google.com" ' +
   'target="_blank">Safe Link</a><p> This is some text in a p tag, but the p ' +
   'tag is not closed!</p></body></html>');

// Strip out some JS and also remove the DOCTYPE:
// Also test that the preserveDoctypes option defaults to false:
assert(stripJs('<!DOCTYPE html><html><body><a href="javascript:console.log(2)"></a></body></html>')
   === '<html><body><a></a></body></html>');

// The action attribute should be deleted from form tags but no other attributes:
var inputHtml = '<form action="steal_cookies.php" foo="bar"></form>';
var processedHtml = stripJs(inputHtml);
processedHtml = htmlclean(processedHtml);
assert(processedHtml === '<form foo="bar"></form>');

// The action attribute should be not be deleted from non form tags:
var inputHtml = '<p action="steal_cookies.php"></p>';
var processedHtml = stripJs(inputHtml);
processedHtml = htmlclean(processedHtml);
assert(processedHtml === '<p action="steal_cookies.php"></p>');

// Case sensitivity and whitespace tests:
assert(stripJs('<A HREF = " JavaScript : console.log(2) ">') == '<a></a>');
assert(stripJs('<P ONClick="console.log(2)" Foo="Bar">') == '<p foo="Bar"></p>');

// URL schemes for images:
// Only the allowed ones should work
// Also a src attribute with no scheme should work as well (first test case):
assert(stripJs('<img src="foo.jpg">') ==
   '<img src="foo.jpg">');
assert(stripJs('<img src="http://example.com">') ==
   '<img src="http://example.com">');
assert(stripJs('<img src="https://example.com">') ==
   '<img src="https://example.com">');
assert(stripJs('<img src="data:foo">') ==
   '<img src="data:foo">');
assert(stripJs('<img src="cid:foo">') ==
   '<img src="cid:foo">');
assert(stripJs('<img src="foo:bar">') ==
   '<img>');
   
// Scripts cannot be injected through links
assert.equal(stripJs('<link rel="preload" href="https://adservice.google.com.sg/adsid/' +
  'integrator.js?domain=sourceforge.net" as="script">'), '');

console.log('All tests pass.');
