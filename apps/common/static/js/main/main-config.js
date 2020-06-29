/**
 * The configuration for the main page.
 * Every included page should have a package (eg. window.mktv.home)
 * which should satisfy the MainSubPage Interface (MainSubPageInterface.js).
 */
(function () {
    'use strict';

    // Import
    var utils = window.mktv.utils;

    var baseTitle = 'MuslimKids.TV';

    var config = {
        defaultPage: 'blog',
        pages: {
            'blog': {
                title: baseTitle + ' > Blog',
                description: "Learn all about Muslim Kids TV on our blog. Helpful articles for parents, teachers and children. FAQs (Frequently Asked Questions), instructions and How-To's.",
                navItemSelector: '.nav-blog',
                bodyClass: 'body-blog-page main-page',
                sectionName: 'blog',
                start: window.mktv.blog.MSPInterface.start,
                end: function (callback) { callback(); },
                getHtmlUrl: function (query) { return '/blog'; }
            },
            'blog-post-list': {
                title: baseTitle + ' > Blog',
                description: "Learn all about Muslim Kids TV on our blog. Helpful articles for parents, teachers and children. FAQs (Frequently Asked Questions), instructions and How-To's.",
                navItemSelector: '.nav-blog',
                bodyClass: 'body-blog-page post-list-page',
                sectionName: 'blog',
                start: window.mktv.blogList.MSPInterface.start,
                end: function (callback) { callback(); },
                getHtmlUrl: function (query) {
                    return '/blog/category/' + getQueryParam(query, 'category_id', '');
                }
            },
            'blog-post-details': {
                title: baseTitle + ' > Blog',
                description: "Learn all about Muslim Kids TV on our blog. Helpful articles for parents, teachers and children. FAQs (Frequently Asked Questions), instructions and How-To's.",
                navItemSelector: '.nav-blog',
                bodyClass: 'body-blog-page post-detail-page',
                sectionName: 'blog',
                start: window.mktv.blogDetail.MSPInterface.start,
                end: function (callback) { callback(); },
                getHtmlUrl: function (query) {
                    return '/blog/post/' + getQueryParam(query, 'post_id', '');
                }
            },
            '404': {
                title: baseTitle + ' > Not Found',
                description: "Page not found",
                navItemSelector: '',
                bodyClass: 'body-exception',
                sectionName: '404_MainSubPage',
                start: function (callback) {
                    utils.logToSentry('MainSubPage not found in main-config, hash: ' + window.location.hash);
                    callback();
                },
                end: function (callback) { callback(); },
                getHtmlUrl: function (query) { return '/404/'; }
            }
        }
    };

    function getQueryParam (query, param, defaultValue) {
        var matches = query.match(new RegExp(param + '=([^&]+)'));
        if (matches && matches.length >= 2) {
            return matches[1];
        }
        return defaultValue || '';
    }

    window.mktv = window.mktv || {};
    window.mktv.main = window.mktv.main || {};
    window.mktv.main.config = config;
}());
