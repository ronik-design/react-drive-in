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
    var cssString = '';

    for (var p in props) {
        cssString += p + ':' + props[p] + ';';
        // el.style[p] = props[p];
    }

    // console.log(cssString);

    el.style.cssText += ';' + cssString;
}

function playlistItem(src) {
    var item = {},
        type,
        videoExts = {
            mp4: true,
            ogg: true,
            webm: true
        },
        imageExts = {
            jpg: true,
            png: true,
            gif: true
        };

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

function makePlaylist(rawPlaylist, depth) {
    depth = depth || 0;

    var playlist = [],
        item;

    for (var i in rawPlaylist) {
        item = rawPlaylist[i];
        if (item.constructor === Object) {
            playlist.push([item]);
        }

        if (item.constructor === Array) {
            playlist.push(makePlaylist(item, depth + 1));
        }

        if (typeof item === 'string') {
            if (depth === 0) {
                playlist.push([playlistItem(item)]);
            } else {
                playlist.push(playlistItem(item));
            }
        }
    }

    return playlist;
}

function DriveIn() {
    this.parentEl = null;
    this.mediaEl = null;
    this.mute = true;
    this.currMediaType = null;
    this.mediaAspect = 16 / 9;
    this.playlist = null;

    this.playlistLength = 0;
    this.currentItem = 0;
    this.itemDuration = 10;
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
            setStyles(mediaEl, {
                width: 'auto',
                height: containerH + 'px',
                top: '0px',
                left: (-(containerH * mediaAspect - containerW) / 2) + 'px'
            });
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
            setStyles(mediaEl, {
                width: containerW + 'px',
                height: 'auto',
                top: (-(containerW / mediaAspect - containerH) / 2) + 'px',
                left: '0px'
            });
        }
    }
};

DriveIn.prototype._setVideoData = function(data) {
    var mediaEl = this.mediaEl;
    this.mediaAspect = mediaEl.videoWidth / mediaEl.videoHeight;
    this._updateSize();


    // var dur = Math.round(player.duration());
    // var durMinutes = Math.floor(dur/60);
    // var durSeconds = dur - durMinutes*60;
    // if (durSeconds < 10) durSeconds='0'+durSeconds;
    // vidDur = durMinutes+':'+durSeconds;

};

DriveIn.prototype._setImageData = function(data) {
    this.mediaAspect = data.naturalWidth / data.naturalHeight;
    this._updateSize();
};

DriveIn.prototype._playVideoItem = function(item, itemNum) {
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

        // setStyles(this.mediaEl, {
        //     '-webkit-transform': 'translate3d(0, 0, 0)'
        // });

        this.mediaEl.src = src;

        if (this.playlistLength < 2) {
            this.mediaEl.loop = true;
        }

        if (this.mute) {
            this.setVolume(0);
        }

        this.mediaEl.play();
        this.currentItem = itemNum;

    } else {

        this.emit('media.error', new Error('No playable source'));
    }
};

DriveIn.prototype._playImageItem = function(item, itemNum) {
    var mediaEl = this.mediaEl,
        source,
        src,
        canPlay;

    for (var i in item) {
        source = item[i];
        if (source.type.search(/^image/) === 0 && !src) {
            src = source.src;
        }
    }

    if (src) {

        this.mediaEl.src = src;
        this.currentItem = itemNum;

    } else {

        this.emit('media.error', new Error('No playable source'));
    }
};


DriveIn.prototype._playItem = function(item, itemNum) {
    if (this.currMediaType === 'video') {
        this._playVideoItem(item, itemNum);
    }

    if (this.currMediaType === 'image') {
        this._playImageItem(item, itemNum);
    }
};

DriveIn.prototype.setVolume = function(level) {
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
    this.playlistLength = playlist.length;
    this._playItem(playlist[0], 0);
};

DriveIn.prototype._attachListeners = function() {
    var self = this;

    window.addEventListener('resize', function() {
        self._updateSize();
        // window.requestAnimationFrame(self._updateSize.bind(self));
    });

    if (this.currMediaType === 'video') {

        this.mediaEl.addEventListener('loadedmetadata', function(data) {
            self._setVideoData(data);
        });

        this.mediaEl.addEventListener('playing', function() {
            self.emit('media.playing', self.currentItem);
        });

        this.mediaEl.addEventListener('ended', function() {
            self.emit('media.ended', self.currentItem);
            if (self.playlistLength > 1) {
                var itemNum = (self.currentItem + 1 < self.playlistLength) ? self.currentItem + 1 : 0;
                self.play(itemNum);
            }
        });
    }

    if (this.currMediaType === 'image') {
        this.mediaEl.addEventListener('load', function(e) {

            if (self.playlistLength > 1) {
                setTimeout(function() {
                    self.mediaEl.dispatchEvent(new Event('ended'));
                }, self.itemDuration * 1000);
            }

            self._setImageData(this);
            self.emit('media.playing', self.currentItem);
        });

        this.mediaEl.addEventListener('ended', function() {
            self.emit('media.ended', self.currentItem);
            if (self.playlistLength > 1) {
                var itemNum = (self.currentItem + 1 < self.playlistLength) ? self.currentItem + 1 : 0;
                self.play(itemNum);
            }
        });
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

DriveIn.prototype.show = function(item, options) {
    if (item.constructor === Array) {
        return this.showPlaylist([item], options);
    }

    if (item.constructor === Object) {
        return this.showPlaylist([
            [item]
        ], options);
    }

    return this.showPlaylist([
        [playlistItem(item)]
    ], options);
};

DriveIn.prototype.showPlaylist = function(rawPlaylist, options) {
    if (options.hasOwnProperty('mute')) {
        this.mute = options.mute;
    }
    var playlist = makePlaylist(rawPlaylist);
    this._loadPlaylist(playlist);
};

DriveIn.prototype.getMedia = function() {
    return this.mediaEl;
};

DriveIn.prototype.getPlaylist = function() {
    return this.playlist;
};

DriveIn.prototype.getItem = function(itemNum) {
    return this.playlist[itemNum];
};

DriveIn.prototype.play = function(itemNum) {
    if (typeof itemNum === 'number') {
        this._playItem(this.playlist[itemNum], itemNum);
    } else {
        this.mediaEl.play();
    }
};

DriveIn.prototype.pause = function() {
    this.mediaEl.pause();
};

DriveIn.prototype.close = function() {

};

module.exports = DriveIn;
