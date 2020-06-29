(function () {
    'use strict';

    /**
     * Initialize the header component.
     */
    var HeaderComponent = function () {
    };

    HeaderComponent.prototype.setSelectedPage = function (navItemSelector) {
        $('.navbar-nav .selected').removeClass('selected');
        if (navItemSelector) {
            $('.navbar-nav ' + navItemSelector).addClass('selected');
        }
    };

    window.mktv = window.mktv || {};
    window.mktv.components = window.mktv.components || {};
    window.mktv.components.Header = HeaderComponent;

}());
