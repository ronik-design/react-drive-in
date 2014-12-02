function getVideoEl(el) {
    var videoEl,
        children = el.children;

    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName === 'VIDEO' && !videoEl) {
            videoEl = children[i];
        }
    }

    return videoEl;
}

function isBody(el) {
    if (el.nodeName === 'BODY') {
        return true;
    }
}

function setStyles(el, props) {
    // console.log(props);
    for (var p in props) {
        console.log(p, props[p]);
        el.style[p] = props[p];
    }
}

function DriveIn() {
    this.containerEl = document.body;
    this.wrapEl = null;
    this.videoEl = null;

    this.mediaAspect = 16 / 9;
}

DriveIn.prototype._updateSize = function() {

    var container = this.containerEl,
        videoEl = this.videoEl,
        mediaAspect = this.mediaAspect;

    var containerW = container.offsetWidth < window.outerWidth ? container.offsetWidth : window.outerWidth,
        containerH = container.offsetHeight < window.outerHeight ? container.offsetHeight : window.outerHeight,
        containerAspect = containerW / containerH;

    if (isBody(container)) {
        // $('html,body').css('height', window.outerHeight > $('body').css('height', 'auto').height() ? '100%' : 'auto');
    }

    console.log('left', (-(containerH * mediaAspect - containerW) / 2) + 'px');
    console.log('width', (containerH * mediaAspect) + 'px');
    console.log('height', containerH + 'px');

        // console.log('obj', {
        //     top: 0 + 'px',
        //     left: (-(containerH * mediaAspect - containerW) / 2) + 'px',
        //     width: (containerH * mediaAspect) + 'px',
        //     height: containerH + 'px'
        // });

    if (containerAspect < mediaAspect) {
        // taller
        console.log('here');

        setStyles(videoEl, {
            top: 0 + 'px',
            left: (-(containerH * mediaAspect - containerW) / 2) + 'px',
            width: (containerH * mediaAspect) + 'px',
            height: containerH + 'px'
        });

        // if (currMediaType == 'video') {
        //         player
        //             .width(containerH * mediaAspect)
        //             .height(containerH);
        //         if (!settings.shrinkable) {
        //             $(vidEl)
        //                 .css('top', 0)
        //                 .css('left', -(containerH * mediaAspect - containerW) / 2)
        //                 .css('height', containerH);
        //         } else {
        //             $(vidEl)
        //                 .css('top', -(containerW / mediaAspect - containerH) / 2)
        //                 .css('left', 0)
        //                 .css('height', containerW / mediaAspect);
        //         }
        //         $(vidEl + '_html5_api')
        //             .css('width', containerH * mediaAspect)
        //             .css('height', containerH);
        //         $(vidEl + '_flash_api')
        //             .css('width', containerH * mediaAspect)
        //             .css('height', containerH);
        //     } else {
        //         // is image
        //         $('#big-video-image')
        //             .css({
        //                 width: 'auto',
        //                 height: containerH,
        //                 top: 0,
        //                 left: -(containerH * mediaAspect - containerW) / 2
        //             });
        // }

    } else {

        // wider



    //     if (currMediaType == 'video') {
    //         player
    //             .width(containerW)
    //             .height(containerW / mediaAspect);
    //         $(vidEl)
    //             .css('top', -(containerW / mediaAspect - containerH) / 2)
    //             .css('left', 0)
    //             .css('height', containerW / mediaAspect);
    //         $(vidEl + '_html5_api')
    //             .css('width', $(vidEl + '_html5_api').parent().width() + "px")
    //             .css('height', 'auto');
    //         $(vidEl + '_flash_api')
    //             .css('width', containerW)
    //             .css('height', containerW / mediaAspect);
    //     } else {
    //         // is image
    //         $('#big-video-image')
    //             .css({
    //                 width: containerW,
    //                 height: 'auto',
    //                 top: -(containerW / mediaAspect - containerH) / 2,
    //                 left: 0
    //             });
    //     }


    }
}

DriveIn.prototype._setMetadata = function(data) {
    // console.log(this.mediaAspect);
    var videoEl = this.videoEl;

    this.mediaAspect = videoEl.videoWidth / videoEl.videoHeight;

    // use html5 player to get mediaAspect
    // mediaAspect = $('#big-video-vid_html5_api').prop('videoWidth')/$('#big-video-vid_html5_api').prop('videoHeight');

    // updateSize();
    // var dur = Math.round(player.duration());
    // var durMinutes = Math.floor(dur/60);
    // var durSeconds = dur - durMinutes*60;
    // if (durSeconds < 10) durSeconds='0'+durSeconds;
    // vidDur = durMinutes+':'+durSeconds;
}

DriveIn.prototype.init = function(el) {
    var self = this;

    this.wrapEl = el;
    this.videoEl = getVideoEl(el);

    this.videoEl.onloadedmetadata = function(data) {
        self._setMetadata(data);
        self._updateSize();
    };

    window.onresize = function() {
        self._updateSize();
    };
};

DriveIn.prototype.show = function() {

};

DriveIn.prototype.close = function() {

};


module.exports = DriveIn;
