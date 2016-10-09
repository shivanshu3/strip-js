# strip-js
NPM Module which strips out all JavaScript code from some HTML text

This module performs the following tasks
- Sanitizes HTML
- Removes script tags
- Removes attributes such as "onclick", "onerror", etc. which contain JavaScript code
- Removes "href" attributes which contain JavaScript code

## Installation
`npm install strip-js`

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
         This is some text in a p tag, but the p tag isn't closed!
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
         This is some text in a p tag, but the p tag isn't closed!
      </p>
   </body>
</html>
```

Using this module is easy!
```javascript
var stripJs = require('strip-js');
var html = fs.readFileSync('./webpage.html');
var safeHtml = stripJs(html); // It returns plain HTML text
```
