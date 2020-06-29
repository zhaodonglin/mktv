(function () {
    'use strict';

    var utils = window.mktv.utils;

    /**
     * Initialize a comment component.
     *
     * @param {jQuery Element} commentButton
     * @param {jQuery Element} commentPanel
     */
    var CommentsComponent = function (commentButton, commentPanel) {
        this.disabled = true;

        this.button = commentButton;
        this.panel = commentPanel;

        var self = this;

        if (self.button) {
            self.button.on('click', function (e) {
                if (self.disabled) { return; }
                self.showCommentPanel(!self.button.hasClass('active'), !self.button.hasClass('active'));
            });
        }
    };

    CommentsComponent.prototype.update = function (comments_count, url) {
        this.reset();
        if (this.button && comments_count) this.button.find('.count').text(comments_count);
        this.url = url;
    };

    CommentsComponent.prototype.reset = function () {
        this.showCommentPanel(false, false);
        this.url = false;
    };

    CommentsComponent.prototype.enable = function (enable) {
        this.disabled = !enable;
    };

    CommentsComponent.prototype.showCommentPanel = function (show, scrollIntoView) {
        if (!show || !this.url) {
            if (this.button) this.button.removeClass('active');
            this.panel.hide();
            this.panel.find('.ajax-content-wrap').fadeOut(300);
            return;
        }
        var self = this;
        // Get the comments panel html
        $.ajax({
            url: self.url,
            success: function (html) {
                if (self.button) self.button.addClass('active');
                self.panel.find('.ajax-content-wrap').html(html);

                // Add panel listeners
                self.panel.find('.comment-form').on('submit', function (e) {
                    e.preventDefault();
                    $(this).ajaxSubmit({
                        success: function (data) {
                            self.panel.find('.comment-input').val('');
                            $('#submit-waiting-modal').modal('hide');
                            noty({
                                text: 'Comment was added.',
                                type: 'success'
                            });
                        },
                        error: function (data) {
                            $('#submit-waiting-modal').modal('hide');
                            noty({
                                text: 'Error during saving comment, please try again later!',
                                type: 'error'
                            });
                        }
                    });
                });
                self.panel.find('.erase-comment-btn').on('click', function (e) {
                    self.panel.find('.comment-input').val('');
                });
                // Show panel
                self.panel.show();
                self.panel.find('.ajax-content-wrap').fadeIn(600, function () {
                    self.panel.find('.InfiniteScroll').InfiniteScroll();
                    if (scrollIntoView) {
                        self.panel[0].scrollIntoView({ block: 'end', behavior: 'smooth' });
                    }
                });
            },
            error: function (xhr, status, error) {
                utils.logToSentry(status + ': ' + xhr.status + ' ' + error);
            }
        });
    };

    window.mktv = window.mktv || {};
    window.mktv.components = window.mktv.components || {};
    window.mktv.components.Comments = CommentsComponent;

}());
