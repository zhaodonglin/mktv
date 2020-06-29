

$(function () {

    // TODO this navbar stuff is deprecated as soon as we get rid of non-mobile site
    // If we are not on a "/main/" page (single app page), we can do the navbar stuff
    if (!window.location.pathname.match(/^\/main\//)) {
    var path = window.location.pathname;
    var parts = path.split('/');
    var iconClass = "nav-" + parts[1];

    if (iconClass === 'nav-profiles') {
        if (parts[2] === 'home') {
            iconClass = 'nav-home';
        } else if (['school', 'parent', 'child', 'cards', 'payments'].indexOf(parts[2]) > -1) {
            iconClass = 'nav-membership'
        }
    }

    if (iconClass === 'nav-videos') {
        if (parts[2] === 'stream') {
            iconClass = 'nav-stream';
        }
    }

    $(".navbar-nav").find("a").each(function () {
        if ($(this).hasClass(iconClass)) {
            $(this).addClass("selected");
        } else {
            $(this).removeClass("selected");
        }
    });
    }


    $(document).on('click', '.show-email-popup', function (e) {
        $('#modal-email').modal();
    });

    function sales_email_sign_up_submit($form) {
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            data: $form.serializeArray(),
            success: function (response) {
                if (response.type === 'error') {
                    $form.find('.error').html(response.text);
                } else {
                    $('#modal-email').modal('hide');
                    $('#modal-load-gift').modal();
                    $("#modal-load-gift-crl").trigger('click');
                }
            }
        })
    }

    $(document).on('submit', '#sales-email-sign-up', function (e) {
        e.preventDefault();
        sales_email_sign_up_submit($(this));
    });

    $(document).on('click', '#sales-email-submit-btn', function (e) {
        e.preventDefault();
        var $form = $('#sales-email-sign-up');
        sales_email_sign_up_submit($form);
    });

    $(document).submit(function (e) {
        $('#submit-waiting-modal').modal();
    });


    if (window.addEventListener) {
        window.addEventListener("message", listener, false);
    } else {
        window.attachEvent("onmessage", listener);
    }

    function listener(event) {
        if (event.data.sender == 'content') {
            iframe = document.getElementById("game-frame");
            iframe.contentWindow.postMessage(event.data, '*');
        }
        if (event.data.sender == 'gameframe') {
            sendIframeAnswer(event.data);
        }
    }

    var win = $(window);
    var doc = $(document);
    var body = $(document.body);

    setTimeout(function () {
        if ($('.cropped-imag-preview img').attr('src') == "") {
            $('.cropped-imag-preview img').attr('src', '/static/img/no_avatar_small.jpg');
        }
    }, 10);


    InitFormTrial();
    //InitVideo();

    $(document).ready(function (event) {
        setTimeout(function () {
            InitVideo();
        }, 2000);
        setTimeout(function () {
            InitVideo();
        }, 5000);
    });


    $(window).resize(function (event) {
        setTimeout(function () {
            InitVideo();
        }, 300);
    });

    $(window).resize(function (event) {
        //InitVideo();
        InitFormTrial();
    });


    $('body').on('click', '.sales-video-loader', function (e) {
        e.preventDefault();
        $('.video').html($(this).find('.new-video').html());
    });
    $('body').on("click", "a .rateit", returnFalse);

    //triggering click
    $("[data-trigger-click]").on("click", function () {
        $($(this).attr("data-trigger-click")).find("input").trigger("click");
    });

    $(".label-price").on("click", function (e) {
        e.preventDefault();

        $(".label-price").removeClass('active');
        $(this).addClass('active');

    });


    $('body').on("click", ".recorder-modal .btn-upload-rec", function () {
        var fileInput = "#" + $(this).attr("data-file");
        $(fileInput).trigger('click');
    });

    $('body').on("click", ".btn-copy-link", function (e) {
        e.preventDefault();
    });

    $('body').on("click", ".wrap-erros-registration", function (e) {
        e.preventDefault();
        $('.wrap-erros-registration').remove();
    });


    setTimeout(function () {
        if ($('.wrap-erros-registration').length != 0) {
            $('.wrap-erros-registration').remove();
        }
    }, 7000);

    $('.recorder-modal input[type=file]').change(function () {
        var fname = (this.files[0] && this.files[0].name) || '';
        $('.recorder-modal .file-name .value').html(fname);
        $('.recorder-modal .file-name').removeClass('hide')
        $('.recorder-modal .recoder .btn').removeClass('disabled')
    });


    $("input[type=password]").on('change', function (e) {

        tmpval = $(this).val();
        if (tmpval == '') {
            $(this).addClass('empty');
        } else {
            $(this).removeClass('empty');
        }
    });


    $("body").on("click", '.wrap-choose-plan .new-radio', function (e) {

        var $main_radio = $('.wrap-choose-plan .new-radio');
        $main_radio.removeClass('active');
        $main_radio.find('input[name=plan]').removeAttr('checked');

        $(this).find('input[name=plan]').prop('checked', true);
        $('input[name=plan]').eq(0).trigger('change');
        $(this).addClass('active');

    });


    $("body").on("click", '.offet-plan-content .radios .new-radio', function (e) {

        $('.offet-plan-content .radios .new-radio').removeClass('active');

        if ($(this).find('input[name=plan]').is(':checked')) {
            $(this).addClass('active')
        }
    });

    $('.wrap-input-placeholder input').each(function (index, el) {
        tmpval = $(this).val();
        console.log($(this).val())
        if (tmpval == '') {
            $(this).addClass('empty');
        } else {
            $(this).removeClass('empty');
        }
    });


    if ($('.playlist-video .carousel-inner .item.active').length == 0) $('.playlist-video .carousel-inner .item:first').addClass('active');


    //voting for videos & games
    body.on('rated', '.rateit', function (e) {
        var ri = $(this);

        var rating = parseFloat(ri.rateit('value')) * 2,
            url = ri.data("url");

        $.ajax({
            url: url,
            data: {rating: rating},
            type: 'POST',
            success: function (data) {
                ri.rateit('value', data.rating)
            },
            error: function (jxhr, msg, err) {
            }
        });
    });

    body.on('click', '.navbar-toggle .sr-only, .navbar-toggle', function (e) {
        e.stopPropagation();
        if ($(window).width() > 768) return false;
        $('.navbar.navbar-static-top').slideToggle();
    });


    body.on('click', '.action-like', function (e) {
        var like = $(this);
        var url = like.data('like-url'),
            action = 'like.addClass("liked-big")';
        if (like.hasClass('liked-big')) {
            url = like.data('unlike-url');
            action = 'like.removeClass("liked-big")';
        }
        $.ajax({
            url: url,
            method: 'GET',
            success: function (resp) {
                eval(action);
                $('.like-count').text(resp.count)
            }
        });
        e.preventDefault();
        return false;
    });


    // $(document).ready(function(event) {
    //     if (doc.has(".ajax-loadable-container").length) {
    //         if (doc.has(".select-subcategory").length) {
    //             doc.on("scroll", ajaxLoad);
    //         }
    //     }
    // });

    var currentAjax = false; // whether some new elements are already about to be appended
    if (doc.has(".ajax-loadable-container").length) { //pages on which ajaxLoad should work: blog
        if (doc.has(".select-subcategory").length) {
            page = 1;
            $.ajax({
                url: url,
                data: {'page': page, 'subcategory': $(".select-subcategory").val()},
                success: function (response) {
                    console.log("page loaded");
                    container.empty().append(response);
                },
            });

            $(".select-subcategory").change(function () {
                doc.on("scroll", ajaxLoad);
                currentAjax = false;
                page = 1;
                $.ajax({
                    url: url,
                    data: {'page': page, 'subcategory': $(this).val()},
                    success: function (response) {
                        console.log("subcategory selected");
                        container.empty().append(response);
                    },
                });
            });
        }


        function ajaxLoad() {
            var footer = body.children("footer");
            var workspace = body.height() - win.height() - footer.height() + parseInt(footer.css("marginTop")) - parseInt(body.children("main").css("paddingBottom"));
            workspace -= 250; //approximately value; defines the maximum on which ajax starts triggering

            if (container.is(".var-height-gallery")) workspace -= 600;
            if (pageYOffset > workspace && !currentAjax) {
                var pageY = pageYOffset;
                page += 1;
                $.ajax({
                    url: url,
                    data: {'page': page, 'subcategory': $(".select-subcategory").val()},
                    beforeSend: function () {
                        currentAjax = true;
                    },
                    success: function (response) {
                        currentAjax = false;

                        container.append(response);
//                        sortGallery(".gallery");
//                        $('.rateit').rateit();
                        doc.scroll();
                    },
                    error: function () {
                        doc.off("scroll", ajaxLoad);
                    }
                });
            }
        }

        doc.on("scroll", ajaxLoad);
        var container = doc.find(".ajax-loadable-container"),
            url = container.data('url'),
            page = parseInt(container.data('page')); //container to which new elements should be appended
    }

    synchronizeSelect($("[data-synchroselect]"));

    $(".hoverlike").on("click", returnFalse);


    $('.wrap-input-placeholder input, input[type=password]').blur(function () {
        tmpval = $(this).val();
        if (tmpval == '') {
            $(this).addClass('empty');
        } else {
            $(this).removeClass('empty');
        }
    });

    function addChildrenPopupOpener() {
        $('#add_children_popup').modal('show');
    }

    if (window.showSetupPopup) {
        addChildrenPopupOpener();
    }
});

function returnFalse(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
}

/* For synchronization form's select with bootstrap's dropdown */
function synchronizeSelect(dropdown) {
    for (var i = 0; i < dropdown.length; i++) {
        var dd = dropdown.eq(i);
        var select = $(dd.attr("data-synchroselect"));
        var options = select.find("option");
        var selected = dd.find(".option-selected");
        dd = dd.find(".dropdown-menu");
        dd.children().remove();

        for (var j = 0; j < options.length; j++) {
            var li = $("<li></li>").text(options[j].text).appendTo(dd);
            if (options.eq(j).is(":selected")) {
                selected.text(options[j].text);
            }
        }
    }

    function selectOption(li) {
        dd = li.closest("[data-synchroselect]");
        options = $(dd.attr("data-synchroselect")).find("option");
        selected = dd.find(".option-selected");
        i = $(li).index();
        options[i].selected = true;
        selected.text(options[i].text);
        $(dd.attr("data-synchroselect")).trigger("change")
    }

    dropdown.on("click", ".dropdown-menu > li", function (event) {
        selectOption($(event.target));
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    cache: false,
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(document).ready(function () {
    if ($('.manage-favourite').hasClass('ftvideo-add')) {

        if (typeof($('.manage-favourite').attr('data-textadd')) == "undefined") $('.manage-favourite').html('Add to collection');
        else {
            $('.manage-favourite').html($('.manage-favourite').attr('data-textadd'));
        }
    } else {
        if (typeof($('.manage-favourite').attr('data-textremove')) == "undefined") $('.manage-favourite').html('Remove from collection');
        else $('.manage-favourite').html($('.manage-favourite').attr('data-textremove'));
    }


    $('.mailchimp').on('click', function (ev) {
        ev.preventDefault();
        data = ($('form').serializeArray());
        template = $(this).attr('data-item');
        $.post(template, data,
            function (resp) {
                if (data) {
                    noty({text: resp.text, type: resp.type, timeout: 3000});
                }
            });
        $('.mailchimp').val('');
    });
    /*SMOOTH SCROLL*/
    $(function () {
        $('a[href*=#]').click(function () {

            if ($(this).hasClass('carousel-control') || $(this).parents('.nav-tabs').length != 0) return;

            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1200);
                    return false;
                }
            }
        });
    });
    /* End of SMOOTH SCROLL */

    $('.block_notifications input').on('click', function (ev) {
        var ClassBlock = $(this).parents('.block_notifications').attr('data-block');

        if (typeof(ClassBlock) == "undefined" || ClassBlock == "") return false;

        if ($(this).attr("checked") == 'checked' || $(this).attr("checked") == true) {
            $(this).attr("checked", false);
            $('.' + ClassBlock).find('input').attr("checked", false);
            $('.' + ClassBlock).find('input').attr('disabled', 'disabled');
        } else {
            $(this).attr("checked", true);
            $('.' + ClassBlock).find('input').removeAttr('disabled');
        }

    });


    InitVideo();

    if ($('.grid-list').length != 0 && $(window).width() >= 640) {

        $(window).load(function () {
            AnimateItem();
        });

        $(window).scroll(function () {
            AnimateItem();
        });
    }


});

function AnimateItem() {

    var item;
    if ($('.grid-list li:not(.shown)').length != 0) {
        for (var i = 0; i < 5; i++) {
            item = $('.grid-list li:not(.shown)').get(i);

            if (item && $(item).offset().top < ($(window).scrollTop() + $(window).height())) {
                ShowItem($(item));
            }

            if (item && $(item).offset().top < $(window).scrollTop()) {
                $(item).removeClass('animate').addClass('shown');
            }
        }
    }
}

function ShowItem(item) {
    $(item).addClass('animate');
    setTimeout(function () {
        item.removeClass('animate').addClass('shown');
    }, 600)
}

function InitVideo() {

    $('.video').each(function (index, el) {
        var frame;
        grandparent = $(el);

        frame = grandparent.find('.embed-container iframe');
        if (frame.length != 0) {
            frame.attr('data-aspect-ratio', frame.attr('height') / frame.attr('width'));
            var aspectRatioPercent = frame.attr('data-aspect-ratio') * 100;
            frame.parent('.embed-container').css('padding-bottom', aspectRatioPercent + "%");
            return;
        }

    });
}

function sendIframeAnswer(data) {
    if (data.command == "geturl") {
        var url = $('.game-wrap').attr('data-score-url');
        parent.postMessage({url: url, command: "posturl", sender: 'content'}, '*');
    }

}

function InitFormTrial() {
    var ft = $('.wrap-info-block.trial-form');

    var top = $(window).height() - ft.outerHeight();

    ft.css({
        'margin-top': top < 0 ? '' : top / 2,
    });

}
