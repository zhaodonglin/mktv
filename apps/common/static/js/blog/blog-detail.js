(function () {
    'use strict';

    var CommentsComponent = window.mktv.components.Comments;
    var MSPInterface = {};

    MSPInterface.start = function (callback) {

        var comments = $('.comments-wrap');
        var url = comments.data('url');

        this._comments = new CommentsComponent(null, comments);
        this._comments.update(null, url);
        this._comments.enable(true);
        this._comments.showCommentPanel(true, false);

        $('main iframe').parent().addClass('embed-container');


        callback();
    };

    window.mktv = window.mktv || {};
    window.mktv.blogDetail = window.mktv.blogDetail || {};
    window.mktv.blogDetail.MSPInterface = MSPInterface;

}());