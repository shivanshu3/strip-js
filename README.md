# strip-js

[![NPM Version][npm-image]][npm-url]
[![Travis Build][travis-image]][travis-url]

NPM Module which strips out all JavaScript code from some HTML text

This module performs the following tasks:
- Sanitizes HTML
- Removes script tags
- Removes attributes such as "onclick", "onerror", etc. which contain JavaScript code
- Removes "href" attributes which contain JavaScript code

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

For command line usage, install it globally. It reads the input HTML from its stdin and outputs the result to stdout.
```bash
strip-js < input.html
```

[npm-url]: https://www.npmjs.com/package/strip-js
[npm-image]: https://img.shields.io/npm/v/strip-js.svg?style=flat
[travis-url]: https://travis-ci.org/shivanshu3/strip-js
[travis-image]: https://img.shields.io/travis/shivanshu3/strip-js.svg
