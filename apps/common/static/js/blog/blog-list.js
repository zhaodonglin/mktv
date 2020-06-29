(function () {
    'use strict';

    var MSPInterface = {};

    MSPInterface.start = function (callback) {

        $('.category-filter').on('change', 'select[name="categories"]', function () {
            var elem = $(this);
            elem.attr('disable', true);

            $.get($(this).val(), function (data) {
               $('#content-part').fadeOut(300, function () {
                   $(this).html(data);
               }).fadeIn(600, function () {
                   $(this).find('.InfiniteScroll').InfiniteScroll();
                   elem.attr('disabled', false);
               });
           });
        });


        callback();
    };

    window.mktv = window.mktv || {};
    window.mktv.blogList = window.mktv.blogList || {};
    window.mktv.blogList.MSPInterface = MSPInterface;

}());