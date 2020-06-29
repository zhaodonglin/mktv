/* --- MainSubPage Interface --- */

var MSPInterface = {};

/**
 * {string} Indicates what the title on the browser tab should be.
 */
MSPInterface.title = 'MKTV > Example';

/**
 * {string} Indicates what the description meta tag should be.
 */
MSPInterface.description = 'The best Islamic cartoons, videos, songs, games, books, coloring pages and worksheets for children 2-12 years';

/**
 * {string} The jQuery selector that can be used to find the section's
 * navigation item in the header.
 */
MSPInterface.navItemSelector = '.some-class';

/**
 * {string} Classes that should be added to the body element.
 * Overwrites current body classes.
 * (not pretty, but allows for easier conversion to single page views.)
 */
MSPInterface.bodyClass = 'some-class other-class';

/**
 * {string} The name of the page's "section".
 * The name must correspond to a "SECTIONS" name in the "TimeLog" class (activity/models.py).
 */
MSPInterface.sectionName = 'section-name';

/**
 * Sets up the page's logic.
 *
 * @param {function(err)} callback - Called when the set up is complete
 */
MSPInterface.start = function (callback) {
    // ...
};

/**
 * Handle any end of page events.
 * And cleans up the page so it won't interfere with other pages.
 *
 * @param {function(err)} callback - Called when clean up is finished
 */
MSPInterface.end = function (callback) {
    // ...
};

/**
 * Returns the url that should be used to request the html.
 *
 * @param {string} query - The query portion of the has tag.
 *
 * @return {string} The url that should be used.
 */
MSPInterface.getHtmlUrl = function (query) {
    return '/some/url';
};
