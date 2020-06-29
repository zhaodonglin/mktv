/**
 *  TODO Fix/take apart this file.
 *  TODO should not be adding functions to the jQuery object ($) ... what is going on here?
 */
(function () {
    var view = {};

    // Utilities
    $.utilities = {
        uuid: function () {
            function s4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    };

    // Loading Panel
    $.loadingPanel = {
        show: function (elem, loadingText) {
            this.remove(elem);

            var html = '<div class="page-load-status loading-panel"><div class="loading-wrap">' +
                '<div class="infinite-scroll-request">' +
                '<div class="loader-ellips">' +
                '<div class="loader-text">' + loadingText + '</div>' +
                '<div class="loader-dots">' +
                '<span class="loader-ellips__dot"></span>' +
                '<span class="loader-ellips__dot"></span>' +
                '<span class="loader-ellips__dot"></span>' +
                '<span class="loader-ellips__dot"></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div></div>';

            elem.append(html);
        },
        remove: function (elem) {
            elem.find('.loading-panel').remove();
        },
        hide: function (elem) {
            elem.find('.loading-panel').hide();
        }
    };

    // InfiniteScroll
    $.fn.InfiniteScroll = function () {
        var self = $(this);
        var selector = '.' + self[0].className.replace(/ /g, '.');
        var elem = document.querySelector(selector);
        var infScroll = null;

        if (elem && elem.dataset.url) {
            var num_pages = parseInt(elem.dataset.number_pages) || 0;
            var loaded_pages = parseInt(elem.dataset.loaded_pages) || 0;
            var element_scroll = elem.dataset.element_scroll || null;
            if (!num_pages || ((num_pages && loaded_pages) && (num_pages - loaded_pages <= 0))) {
                return;
            }

            var wrapper = self.parent();
            if (elem.dataset.loading_panel) {
                wrapper = self.closest(elem.dataset.loading_panel);
            }
            // Append the loading text after the element
            if (elem.dataset.loading_text === 'false') {
                $.loadingPanel.show(wrapper, '');
            } else if (elem.dataset.loading_text) {
                $.loadingPanel.show(wrapper, elem.dataset.loading_text);
            } else {
                $.loadingPanel.show(wrapper, 'Loading more...');
            }
            $.loadingPanel.hide(wrapper);

            var isHorizontal = elem.dataset.horizontal;
            var settings = {
                history: false,
                scrollThreshold: isHorizontal ? false : 400,
                path: function () {
                    function updateQueryStringParameter (uri, key, value) {
                        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
                        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
                        if (uri.match(re)) {
                            return uri.replace(re, '$1' + key + '=' + value + '$2');
                        } else {
                            return uri + separator + key + '=' + value;
                        }
                    }

                    if (num_pages > 0) {
                        var pageNumber = this.loadCount + loaded_pages;
                        if (pageNumber < num_pages) {
                            return updateQueryStringParameter(elem.dataset.url, 'page', (pageNumber + 1));
                            // return elem.dataset.url + '?page=' + (pageNumber + 1);
                        }
                    }
                },
                // Appends selected elements from loaded page to the container.
                append: elem.dataset.append_el || false,
                status: '.page-load-status'
            };
            if (element_scroll) {
                settings.elementScroll = element_scroll;
            }
            infScroll = new window.InfiniteScroll(elem, settings);

            infScroll.on('load', function (response, path) {
                self.attr('data-loaded_pages', infScroll.pageIndex);
                self.data('loaded_pages', infScroll.pageIndex);
            });

            if (isHorizontal && infScroll !== undefined) {
                var scrollbar = self.closest('.mCustomScrollbar');
                if (scrollbar.length) {
                    scrollbar.mCustomScrollbar({
                        callbacks: {
                            onTotalScrollOffset: 400,
                            onTotalScroll: function () {
                                infScroll.loadNextPage();
                            }
                        }
                    });
                } else {
                    self.on('scroll', function (e) {
                        var lastComment = self.find('.comment:last-of-type');
                        if (lastComment[0].offsetLeft - lastComment[0].offsetWidth - self.scrollLeft() < 200) {
                            infScroll.loadNextPage();
                        }
                    });
                }
            }
        }

        return infScroll;
    };

    $.InfiniteScroll = {
        initAll: function () {
            $('.InfiniteScroll').each(function () {
                var uuid = $.utilities.uuid();
                $(this).data('infinite_uuid', uuid);
                $(this).attr('data-infinite_uuid', uuid);
                var elem = $('[data-infinite_uuid="' + uuid + '"]');
                elem.InfiniteScroll();
            });
        },
        destroyAll: function () {
            var elems = $('.InfiniteScroll');
            var count = elems.length;
            for (var i = 0; i < count; i++) {
                var infScroll = window.InfiniteScroll.data(elems[i]);
                infScroll.destroy();
            }
        }
    };

    // Fancy Confirm dialog
    /**
     * How to use
    $.fancyConfirm({
        title: "Use Google's location service?",
        message: "Let Google help apps determine location.",
        okButton: 'Agree',
        noButton: 'Disagree',
        callback: function (value) {
            if (value) {
                // Yes
            } else {
                // No
            }
        }
    })
     */
    $.fancyConfirm = function (opts) {
        opts = $.extend(true, {
            title: 'Are you sure?',
            message: '',
            okButton: 'OK',
            noButton: 'Cancel',
            callback: $.noop
        }, opts || {});

        $.fancybox.open({
            type: 'html',
            src: '<div class="fc-content p-5 rounded">' +
            '<h2 class="mb-3">' + opts.title + '</h2>' +
            '<p>' + opts.message + '</p>' +
            '<p class="text-right">' +
            '<a data-value="0" data-fancybox-close href="javascript:;" class="mr-2 btn btn-warning small">' + opts.noButton + '</a>' +
            '<button data-value="1" data-fancybox-close class="btn btn-primary small">' + opts.okButton + '</button>' +
            '</p>' +
            '</div>',
            opts: {
                animationDuration: 350,
                animationEffect: 'material',
                modal: true,
                baseTpl: '<div class="fancybox-container fc-container" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-inner">' +
                '<div class="fancybox-stage"></div>' +
                '</div>' +
                '</div>',
                afterClose: function (instance, current, e) {
                    var button = e ? e.target || e.currentTarget : null;
                    var value = button ? $(button).data('value') : 0;

                    opts.callback(value);
                }
            }
        });
    };

    view.oneTimeInitialize = function () {
        var body = $('body');

        // Add loading spinner
        body.on('click', 'a', function (e) {
            // Don't show the loading spinner if the link has a hash in it (since a hash means loading is not guaranteed)
            if (e.currentTarget.hash) {
                return;
            }
            // Don't show the loading spinner if the a element does not have an href
            if (!e.currentTarget.href) {
                return;
            }
            // Don't show the loading spinner if the link is going to open in another window
            if ( e.currentTarget.target == '_blank') {
                return;
            }

            view.showLoadingSpinner();
        });

        // Add listener for like buttons
        body.on('click', '.action-like-btn', function (e) {
            e.preventDefault();
            var elem = $(this);
            var url = elem.data('like-url');
            if (elem.hasClass('liked')) {
                url = elem.data('unlike-url');
            }
            if (!url) {
                return false;
            }

            $.get(url, function (data) {
                elem.toggleClass('liked');
                elem.find('.count').text(data.count);
            });
        });

        // Hide navabar after selecting an item
        $('.navbar-nav').on('click', 'a', function (e) {
            $('.navbar-toggle').click();
        });
    };

    view.triggerRedesign = function () {
        $('iframe.auto-height').on('load resize', function () {
            $(this).height($(this).contents().height() + 10);
        });

        // Init InfiniteScroll
        $.InfiniteScroll.initAll();

        // Init Custom Scrollbar
        $('.mCustomScrollbar').mCustomScrollbar();

        // Init Jquery Custom Scrollbar (mCustomScrollbar)
        $.mCustomScrollbar.defaults.scrollButtons.enable = true;

        // For carousel lists on cordova homepage, videos page and games page
        // and on website videos page
        // and learn page
        var itemsSlider = $('.list-wrap');

        $.each(itemsSlider, function (index, el) {
            var slides = $(el).find('.slides');
            $.each(slides, function (index, el) {
                $(el).owlCarousel({
                    loop: ($(el).find('.item').length > 6),
                    nav: true,
                    navText: ['<div class="prev-control"></div>', '<div class="next-control"></div>'],
                    lazyLoad: true,
                    lazyLoadEager: 1,
                    margin: 5,
                    stagePadding: 10,
                    responsive: {
                        0: {
                            items: $(el).attr('data-items-small'),
                            slideBy: $(el).attr('data-items-small')
                        },
                        600: {
                            items: $(el).attr('data-items-medium'),
                            slideBy: $(el).attr('data-items-medium')
                        },
                        1000: {
                            items: $(el).attr('data-items-large'),
                            slideBy: $(el).attr('data-items-large'),
                            autoWidth: false,
                            rewind: true
                        }
                    }
                });
            });
        });
    };

    view.showLoadingSpinner = function () {
        var spinner = document.getElementsByClassName('loading')[0];
        if (spinner !== undefined) {
            spinner.style.display = 'block';
        }
    };

    $(document).ready(function (event) {
        view.oneTimeInitialize();
        view.triggerRedesign();
    }).ajaxComplete(function () {
        // Init Custom Scrollbar
        $('.mCustomScrollbar').mCustomScrollbar();
    });

    $(window).load(function () {
        $('.loading').fadeOut('slow');
    });

    window.mktv = window.mktv || {};
    window.mktv.viewLibraries = view;

}());
