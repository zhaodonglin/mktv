/**
 * Provides functions to control the view.
 */
(function () {
    'use strict';

    var viewLibs = window.mktv.viewLibraries;

    var view = {};
    var _prevBodyClass = '';

    view.setBodyClass = function (classes) {
        $('body').removeClass(_prevBodyClass);
        _prevBodyClass = classes;
        $('body').addClass(classes);
    };

    view.setDescriptionMetaTag = function (description) {
        // Multiple people on SO advised to remove and re-add instead of modifying. Not sure why.
        $('meta[name=description]').remove();
        $('head').append('<meta name="description" content="' + description + '">');
        $('meta[property="og:description"]').remove();
        $('head').append('<meta property="og:description" content="' + description + '">');
    };

    view.loadHtml = function (html, callback) {
        callback = callback || function () {};

        var main = $('main')[0];
        main.innerHTML = html;
        $('body')[0].scrollIntoView(true);

        // Trigger "redesign" magic >.>
        viewLibs.triggerRedesign();
        callback();
    };

    window.mktv = window.mktv || {};
    window.mktv.main = window.mktv.main || {};
    window.mktv.main.view = view;
}());
