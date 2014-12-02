var Jvent = require('jvent');
var inherits = require('inherits');

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

function playlistItem(src) {
    var item = {},
        type,
        videoExts = { mp4: true, ogg: true, webm: true },
        imageExts = { jpg: true, png: true, gif: true };

    var ext = src.match(/\.([mp4|ogg|webm|jpg|png|gif]+)$/)[1];

    if (videoExts[ext]) {
        item.type = 'video/' + ext;
    }

    if (imageExts[ext]) {
        item.type = 'image/' + ext;
    }

    item.src = src;

    return item;
}

function DriveIn() {
    this.parentEl = null;
    this.mediaEl = null;
    this.mute = true;
    this.currMediaType = null;
    this.mediaAspect = 16 / 9;
    this.playlist = null;

    this.playMany = false;
    this.currentItem = 0;
}

inherits(DriveIn, Jvent);

DriveIn.prototype.init = function(options) {
    var self = this,
        media;

    this.parentEl = options.el;
    setStyles(this.parentEl, {
        display: 'block'
    });

    media = getMedia(this.parentEl);

    this._setMedia(media);
    this._attachListeners();
};

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
};

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

DriveIn.prototype._playItem = function(item) {
    var mediaEl = this.mediaEl,
        source,
        src,
        canPlay;

    for (var i in item) {
        source = item[i];
        canPlay = mediaEl.canPlayType(source.type);

        if (canPlay === 'probably') {
            src = source.src;
        } else if (canPlay && !src) {
            src = source.src;
        }
    }

    if (src) {
        setStyles(this.mediaEl, {
            '-webkit-transform': 'translate3d(0, 0, 0)'
        });

        this.mediaEl.src = src;

        if (!this.playMany) {
            this.mediaEl.loop = true;
        }

        if (this.mute) {
            this.setVolume(0);
        }

        this.mediaEl.play();
    }
};

DriveIn.prototype.setVolume = function (level) {
    if (level === 0) {
        this.mediaEl.muted = true;
        this.mediaEl.volume = 0;
    } else {
        this.mediaEl.muted = false;
        this.mediaEl.volume = level;
    }
};

DriveIn.prototype._loadPlaylist = function(playlist) {
    this.playlist = playlist;
    this.playMany = (playlist.length > 1);
    this._playItem(playlist[0]);
};

DriveIn.prototype._attachListeners = function() {
    var self = this;

    window.onresize = function() {
        self._updateSize();
    };

    if (this.currMediaType === 'video') {
        this.mediaEl.onloadedmetadata = function(data) {
            self._setMetadata(data);
        };

        this.mediaEl.onplaying = function() {
            self.emit('media.playing', this.currentItem);
        };
    }

    if (this.currMediaType === 'image') {
        // imagesloaded or something...
    }
};

DriveIn.prototype._setMedia = function(media) {
    var self = this;

    this.mediaEl = media.el;
    setStyles(this.mediaEl, {
        position: 'absolute'
    });

    this.currMediaType = media.type;
};

/**

    show='foo.mp4' // simple
    show=[ 'foo.mp4', 'foo.webm' ] // simple playlist
    show=[ {}, {} ] // fallback
    show=[ [ {}, {} ] ] // playlist with fallback

    inputs: String-src,
    canonical: [ [{ type, src }, { type, src }, {}], [{}, {}, {}], [] ]

 */

DriveIn.prototype.show = function (item, options) {
    if (item.constructor === Array) {
        return this.showPlaylist([ item ], options);
    }

    if (item.constructor === Object) {
        return this.showPlaylist([[ item ]], options);
    }

    return this.showPlaylist([[ playlistItem(item) ]], options);
};

DriveIn.prototype.showPlaylist = function (playlist, options) {
    if (options.hasOwnProperty('mute')) {
        this.mute = options.mute;
    }
    this._loadPlaylist(playlist);
};

DriveIn.prototype.getMedia = function() {
    return this.mediaEl;
};

DriveIn.prototype.getPlaylist = function() {
    return this.playlist;
};

DriveIn.prototype.play = function (itemNum) {
    if (typeof itemNum === 'number') {
        this._playItem(this.playlist[itemNum]);
    } else {
        this.mediaEl.play();
    }
};

DriveIn.prototype.pause = function () {
    this.mediaEl.pause();
};

DriveIn.prototype.close = function() {

};

module.exports = DriveIn;
