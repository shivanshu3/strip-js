#!/usr/bin/env node

var stripJs = require('./index.js');
var fs = require('fs');

var html = fs.readFileSync('/dev/stdin').toString();
console.log(stripJs(html));
