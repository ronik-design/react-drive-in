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

function windowWidth() {
    if (self.innerHeight) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }
}

function windowHeight() {
    if (self.innerHeight) {
        return self.innerHeight;
    }

    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }

    if (document.body) {
        return document.body.clientHeight;
    }
}

function setStyles(el, props) {
    var cssString = '';
    for (var p in props) {
        cssString += p + ':' + props[p] + ';';
    }
    el.style.cssText += ';' + cssString;
}

function playlistItem(src) {
    var item = {},
        type,
        videoExts = {
            mp4: true,
            ogv: true,
            webm: true
        },
        imageExts = {
            jpg: true,
            png: true,
            gif: true
        };

    var ext = src.match(/\.([mp4|ogv|webm|jpg|jpeg|png|gif]+)$/)[1];

    if (videoExts[ext]) {
        if (ext === 'ogv') {
            item.type = 'video/ogg';
        } else {
            item.type = 'video/' + ext;
        }
    }

    if (imageExts[ext]) {
        if (ext === 'jpg') {
            item.type = 'image/jpeg';
        } else {
            item.type = 'image/' + ext;
        }
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

function findPoster(playlist) {
    var poster,
        item;

    for (var i in playlist) {
        item = playlist[i];

        if (item.constructor === Array) {
            poster = findPoster(item);
        } else {
            if (item.type.search(/^image/) > -1) {
                return item;
            }
        }

        if (poster) {
            return poster;
        }
    }
}

function createEl(name, props) {
    var el = document.createElement(name);
    for (var prop in props) {
        el[prop] = props[prop];
    }
    return el;
}

function Timer(callback, delay) {
    var self = this;
    var timerId, start, remaining = delay;

    this.pause = function(silent) {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;

        if (!silent) this.emit('pause');
    };

    this.resume = function(silent) {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);

        if (!silent) this.emit('resume');
    };

    this.destroy = function() {
        self.pause(true);
        self.removeAllListeners();
    };

    this.resume();
}

inherits(Timer, Jvent);

function DriveIn() {
    this._listeners = [];

    this.parentEl = null;
    this.mediaEl = null;
    this.mute = true;
    this.currMediaType = null;
    this.mediaAspect = 16 / 9;
    this.playlist = null;
    this.loop = true;

    this.playlistLength = 0;
    this.currentItem = 0;
    this.slideshowItemDuration = 10;
    this._slideshowTimer = null;

    this.poster = null;
}

inherits(DriveIn, Jvent);

DriveIn.prototype._updateSize = function() {

    var container = document.body,
        parentEl = this.parentEl,
        mediaEl = this.mediaEl,
        mediaAspect = this.mediaAspect,
        currMediaType = this.currMediaType;

    var winW = windowWidth(),
        winH = windowHeight(),
        containerW = container.offsetWidth < winW ? container.offsetWidth : winW,
        containerH = container.offsetHeight < winH ? container.offsetHeight : winH,
        containerAspect = containerW / containerH;

    if (container.nodeName === 'BODY') {
        setStyles(container, {
            height: 'auto'
        });

        if (winH > container.offsetHeight) {
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

            setStyles(parentEl, {
                width: containerH * mediaAspect + 'px',
                height: containerH + 'px'
            });

            setStyles(parentEl, {
                height: containerH + 'px'
            });

            setStyles(mediaEl, {
                width: (containerH * mediaAspect) + 'px',
                height: containerH + 'px'
            });

        } else {

            // is image
            setStyles(mediaEl, {
                width: 'auto',
                height: containerH + 'px'
                    // top: '0px',
                    // left: (-(containerH * mediaAspect - containerW) / 2) + 'px'
            });
        }

    } else {

        // wider
        if (currMediaType == 'video') {

            setStyles(parentEl, {
                width: containerW + 'px',
                height: (containerW / mediaAspect) + 'px'
            });

            setStyles(parentEl, {
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
                height: 'auto'
                    // top: (-(containerW / mediaAspect - containerH) / 2) + 'px',
                    // left: '0px'
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
        canPlayType;

    for (var i in item) {
        source = item[i];
        canPlayType = mediaEl.canPlayType(source.type);
        if (canPlayType === 'probably') {
            src = source.src;
        } else if (canPlayType && !src) {
            src = source.src;
        }
    }

    if (src) {

        this.mediaEl.src = src;

        if (this.playlistLength < 2) this.mediaEl.loop = true;
        if (this.mute) this.setVolume(0);

        this.currentItem = itemNum;

        this.mediaEl.load();

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

    if (!src && this.poster) {
        src = this.poster.src;
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

DriveIn.prototype._loadPlaylist = function(playlist) {
    this.playlist = playlist;
    this.playlistLength = playlist.length;
    this._playItem(playlist[0], 0);
};

DriveIn.prototype._addListener = function(element, event, handler) {

    element.addEventListener(event, handler);

    this._listeners.push({
        element: element,
        event: event,
        handler: handler
    });
};

DriveIn.prototype._removeAllListeners = function() {
    var listeners = this._listeners,
        listen;

    for (var i in listeners) {
        listen = listeners[i];
        listen.element.removeEventListener(listen.event, listen.handler);
    }
};

DriveIn.prototype._attachVideoListeners = function() {
    var self = this,
        mediaEl = this.mediaEl;

    function onLoadedMetadata(data) {
        self._setVideoData(data);
    }

    function onPlaying() {
        self.emit('media.playing', self.currentItem);
    }

    function onPause() {
        self.emit('media.pause');
    }

    function onEnded() {
        self.emit('media.ended', self.currentItem);

        if (self.playlistLength > 1 && self.loop) {
            var itemNum = 0;
            if (self.currentItem + 1 < self.playlistLength) {
                itemNum = self.currentItem + 1;
            }
            self.play(itemNum);
        }
    }

    function onCanPlay() {
        mediaEl.play();
    }

    this._addListener(mediaEl, 'loadedmetadata', onLoadedMetadata);
    this._addListener(mediaEl, 'playing', onPlaying);
    this._addListener(mediaEl, 'pause', onPause);
    this._addListener(mediaEl, 'ended', onEnded);
    this._addListener(mediaEl, 'canplay', onCanPlay);
};

DriveIn.prototype._attachImageListeners = function() {
    var self = this,
        mediaEl = this.mediaEl;

    function ended() {
        var event = new Event('ended');
        self.mediaEl.dispatchEvent(event);
    }

    function onPause() {
        self.emit('media.pause');
    }

    function onLoad(data) {
        if (self.playlistLength > 1) {
            if (self._slideshowTimer) self._slideshowTimer.destroy();
            self._slideshowTimer = new Timer(ended, self.slideshowItemDuration * 1000);

            self._slideshowTimer.on('pause', onPause);
        }

        self._setImageData(this);
        self.emit('media.playing', self.currentItem);
    }

    function onEnded() {
        self.emit('media.ended', self.currentItem);
        if (self.playlistLength > 1 && self.loop) {
            var itemNum = (self.currentItem + 1 < self.playlistLength) ? self.currentItem + 1 : 0;
            self.play(itemNum);
        }
    }

    this._addListener(mediaEl, 'load', onLoad);
    this._addListener(mediaEl, 'ended', onEnded);
};

DriveIn.prototype._attachListeners = function() {
    var self = this;

    function onResize() {
        window.requestAnimationFrame(self._updateSize.bind(self));
    }

    this._addListener(window, 'resize', onResize);

    if (this.currMediaType === 'video') {
        this._attachVideoListeners();
    } else {
        this._attachImageListeners();
    }
};

DriveIn.prototype._setParent = function(el) {
    this.parentEl = el;

    setStyles(this.parentEl, {
        position: 'absolute',
        display: 'block',
        transform: 'translate3d(-50%,-50%,0)',
        '-webkit-transform': 'translate3d(-50%,-50%,0)',
        left: '50%',
        top: '50%'
    });

    return this.parentEl;
};

DriveIn.prototype._setMedia = function(media) {
    this.mediaEl = media.el;
    setStyles(this.mediaEl, {
        display: 'block'
    });

    this.currMediaType = media.type;

    return this.mediaEl;
};

DriveIn.prototype.init = function(options) {
    var parentEl = this._setParent(options.el);
    var media = getMedia(parentEl);
    this._setMedia(media);
    this._attachListeners();
};

DriveIn.prototype.show = function(rawItem, options) {
    if (rawItem.constructor === Array) {
        return this.showPlaylist([rawItem], options);
    }

    if (rawItem.constructor === Object) {
        return this.showPlaylist([
            [rawItem]
        ], options);
    }

    return this.showPlaylist([
        [playlistItem(rawItem)]
    ], options);
};

DriveIn.prototype.showPlaylist = function(rawPlaylist, options) {
    if (options.hasOwnProperty('mute')) {
        this.mute = options.mute;
    }
    if (options.hasOwnProperty('loop')) {
        this.loop = options.loop;
    }
    var playlist = makePlaylist(rawPlaylist);

    if (options.poster) {
        this.poster = options.poster;
    } else {
        this.poster = findPoster(playlist);
    }

    this._loadPlaylist(playlist);
};

DriveIn.prototype.setVolume = function(level) {
    if (this.currMediaType === 'image') {
        return;
    }

    if (level === 0) {
        this.mute = true;
        this.mediaEl.muted = true;
        this.mediaEl.volume = 0;
    } else {
        this.mute = false;
        this.mediaEl.muted = false;
        this.mediaEl.volume = level;
    }
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
        if (this.currMediaType === 'video') {
            this.mediaEl.play()
        } else {
            if (this._slideshowTimer) {
                this._slideshowTimer.resume();
            }
        }
    }
};

DriveIn.prototype.pause = function() {
    if (this.currMediaType === 'video') {
        this.mediaEl.pause()
    } else {
        if (this._slideshowTimer) {
            this._slideshowTimer.pause();
        }
    }
};

DriveIn.prototype.close = function() {
    this._removeAllListeners();
    if (this._slideshowTimer) {
        this._slideshowTimer.destroy();
        delete this._slideshowTimer;
    }
};

module.exports = DriveIn;
