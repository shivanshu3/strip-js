var cheerio = require('cheerio');
var sanitizeHtml = require('sanitize-html');

var stripJs = function(htmlContent) {
   // Basic input validation:
   if ((htmlContent == undefined) || (htmlContent == null) ||
       (typeof htmlContent != 'string')) {
      return '';
   }

   // Sanitize the HTML first:
   htmlContent = sanitizeHtml(htmlContent, {
      allowedTags: false,
      allowedAttributes: false
   });

   var $ = cheerio.load(htmlContent);

   // Remove all script tags:
   $('script').remove();

   // Remove all attributes which contain javascipt:
   var domElements = $('*');
   for (var i = 0; i < domElements.length; i++) {
      var domElement = domElements[i];
      var attribs = Object.keys(domElement.attribs);
      domElement = $(domElement);
      for (var j = 0; j < attribs.length; j++) {
         var attrib = attribs[j];

         // Remove all JS event attributes which start with on like onclick
         if (/^on/i.test(attrib)) {
            domElement.removeAttr(attrib);
         }

         // Remove href attributes which contain JS
         if ((/href/i.test(attrib)) &&
             (/^\s*javascript/.test(domElement.attr(attrib)))) {
            domElement.removeAttr(attrib);
         }
      }
   }

   return $.html();
}

module.exports = stripJs;
