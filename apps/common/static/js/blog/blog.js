(function () {
    'use strict';

    var MSPInterface = {};

    MSPInterface.start = function (callback) {
        // Init blog slider
        var blogSlider = $('#featured-posts').find('.slides');
        blogSlider.owlCarousel({
            loop: true,
            nav: true,
            dots: false,
            margin: 15,
            navText: ['<div class="prev-control"></div>', '<div class="next-control"></div>'],
            items: 1
        });

        callback();
    };

    window.mktv = window.mktv || {};
    window.mktv.blog = window.mktv.blog || {};
    window.mktv.blog.MSPInterface = MSPInterface;

}());