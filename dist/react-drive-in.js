(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactDriveIn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib');

},{"./lib":2}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Jvent = _interopRequire(require("jvent"));

var Timer = _interopRequire(require("./timer"));

var Playlist = _interopRequire(require("./playlist"));

var Utils = _interopRequire(require("./utils"));

var getWidth = Utils.getWidth,
    getHeight = Utils.getHeight,
    setStyles = Utils.setStyles,
    findPoster = Utils.findPoster,
    createEl = Utils.createEl,
    replaceChildren = Utils.replaceChildren;

var DriveIn = (function (_Jvent) {
    function DriveIn() {
        _classCallCheck(this, DriveIn);

        this._listeners = [];

        this.parentEl = null;
        this.mediaEl = null;
        this.placeholderEl = null;

        this.mute = true;
        this.currMediaType = null;
        this.mediaAspect = 16 / 9;
        this.playlist = null;
        this.loop = true;
        this.loopPlaylistItems = false;
        this.slideshow = false;

        this.playlistLength = 0;
        this.currentItem = 0;
        this.slideshowItemDuration = 10;
        this._slideshowTimer = null;
        this._seeking = false;

        this.poster = null;

        this.loading = true;
    }

    _inherits(DriveIn, _Jvent);

    _createClass(DriveIn, {
        _updateSize: {
            value: function _updateSize(mediaEl, mediaType, mediaAspect) {

                var pad = 1;

                var containerW = getWidth(),
                    containerH = getHeight(),
                    containerAspect = containerW / containerH;

                if (containerAspect < mediaAspect) {

                    // taller

                    setStyles(this.parentEl, {
                        width: Math.ceil(containerH * mediaAspect) + "px",
                        height: containerH + pad + "px"
                    });

                    if (mediaType === "video") {

                        setStyles(mediaEl, {
                            width: Math.ceil(containerH * mediaAspect) + "px",
                            height: containerH + "px"
                        });
                    } else {

                        // is image
                        setStyles(mediaEl, {
                            width: "auto",
                            height: containerH + pad + "px"
                        });
                    }
                } else {

                    // wider

                    setStyles(this.parentEl, {
                        width: containerW + "px",
                        height: Math.ceil(containerW / mediaAspect) + 1 + "px"
                    });

                    if (mediaType === "video") {

                        setStyles(mediaEl, {
                            width: this.parentEl.offsetWidth + "px",
                            height: "auto"
                        });
                    } else {

                        // is image
                        setStyles(mediaEl, {
                            width: containerW + "px",
                            height: "auto"
                        });
                    }
                }
            }
        },
        _setVideoData: {
            value: function _setVideoData() {
                var mediaEl = this.mediaEl;
                this.mediaAspect = mediaEl.videoWidth / mediaEl.videoHeight;
                this._updateSize(mediaEl, "video", this.mediaAspect);
            }
        },
        _setImageData: {
            value: function _setImageData(data) {
                this.mediaAspect = data.naturalWidth / data.naturalHeight;

                if (!this.isTouch) {
                    this._updateSize(this.mediaEl, "image", this.mediaAspect);
                }
            }
        },
        _playVideoItem: {
            value: function _playVideoItem(item, itemNum) {
                var mediaEl = this.mediaEl,
                    source,
                    sourceEl,
                    sourceEls = [],
                    posterSrc,
                    canPlayType;

                for (var i = item.length - 1; i >= 0; i--) {
                    source = item[i];

                    if (source.type.search(/^image/) === 0 && !posterSrc) {
                        posterSrc = source.src;
                    } else {
                        sourceEl = createEl("source", { src: source.src, type: source.type });
                    }

                    if (sourceEl) {
                        canPlayType = mediaEl.canPlayType(source.type);
                        if (canPlayType === "probably") {
                            sourceEls.unshift(sourceEl);
                        } else {
                            sourceEls.push(sourceEl);
                        }
                    }
                }

                if (sourceEls.length) {

                    this.emit("media.loading");

                    mediaEl.preload = "auto";
                    if (this.playlistLength < 2 || this.loopPlaylistItems) {
                        mediaEl.loop = true;
                    }

                    if (this.mute) {
                        this.setVolume(0);
                    }

                    if (posterSrc) {
                        mediaEl.poster = posterSrc;
                    }

                    replaceChildren(mediaEl, sourceEls);
                    this.currentItem = itemNum;

                    mediaEl.load();
                } else if (posterSrc || this.poster) {

                    // Fallback to a slideshow.
                    this.slideshow = true;
                    this._createMediaEl();
                    this._playImageItem(item, itemNum);
                } else {

                    this.emit("media.error", new Error("No playable source"));
                }
            }
        },
        _playImageItem: {
            value: function _playImageItem(item, itemNum) {
                var source, src;

                if (item && item.length) {
                    for (var i in item) {
                        source = item[i];
                        if (source.type.search(/^image/) === 0 && !src) {
                            src = source.src;
                        }
                    }
                }

                if (!src && this.poster) {
                    src = this.poster.src;
                }

                if (src) {

                    this.emit("media.loading");

                    this.mediaEl.src = src;
                    this.currentItem = itemNum;
                } else {

                    this.emit("media.error", new Error("No playable source"));
                }
            }
        },
        _setBackgroundItem: {
            value: function _setBackgroundItem() {
                this.parentEl.style["background-image"] = "url(\"" + this.poster.src + "\")";
            }
        },
        _playItem: {
            value: function _playItem(item, itemNum) {
                if (this.isTouch) {
                    this._setBackgroundItem();

                    // This should default to load the poster, which provides
                    // the necessary events
                    this._playImageItem();
                    return;
                }

                if (this.currMediaType === "video") {
                    this._playVideoItem(item, itemNum);
                }

                if (this.currMediaType === "image") {
                    this._playImageItem(item, itemNum);
                }

                this._seeking = false;
            }
        },
        _loadPlaylist: {
            value: function _loadPlaylist(playlist) {
                this.playlist = playlist;
                this.playlistLength = playlist.length;
                this._playItem(playlist[0], 0);
            }
        },
        _addListener: {
            value: function _addListener(element, event, handler) {

                element.addEventListener(event, handler);

                this._listeners.push({
                    element: element,
                    event: event,
                    handler: handler
                });
            }
        },
        _removeAllListeners: {
            value: function _removeAllListeners() {
                var listeners = this._listeners,
                    listen;

                for (var i in listeners) {
                    listen = listeners[i];
                    listen.element.removeEventListener(listen.event, listen.handler);
                }
            }
        },
        _attachVideoListeners: {
            value: function _attachVideoListeners() {
                var self = this,
                    mediaEl = this.mediaEl;

                function onLoadedMetadata(data) {
                    self._setVideoData(data);
                    self.emit("media.metadata", data);
                }

                function onPlaying() {
                    self.emit("media.playing", self.currentItem);
                }

                function onPause() {
                    self.emit("media.pause");
                }

                function onProgress(event) {
                    // Sort of buggy, with readyState and buffer being inconsistent...
                    var percent = null,
                        video = event.target;

                    // FF4+, Chrome
                    if (video.buffered && video.buffered.length > 0 && video.buffered.end && video.duration) {
                        percent = video.buffered.end(0) / video.duration;
                    }

                    // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
                    // to be anything other than 0. If the byte count is available we use this instead.
                    // Browsers that support the else if do not seem to have the bufferedBytes value and
                    // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
                    else if (typeof video.bytesTotal !== "undefined" && video.bytesTotal > 0 && typeof video.bufferedBytes !== "undefined") {
                        percent = video.bufferedBytes / video.bytesTotal;
                    }

                    if (percent !== null) {
                        percent = 100 * Math.min(1, Math.max(0, percent));
                    }

                    if (video.networkState === 1 && video.readyState === 0) {
                        percent = 100;
                    }

                    self.emit("media.progress", percent);
                }

                function onEnded() {
                    if (!self._seeking) {
                        self.emit("media.ended", self.currentItem);
                    }
                }

                function onCanPlay() {
                    self.emit("media.canplay");
                    mediaEl.play();
                    if (self._seeking) {
                        self._seeking = false;
                    }
                }

                this._addListener(mediaEl, "loadedmetadata", onLoadedMetadata);
                this._addListener(mediaEl, "playing", onPlaying);
                this._addListener(mediaEl, "pause", onPause);
                this._addListener(mediaEl, "ended", onEnded);
                this._addListener(mediaEl, "canplay", onCanPlay);
                this._addListener(mediaEl, "progress", onProgress, false);
            }
        },
        _attachImageListeners: {
            value: function _attachImageListeners() {
                var self = this,
                    mediaEl = this.mediaEl;

                function ended() {
                    var event = new Event("ended");
                    self.mediaEl.dispatchEvent(event);
                }

                function onPause() {
                    self.emit("media.pause");
                }

                function onLoad() {
                    self.emit("media.canplay");

                    self._setImageData(this);
                    self.emit("media.metadata", this);
                    self.emit("media.playing", self.currentItem);

                    if (self.isTouch) {
                        return;
                    }

                    if (self.playlistLength > 1) {
                        if (self._slideshowTimer) {
                            self._slideshowTimer.destroy();
                        }
                        self._slideshowTimer = new Timer(ended, self.slideshowItemDuration * 1000);

                        self._slideshowTimer.on("pause", onPause);
                    }
                }

                function onEnded() {
                    self.emit("media.ended", self.currentItem);
                }

                this._addListener(mediaEl, "load", onLoad);
                this._addListener(mediaEl, "ended", onEnded);
            }
        },
        _attachListeners: {
            value: function _attachListeners() {
                var self = this,
                    mediaEl = this.mediaEl;

                if (this.isTouch) {
                    this._attachImageListeners();
                    return;
                }

                function onResize() {
                    window.requestAnimationFrame(function () {
                        if (self.metadataLoaded) {
                            self._updateSize(mediaEl, self.currMediaType, self.mediaAspect);
                        }
                    });
                }

                this._addListener(window, "resize", onResize);

                if (this.currMediaType === "video") {
                    this._attachVideoListeners();
                } else {
                    this._attachImageListeners();
                }

                function onMediaEnded() {
                    if (this._seeking) {
                        return;
                    }

                    var itemNum = 0;

                    if (self.playlistLength > 1 && self.loopPlaylistItems) {
                        if (self.currMediaType === "image") {
                            // Images need a reboot, video is handled via `loop`
                            self.play(self.currentItem);
                        }
                        return;
                    }

                    if (self.playlistLength > 1 && self.loop) {
                        if (self.currentItem + 1 < self.playlistLength) {
                            itemNum = self.currentItem + 1;
                        }
                        self.play(itemNum);
                    }
                }

                function onMediaCanplay() {
                    mediaEl.style.opacity = 1;
                    self.canplay = true;
                }

                function onMediaMetadata() {
                    self.metadataLoaded = true;
                }

                function onMediaLoading() {
                    self.canplay = false;
                    self.metadataLoaded = false;
                }

                this.on("media.ended", onMediaEnded);
                this.on("media.canplay", onMediaCanplay);
                this.on("media.metadata", onMediaMetadata);
                this.on("media.loading", onMediaLoading);
            }
        },
        _setParent: {
            value: function _setParent(el) {

                if (this.isTouch) {

                    setStyles(el, {
                        width: "100%",
                        height: "100%",
                        display: "block",
                        "background-position": "50% 50%",
                        "background-repeat": "no-repeat no-repeat",
                        "background-attachment": "local",
                        "background-size": "cover"
                    });
                } else {

                    setStyles(el, {
                        position: "absolute",
                        display: "block",
                        transform: "translate3d(-50%,-50%,0)",
                        "-webkit-transform": "translate3d(-50%,-50%,0)",
                        left: "50%",
                        top: "50%"
                    });
                }

                return el;
            }
        },
        _cleanup: {
            value: function _cleanup() {
                var el = this.parentEl;
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }
        },
        _createMediaEl: {
            value: function _createMediaEl() {
                var mediaEl;

                if (this.mediaEl) {
                    this._cleanup();
                }

                if (this.isTouch) {

                    this.currMediaType = "image";
                    mediaEl = createEl("img");
                    setStyles(mediaEl, { display: "none" });
                    return mediaEl;
                } else if (this.slideshow) {

                    this.currMediaType = "image";
                    mediaEl = createEl("img");
                } else {

                    this.currMediaType = "video";
                    mediaEl = createEl("video", {
                        height: 1,
                        width: 1,
                        preload: "metadata"
                    });
                }

                if (mediaEl) {

                    mediaEl.style.opacity = 0;
                    setStyles(mediaEl, {
                        display: "block"
                    });

                    return mediaEl;
                }
            }
        },
        init: {
            value: function init(options) {
                options = options || {};

                this.isTouch = options.isTouch !== undefined ? options.isTouch : "ontouchstart" in window;

                this.slideshow = options.slideshow;

                this.parentEl = this._setParent(options.el);
                var mediaEl = this._createMediaEl();
                this.parentEl.appendChild(mediaEl);
                this.mediaEl = mediaEl;

                this._attachListeners();
            }
        },
        show: {
            value: function show(rawItem, options) {
                if (rawItem.constructor === Array) {
                    return this.showPlaylist([rawItem], options);
                }

                if (rawItem.constructor === Object) {
                    return this.showPlaylist([[rawItem]], options);
                }

                return this.showPlaylist([Playlist.makePlaylistItem(rawItem)], options);
            }
        },
        showPlaylist: {
            value: function showPlaylist(rawPlaylist, options) {
                options = options || {};

                if (options.hasOwnProperty("mute")) {
                    this.mute = options.mute;
                }

                if (options.hasOwnProperty("loop")) {
                    this.loop = options.loop;
                }

                if (options.hasOwnProperty("loopPlaylistItems")) {
                    this.loopPlaylistItems = options.loopPlaylistItems;
                    if (this.loopPlaylistItems) {
                        this.loop = false;
                    }
                }

                var playlist = Playlist.makePlaylist(rawPlaylist);

                if (options.poster) {
                    if (typeof options.poster === "string") {
                        this.poster = { src: options.poster };
                    } else {
                        this.poster = options.poster;
                    }
                } else {
                    this.poster = findPoster(playlist);
                }

                this._loadPlaylist(playlist);
            }
        },
        setVolume: {
            value: function setVolume(level) {
                if (this.currMediaType === "image") {
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
            }
        },
        setPlaybackRate: {
            value: function setPlaybackRate(rate) {
                if (this.currMediaType === "image") {
                    return;
                }

                this.mediaEl.playbackRate = rate || 1;
            }
        },
        getMedia: {
            value: function getMedia() {
                return this.mediaEl;
            }
        },
        getPlaylist: {
            value: function getPlaylist() {
                return this.playlist;
            }
        },
        getItem: {
            value: function getItem(itemNum) {
                return this.playlist[itemNum];
            }
        },
        play: {
            value: function play(itemNum) {
                this._seeking = true;

                if (typeof itemNum === "number") {
                    this._playItem(this.playlist[itemNum], itemNum);
                } else {
                    if (this.currMediaType === "video") {
                        this.mediaEl.play();
                    } else {
                        if (this._slideshowTimer) {
                            this._slideshowTimer.resume();
                        }
                    }
                }
            }
        },
        pause: {
            value: function pause() {
                if (this.currMediaType === "video") {
                    this.mediaEl.pause();
                } else {
                    if (this._slideshowTimer) {
                        this._slideshowTimer.pause();
                    }
                }
            }
        },
        close: {
            value: function close() {
                this._removeAllListeners();
                this._cleanup();
                if (this._slideshowTimer) {
                    this._slideshowTimer.destroy();
                    delete this._slideshowTimer;
                }
            }
        },
        currentTime: {
            value: function currentTime() {
                if (this.currMediaType === "video") {
                    return this.mediaEl.currentTime;
                } else {
                    return this._slideshowTimer.currentTime();
                }
            }
        },
        seekTo: {
            value: function seekTo(time) {
                this._seeking = true;
                if (this.currMediaType === "video") {
                    this.mediaEl.currentTime = time;
                }
            }
        },
        duration: {
            value: function duration() {
                if (this.currMediaType === "video") {
                    return this.mediaEl.duration;
                } else {
                    return this.slideshowItemDuration;
                }
            }
        }
    });

    return DriveIn;
})(Jvent);

module.exports = DriveIn;
},{"./playlist":3,"./timer":4,"./utils":5,"jvent":6}],3:[function(require,module,exports){
"use strict";

function playlistItem(src) {
    var item = {},
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

    var ext = src.replace(/[\?|\#].+/, "").match(/\.([mp4|ogv|webm|jpg|jpeg|png|gif]+)$/)[1];

    if (videoExts[ext]) {
        if (ext === "ogv") {
            item.type = "video/ogg";
        } else {
            item.type = "video/" + ext;
        }
    }

    if (imageExts[ext]) {
        if (ext === "jpg") {
            item.type = "image/jpeg";
        } else {
            item.type = "image/" + ext;
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

        if (typeof item === "string") {
            if (depth === 0) {
                playlist.push([playlistItem(item)]);
            } else {
                playlist.push(playlistItem(item));
            }
        }
    }

    return playlist;
}

module.exports = {
    makePlaylist: makePlaylist,
    makePlaylistItem: playlistItem
};
},{}],4:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Jvent = _interopRequire(require("jvent"));

var Timer = (function (_Jvent) {
    function Timer(callback, delay) {
        _classCallCheck(this, Timer);

        this.callback = callback;
        this.remaining = delay;
        this.timerId = null;
        this.start = null;

        this.resume();
    }

    _inherits(Timer, _Jvent);

    _createClass(Timer, {
        pause: {
            value: function pause(silent) {
                clearTimeout(this.timerId);
                this.remaining -= new Date() - this.start;

                if (!silent) {
                    this.emit("pause");
                }
            }
        },
        resume: {
            value: function resume(silent) {
                this.start = new Date();
                clearTimeout(this.timerId);
                this.timerId = setTimeout(this.callback, this.remaining);

                if (!silent) {
                    this.emit("resume");
                }
            }
        },
        currentTime: {
            value: function currentTime() {
                var currTime = new Date() - this.start;
                if (this.timerId) {
                    this.pause(true);
                    this.resume(true);
                }
                return currTime;
            }
        },
        destroy: {
            value: function destroy() {
                this.pause(true);
                this.removeAllListeners();
            }
        }
    });

    return Timer;
})(Jvent);

module.exports = Timer;
},{"jvent":6}],5:[function(require,module,exports){
"use strict";

function getWidth() {
    if (self.innerHeight) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }
}

function getHeight() {
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
    var cssString = "";
    for (var p in props) {
        cssString += p + ":" + props[p] + ";";
    }
    el.style.cssText += ";" + cssString;
}

function findPoster(playlist) {
    var poster, item;

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

function eachNode(nodes, fn) {
    [].slice.call(nodes).forEach(fn);
}

function replaceChildren(el, newChildren) {
    var children = el.children || el.childNodes;

    if (children.length) {
        eachNode(children, function (childEl) {
            var newChild = newChildren.shift();
            if (newChild) {
                el.replaceChild(newChild, childEl);
            } else {
                el.removeChild(childEl);
            }
        });
    }

    if (newChildren.length) {
        newChildren.forEach(function (newChild) {
            el.appendChild(newChild);
        });
    }
}

function createEl(name, props) {
    var el = document.createElement(name);
    for (var prop in props) {
        el[prop] = props[prop];
    }
    return el;
}

module.exports = {
    getWidth: getWidth,
    getHeight: getHeight,
    setStyles: setStyles,
    findPoster: findPoster,
    eachNode: eachNode,
    replaceChildren: replaceChildren,
    createEl: createEl
};
},{}],6:[function(require,module,exports){
'use strict';

function Jvent() {}

/**
 * Adds a listener to the collection for a specified event.
 * @public
 * @function
 * @name Jvent#on
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @example
 * // Will add a event listener to the "ready" event
 * var startDoingStuff = function (event, param1, param2, ...) {
 *   // Some code here!
 * };
 *
 * me.on("ready", startDoingStuff);
 */
Jvent.prototype.on = function(event, listener) {
  this._collection = this._collection || {};
  this._collection[event] = this._collection[event] || [];
  this._collection[event].push(listener);
  return this;
};

/**
 * Adds a one time listener to the collection for a specified event. It will execute only once.
 * @public
 * @function
 * @name Jvent#once
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will add a event handler to the "contentLoad" event once
 * me.once("contentLoad", startDoingStuff);
 */
Jvent.prototype.once = function (event, listener) {
  var that = this;

  function fn() {
    that.off(event, fn);
    listener.apply(this, arguments);
  }

  fn.listener = listener;

  this.on(event, fn);

  return this;
};

/**
 * Removes a listener from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#off
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will remove event handler to the "ready" event
 * var startDoingStuff = function () {
 *   // Some code here!
 * };
 *
 * me.off("ready", startDoingStuff);
 */
Jvent.prototype.off = function (event, listener) {

  var listeners = this._collection[event],
      j = 0;

  if (listeners !== undefined) {
    for (j; j < listeners.length; j += 1) {
      if (listeners[j] === listener || listeners[j].listener === listener) {
        listeners.splice(j, 1);
        break;
      }
    }
  }

  if (listeners.length === 0) {
    this.removeAllListeners(event);
  }

  return this;
};

/**
 * Removes all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#removeAllListeners
 * @param {string} event Event name.
 * @returns itself
 * @example
 * me.removeAllListeners("ready");
 */
Jvent.prototype.removeAllListeners = function (event) {
  this._collection = this._collection || {};
  delete this._collection[event];
  return this;
};

/**
 * Returns all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#listeners
 * @param {string} event Event name.
 * @returns Array
 * @example
 * me.listeners("ready");
 */
Jvent.prototype.listeners = function (event) {
  this._collection = this._collection || {};
  return this._collection[event];
};

/**
 * Execute each item in the listener collection in order with the specified data.
 * @name Jvent#emit
 * @public
 * @protected
 * @param {string} event The name of the event you want to emit.
 * @param {...object} var_args Data to pass to the listeners.
 * @example
 * // Will emit the "ready" event with "param1" and "param2" as arguments.
 * me.emit("ready", "param1", "param2");
 */
Jvent.prototype.emit = function () {
  if (this._collection === undefined) {
    return this;
  }

  var args = [].slice.call(arguments, 0), // converted to array
      event = args.shift(),
      listeners = this._collection[event],
      i = 0,
      len;

  if (listeners) {
    listeners = listeners.slice(0);
    len = listeners.length;
    for (i; i < len; i += 1) {
      listeners[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Expose
 */
module.exports = Jvent;

},{}],7:[function(require,module,exports){
(function (global){
"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);

var _react2 = _interopRequireDefault(_react);

var _driveIn = require("drive-in");

var _driveIn2 = _interopRequireDefault(_driveIn);

var ReactDriveIn = (function (_React$Component) {
  _inherits(ReactDriveIn, _React$Component);

  function ReactDriveIn(props) {
    _classCallCheck(this, ReactDriveIn);

    _React$Component.call(this, props);

    this.state = {
      className: props.className,
      mute: props.mute,
      loop: props.loop,
      loopPaylistItems: props.loopPlaylistItems,
      slideshow: props.slideshow,
      volume: props.volume,
      onTimeFrequency: props.onTimeFrequency
    };

    this.setPlaying = this.setPlaying.bind(this);
    this.setPause = this.setPause.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setCanPlay = this.setCanPlay.bind(this);
  }

  ReactDriveIn.prototype.getMedia = function getMedia() {
    return this.refs.media.getDOMNode();
  };

  ReactDriveIn.prototype.getPlaylist = function getPlaylist() {
    return this.state.playlist;
  };

  ReactDriveIn.prototype.setPlaying = function setPlaying(currentItem) {
    this.setState({ playing: true, currentItem: currentItem });
    if (this.props.onPlaying) {
      this.props.onPlaying(currentItem);
    }
  };

  ReactDriveIn.prototype.setPause = function setPause() {
    this.setState({ playing: false });
    if (this.props.onPause) {
      this.props.onPause();
    }
  };

  ReactDriveIn.prototype.setLoading = function setLoading() {
    this.setState({ canPlay: false });
  };

  ReactDriveIn.prototype.setCanPlay = function setCanPlay() {
    this.setState({ canPlay: true });
    if (this.props.onCanPlay) {
      this.props.onCanPlay();
    }
  };

  ReactDriveIn.prototype.componentWillMount = function componentWillMount() {
    this.DI = new _driveIn2["default"]();
    this.DI.on("media.playing", this.setPlaying);
    this.DI.on("media.pause", this.setPause);
    this.DI.on("media.loading", this.setLoading);
    this.DI.on("media.canplay", this.setCanPlay);
  };

  ReactDriveIn.prototype.componentDidMount = function componentDidMount() {
    var _this = this;

    var playlist = undefined;

    this.DI.init({
      el: this.getMedia(),
      slideshow: this.props.slideshow
    });

    var options = {
      mute: this.props.mute,
      loop: this.props.loop,
      loopPlaylistItems: this.props.loopPlaylistItems,
      poster: this.props.poster,
      isTouch: this.props.isTouch
    };

    if (this.props.showPlaylist) {
      playlist = this.DI.showPlaylist(this.props.showPlaylist, options);
    } else {
      playlist = this.DI.show(this.props.show, options);
    }

    if (this.props.onTime) {
      this.intervalId = window.setInterval(function () {
        _this.props.onTime(_this.DI.currentTime());
      }, this.props.onTimeFrequency);
    }

    if (this.props.playbackRate) {
      this.playbackRate(this.props.playbackRate);
    }

    this.setState({ initalized: true, playlist: playlist });
  };

  ReactDriveIn.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.DI.removeAllListeners();
    this.DI.close();
    delete this.DI;
  };

  ReactDriveIn.prototype.play = function play(itemNum) {
    this.DI.play(itemNum);
  };

  ReactDriveIn.prototype.pause = function pause() {
    this.DI.pause();
  };

  ReactDriveIn.prototype.mute = function mute() {
    this.DI.setVolume(0);
    this.setState({ mute: true });
  };

  ReactDriveIn.prototype.unmute = function unmute() {
    this.DI.setVolume(this.props.volume);
    this.setState({ mute: false });
  };

  ReactDriveIn.prototype.playbackRate = function playbackRate(rate) {
    rate = rate || 1.0;
    this.DI.setPlaybackRate(rate);
    this.setState({ playbackRate: rate });
  };

  ReactDriveIn.prototype.seekTo = function seekTo(time) {
    this.DI.seekTo(time);
  };

  ReactDriveIn.prototype.duration = function duration() {
    return this.DI.duration();
  };

  ReactDriveIn.prototype.render = function render() {
    return _react2["default"].createElement(
      "div",
      { ref: "wrap", className: this.props.className + " drive-in-wrap" },
      _react2["default"].createElement("div", { ref: "media", className: "drive-in-media" })
    );
  };

  return ReactDriveIn;
})(_react2["default"].Component);

ReactDriveIn.displayName = "DriveIn";

ReactDriveIn.propTypes = {
  show: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.array]),
  showPlaylist: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.array]),
  poster: _react2["default"].PropTypes.string,
  mute: _react2["default"].PropTypes.bool,
  loop: _react2["default"].PropTypes.bool,
  loopPlaylistItems: _react2["default"].PropTypes.bool,
  playbackRate: _react2["default"].PropTypes.number,
  slideshow: _react2["default"].PropTypes.bool,
  onPlaying: _react2["default"].PropTypes.func,
  onPause: _react2["default"].PropTypes.func,
  onTime: _react2["default"].PropTypes.func,
  onTimeFrequency: _react2["default"].PropTypes.number,
  onCanPlay: _react2["default"].PropTypes.func,
  isTouch: _react2["default"].PropTypes.func,
  volume: _react2["default"].PropTypes.number,
  className: _react2["default"].PropTypes.string
};

ReactDriveIn.defaultProps = {
  className: "drive-in",
  mute: true,
  loop: true,
  loopPaylistItems: false,
  slideshow: false,
  volume: 0.5,
  onTimeFrequency: 500
};

exports["default"] = ReactDriveIn;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"drive-in":1}]},{},[7])(7)
});