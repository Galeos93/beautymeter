import {ajaxUtils} from '../js/ajax-utils';

var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
};

var insertHtmlFromUrl = function (selector, url) {
    ajaxUtils.sendGetRequest(
        url,
        function (html) {
            insertHtml(selector, html)
        },
        false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
};

var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

var insertLoadingIcon = function (selector) {
  var html = "<div class='container justify-content-center align-self-center text-center'>";
  html += "<img id='loading_icon' src='../static/images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

export {insertHtml, insertHtmlFromUrl, insertProperty, insertLoadingIcon};

