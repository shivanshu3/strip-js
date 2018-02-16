var cheerio = require('cheerio');
var sanitizeHtml = require('sanitize-html');
var defaultOpts = { preserveDoctypes: false };
var doctypeRegex = /^\s*<!DOCTYPE .*?>/i;

var stripJs = function(htmlContent, opts) {
   opts = Object.assign({}, defaultOpts, opts);
  
   // Basic input validation:
   if ((htmlContent == undefined) || (htmlContent == null) ||
       (typeof htmlContent != 'string')) {
      return '';
   }

   // Sanitize the HTML first:
   var doctypes;
   if (opts.preserveDoctypes) {
      doctypes = htmlContent.match(doctypeRegex);
   }
   
   htmlContent = sanitizeHtml(htmlContent, {
      allowedTags: false,
      allowedAttributes: false,
      allowedSchemesByTag: {
         img: ['http', 'https', 'data', 'cid']
      }
   });
   
   // Preserve doctype
   if (doctypes && doctypes.length) {
     htmlContent = doctypes[0] + htmlContent
   }

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
             (/^\s*javascript/i.test(domElement.attr(attrib)))) {
            domElement.removeAttr(attrib);
         }
      }
   }

   // Remove 'action' attributes from 'form' tags:
   var formElements = $('form');
   for (var i = 0; i < formElements.length; i++) {
      domElement.removeAttr('action');
   }
   
   // Remove link elements with 'as' attribute equalling to 'script'
   $('link[as="script"]').remove();

   return $.html();
}

module.exports = stripJs;
