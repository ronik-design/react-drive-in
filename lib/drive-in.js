function getMedia(el) {
    var media = {},
        children = el.children,
        node;

    for (var i = 0; i < children.length; i++) {
        node = children[i];
        if (node.nodeName === 'VIDEO' && !media.el) {
            media.type = 'video';
            media.el = node;
        }

        if (node.nodeName === 'IMG' && !media.el) {
            media.type = 'image';
            media.el = node;
        }
    }

    return media;
}

function isBody(el) {
    if (el.nodeName === 'BODY') {
        return true;
    }
}

function setStyles(el, props) {
    for (var p in props) {
        el.style[p] = props[p];
    }
}

function DriveIn() {
    this.parentEl = null;
    this.mediaEl = null;
    this.ambient = true;
    this.currMediaType = null;
    this.mediaAspect = 16 / 9;
}

DriveIn.prototype._updateSize = function() {

    var container = document.body,
        parentEl = this.parentEl,
        mediaEl = this.mediaEl,
        mediaAspect = this.mediaAspect,
        currMediaType = this.currMediaType;

    var containerW = container.offsetWidth < window.outerWidth ? container.offsetWidth : window.outerWidth,
        containerH = container.offsetHeight < window.outerHeight ? container.offsetHeight : window.outerHeight,
        containerAspect = containerW / containerH;

    if (isBody(container)) {
        setStyles(container, {
            height: 'auto'
        });
        if (window.outerHeight > container.offsetHeight) {
            setStyles(container, {
                height: '100%'
            });
            setStyles(document.documentElement, {
                height: '100%'
            });
        }
    }

    if (containerAspect < mediaAspect) {
        // taller
        if (currMediaType == 'video') {

            setStyles(mediaEl, {
                width: containerH * mediaAspect + 'px',
                height: containerH + 'px'
            });

            setStyles(parentEl, {
                top: 0 + 'px',
                left: (-(containerH * mediaAspect - containerW) / 2) + 'px',
                width: (containerH * mediaAspect) + 'px',
                height: containerH + 'px'
            });

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
        } else {
            // is image

            //         $('#big-video-image')
            //             .css({
            //                 width: 'auto',
            //                 height: containerH,
            //                 top: 0,
            //                 left: -(containerH * mediaAspect - containerW) / 2
            //             });
        }

    } else {

        // wider
        if (currMediaType == 'video') {

            // setStyles(mediaEl, {
            //     width: containerW + 'px',
            //     height: Math.ceil(containerW / mediaAspect) + 'px'
            // });

            setStyles(parentEl, {
                top: -Math.ceil(containerW / mediaAspect - containerH) / 2 + 'px',
                left: 0 + 'px',
                width: containerW + 'px',
                height: (containerW / mediaAspect) + 'px'
            });

            setStyles(mediaEl, {
                width: parentEl.offsetWidth + 'px',
                height: 'auto'
            });

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
        } else {
            // is image

            //         $('#big-video-image')
            //             .css({
            //                 width: containerW,
            //                 height: 'auto',
            //                 top: -(containerW / mediaAspect - containerH) / 2,
            //                 left: 0
            //             });
        }
    }
}

DriveIn.prototype._setMetadata = function(data) {
    var mediaEl = this.mediaEl;
    this.mediaAspect = mediaEl.videoWidth / mediaEl.videoHeight;
    this._updateSize();

    // var dur = Math.round(player.duration());
    // var durMinutes = Math.floor(dur/60);
    // var durSeconds = dur - durMinutes*60;
    // if (durSeconds < 10) durSeconds='0'+durSeconds;
    // vidDur = durMinutes+':'+durSeconds;
};

DriveIn.prototype._play = function (video, loop, ambient) {
    var mediaEl = this.mediaEl,
        source,
        canPlay;

    for (var type in video) {
        canPlay = mediaEl.canPlayType(type);
        if (canPlay === 'probably') {
            source = video[type]
        } else if (canPlay && !source) {
            source = video[type];
        }
    }

    if (source) {

        this.mediaEl.src = source;

        if (loop) {
            this.mediaEl.loop = true;
        }

        if (ambient) {
            this.mediaEl.muted = true;
            this.mediaEl.volume = 0;
        }

        this.mediaEl.play();
    }
}

DriveIn.prototype._loadPlaylist = function (playlist) {
    var item = playlist[0];
    this._play(item, (playlist.length === 1), this.ambient);

    // for (var i in playlist) {
    //     item = playlist[i];
    // }

};

DriveIn.prototype._setMedia = function(media) {
    var self = this;

    this.mediaEl = media.el;
    setStyles(this.mediaEl, { position: 'absolute' });

    this.currMediaType = media.type;

    if (media.type === 'video') {
        this.mediaEl.onloadedmetadata = function(data) {
            self._setMetadata(data);
        };
    }

    if (media.type === 'image') {
        // imagesloaded or something...
    }
}

DriveIn.prototype.init = function(el) {
    var self = this;

    this.parentEl = el;
    setStyles(this.parentEl, { display: 'block' });

    var media = getMedia(el);
    this._setMedia(media);

    window.onresize = function() {
        self._updateSize();
    };
};

DriveIn.prototype.show = function(playlist, options) {
    options = options || {};

    if (options.hasOwnProperty('ambient')) {
        this.ambient = options.ambient;
    }

    this._loadPlaylist(playlist);
};

DriveIn.prototype.close = function() {

};


module.exports = DriveIn;
