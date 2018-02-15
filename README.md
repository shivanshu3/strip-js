# strip-js

<img src="http://shivanshu.ca/myfiles/strip-js-logo.svg" width="100" align="right" style="float:right;"/>

[![NPM Version][npm-image]][npm-url]
[![Travis Build][travis-image]][travis-url]

NPM Module which strips out all JavaScript code from some HTML text

This module performs the following tasks:
- Sanitizes HTML
- Removes script tags
- Removes attributes such as "onclick", "onerror", etc. which contain JavaScript code
- Removes "href" attributes which contain JavaScript code
- Removes "action" attributes from form tags

An example use case of this module is to sanitize HTML emails before displaying them in a browser to prevent cross-site scripting attacks.

## Installation
`npm install strip-js`

This module can also be used from the command line. Install it globally using the following command:

`sudo npm install -g strip-js`

## Usage
The following input HTML ...
```html
<html>
   <body>
      <script src="foo.js"></script>
      <img src="image.gif" onerror="stealSession(document.cookie)" foo="bar">
      <a href="javascript:stealSession(document.cookie)" target="_blank">Dangerous Link</a>
      <a href="http://www.google.com" target="_blank">Safe Link</a>
      <form action="steal_cookies.php" foo="bar"></form>
      <p>
         This is some text in a p tag, but the p tag is not closed!
   </body>
</html>
```

... is converted to the following:
```html
<html>
   <body>
      <img src="image.gif" foo="bar">
      <a target="_blank">Dangerous Link</a>
      <a href="http://www.google.com" target="_blank">Safe Link</a>
      <form foo="bar"></form>
      <p>
         This is some text in a p tag, but the p tag is not closed!
      </p>
   </body>
</html>
```

Using this module is easy!
```javascript
var stripJs = require('strip-js');
var fs = require('fs');
var html = fs.readFileSync('./webpage.html').toString();
var safeHtml = stripJs(html); // It returns plain HTML text
```

If you need to preserve doctypes, use `var safeHtml = stripJs(html, { preserveDoctypes: true });`. `preserveDoctypes` defaults to false.

For command line usage, install it globally. It reads the input HTML from its stdin and outputs the result to stdout.
```bash
strip-js < input.html
```
## Warnings

Some old browsers have XSS vulnerabilities in CSS, as mentioned in the <a href="https://code.google.com/archive/p/browsersec/wikis/Part1.wiki" target="_blank">browser security handbook</a>:
> The risk of JavaScript execution. As a little-known feature, some CSS implementations permit JavaScript code to be embedded in stylesheets. There are at least three ways to achieve this goal: by using the expression(...) directive, which gives the ability to evaluate arbitrary JavaScript statements and use their value as a CSS parameter; by using the url('javascript:...') directive on properties that support it; or by invoking browser-specific features such as the -moz-binding mechanism of Firefox.

This module does not remove any JavaScript from CSS, so it is recommended that you enforce one of the following browsers in your web app:
- Edge
- IE11
- FF3
- Safari
- Chrome
- Android

All these browsers are safe in that they don't allow JavaScript execution in CSS. Please feel free to add more browsers to this list after testing them, and send a pull request.

[npm-url]: https://www.npmjs.com/package/strip-js
[npm-image]: https://img.shields.io/npm/v/strip-js.svg?style=flat
[travis-url]: https://travis-ci.org/shivanshu3/strip-js
[travis-image]: https://img.shields.io/travis/shivanshu3/strip-js.svg
