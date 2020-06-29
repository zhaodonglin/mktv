$(document).ready(function () {

    var clipboard = new ClipboardJS('.copy-btn');

    $('.remove-item').on('click', function (e) {
        var $self = $(this);
        var url = $self.data('url');
        var data = {recording: $self.data('recording')};
        $.ajax({
            method: 'post',
            url: url,
            data: data,
            success: function (response) {
                if (response.redirect) {
                    window.location.replace(response.redirect);
                } else {
                    window.location.reload();
                }
            },
            error: function (response) {
                noty({
                    text: response.message, type: 'error'
                });
            }
        });
        e.preventDefault();
    });

    $(".track-slide").simpleSlider({
        highlight: true
    });

    if ($(".jp-jplayer").length != 0) {
        InitAudioPlayer(); //init player
    }

    $('.player-block .jp-play').click(function (e) {

        if ($(this).hasClass('played')) {
            PauseAudio($(this));
        } else {
            PlayAudio($(this));
        }
    });

    $('.player-block .remove-item').click(function (e) {

        if ($(this).hasClass('played')) {
            ResetAllItems();
        }


        $(this).parents('tr').addClass('removed');

        $('#confirm-delete').modal();


    });

    $('body').on('click', '#confirm-delete[data-remove=audio]  .btn-yes', function (e) {
        e.preventDefault();
        RemoveAudio();
        $('#confirm-delete').modal('hide');
    });

    $('body').on('click', '#confirm-delete[data-remove=audio]  .btn-no', function (e) {
        e.preventDefault();
        $('#confirm-delete').modal('hide');
        $('tr.removed').removeClass('removed');
    });


    $(".player-block .track-slide").bind("slider:changed", function (event, data) {
        if (data.trigger == "domDrag") {
            $("#main_jplayer").jPlayer("playHead", data.ratio * 100);
        }
    });


});

function InitAudioPlayer(location) {
    $("#main_jplayer").jPlayer({
        ready: function (event) {

        },
        timeupdate: function (event) {
            var width = event.jPlayer.status.currentPercentRelative;

            $('.player-block .jp-play.played').parents('.player-block').find(".track-slide").simpleSlider("setValue", width / 100);
        },
        ended: function (event) {
            ResetAllItems();

        },

        error: function (event) {
            if (event.jPlayer.error.type == "e_url") {
                console.log('Media URL could not be loaded')
            }
        },
        swfPath: "js/swf",
        supplied: "mp3",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true,
        errorAlerts: true,
        cssSelectorAncestor: "#main_jplayer"
    });
}


function PlayAudio(item) {
    if (!item.hasClass('paused')) {
        ResetAllItems();
        SetAudio(item);
    }

    item.closest('.player-block').addClass('played');
    item.addClass('played');
    $(".jp-jplayer").jPlayer('play');
}

function PauseAudio(item) {
    item.closest('.player-block').removeClass('played');
    item.closest('.player-block').addClass('paused');
    item.removeClass('played');
    item.addClass('paused');
    $(".jp-jplayer").jPlayer('pause');
}


function SetAudio(item) {
    var mp3 = item.parents('.player-block').attr('data-audio');
    $(".jp-jplayer").jPlayer('setMedia', {mp3: mp3});
}

function RemoveAudio() {
    $('tr.removed').remove();
    //remove media
}

function ResetAllItems() {
    $(".jp-jplayer").jPlayer('stop');
    $('.jp-play').closest('.player-block').removeClass('played paused');
    $('.jp-play').removeClass('played paused');
    $('.player-block').find(".track-slide").simpleSlider("setValue", 0);
}
