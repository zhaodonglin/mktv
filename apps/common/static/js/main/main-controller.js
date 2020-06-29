/**
 * Controls the main page.
 * Mostly is all about swapping in and out the sub pages.
 */
(function () {
    'use strict';

    var utils = window.mktv.utils;
    var viewLibs = window.mktv.viewLibraries;
    var HeaderComponent = window.mktv.components.Header;
    var config = window.mktv.main.config;
    var view = window.mktv.main.view;

    /** Internal vars **/

    var _ignore_hashchange_for_url = '';
    var _latestRequestedPage;
    var _currentPage = {
        end: function (callback) { callback(); }
    };
    var _header = new HeaderComponent();

    /** START setup **/

    window.addEventListener('hashchange', function (e) {

        var curUrl = window.location.href;
        // If _ignore_hashchange_url is not empty and matches the end of curUrl
        var matchesIgnoreUrl = _ignore_hashchange_for_url !== '' && curUrl.endsWith(_ignore_hashchange_for_url);
        // Always reset _ignore_hashchange_for_url (even if we didn't hit that url)
        _ignore_hashchange_for_url = '';
        if (matchesIgnoreUrl) {
            // If matches ignore url, ignore it.
            return;
        }
        loadCurrentPage();
    });

    // If we do not have a hash on load
    if (!window.location.hash) {
        // Go to the defaultPage page
        window.location.hash = config.defaultPage;
    } else {
        // Trigger the page load
        loadCurrentPage();
    }

    /** END setup **/

    function getCurrentPage () {
        var hash = window.location.hash.substring(1);
        var queryStartIndex = hash.indexOf('?');
        var hashQuery = '';
        if (queryStartIndex !== -1) {
            hashQuery = hash.substring(queryStartIndex + 1);
            hash = hash.substring(0, queryStartIndex);
        }
        // Default to the 404 page if nothing was found
        var page = config.pages[hash] || config.pages['404'];
        page.hashQuery = hashQuery;
        return page;
    }

    function loadCurrentPage () {
        viewLibs.showLoadingSpinner();

        var page = getCurrentPage();
        var requestingPage = window.location.hash;
        // Set latest requested page
        _latestRequestedPage = requestingPage;

        var newHtml;
        // Create a sync barrier that allows to start unloading the page
        // and getting the new html asynchronously
        var barrier = utils.syncBarrier(2, displayPage);

        // Unload the previous page
        _currentPage.end(barrier);

        page.htmlUrl = page.getHtmlUrl(page.hashQuery);

        // Get the new page's initial html
        $.ajax({
            url: page.htmlUrl,
            headers: {
                // Don't mark our request as an ajax request (because this results in the content being returned)
                // Instead mark this request as a MainSubPage request (aka. we should be returned a MainSubPage)
                'X-Requested-With': 'MainSubPage'
            },
            success: function (data, status, xhr) {
                newHtml = data;
                barrier();
            },
            error: function (xhr, status, error) {
                // We did not have success, but we don't need to log to sentry
                // because the backend should be doing that

                // If the response specifically has a redirect
                if (xhr.responseJSON && xhr.responseJSON.redirect) {
                    window.location.href = xhr.responseJSON.redirect;
                    return;
                }

                // Otherwise, set the page start/end to nothing by creating a
                // deep copy of page (so we don't affect the actual page config)
                // but maintain the page's title and styling
                page = $.extend(true, {}, page);
                // And overriding attributes as needed
                page.end = function (callback) { callback(); };
                page.start = function (callback) { callback(); };

                // If we got a responseText, display whatever we got
                if (xhr.responseText) {
                    newHtml = xhr.responseText;
                } else {
                    // Else, display default error
                    newHtml = '<div class="text-center text-white">' +
                    '<br><br><br><h3>Sorry, we had trouble loading, an error has been reported.</h3><br>' +
                    '<button class="btn btn-green small" onclick="window.history.back()">Go Back</button>' +
                    '</div>';
                }
                barrier();
            }
        });

        function displayPage (errs) {
            if (requestingPage !== _latestRequestedPage) {
                // We are a very slow loading request, another page has already been loaded
                // So do nothing/cancel this
                return;
            }
            if (errs) {
                // Log any errors, but attempt to proceed (we really shouldn't ever get here)
                utils.logToSentry(errs);
            }

            // Set current page
            _currentPage = page;
            // Update the navbar
            _header.setSelectedPage(page.navItemSelector);
            // Set the page's title
            window.document.title = page.title;
            // Set body class
            view.setBodyClass(page.bodyClass);
            // Set description meta tag
            view.setDescriptionMetaTag(page.description);
            // Load the page into the view
            view.loadHtml(newHtml, function () {
                // Start the page's logic
                page.start(function () {
                    $('.loading').hide();
                });
            });
        }
    }

    var exposed = {};

    exposed.changeHashNoAction = function (url) {
        _ignore_hashchange_for_url = url;
        window.location = url;
    };

    window.mktv = window.mktv || {};
    window.mktv.main = window.mktv.main || {};
    window.mktv.main.fn = exposed;

}());
