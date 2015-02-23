/*
 * React Video - React component supporting background videos and playlists.
 * @version v1.3.1
 * @link https://github.com/ronik-design/react-drive-in
 * @license ISC
 * @author Ronik Design (http://www.ronikdesign.com)
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactDriveIn"] = factory(require("react"));
	else
		root["ReactDriveIn"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var React = __webpack_require__(1),
	    DriveIn = __webpack_require__(2);

	module.exports = React.createClass({
	    displayName: 'DriveIn',

	    propTypes: {
	        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
	        showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
	        poster: React.PropTypes.string,
	        mute: React.PropTypes.bool,
	        loop: React.PropTypes.bool,
	        loopPlaylistItems: React.PropTypes.bool,
	        playbackRate: React.PropTypes.number,
	        slideshow: React.PropTypes.bool,
	        onPlaying: React.PropTypes.func,
	        onPause: React.PropTypes.func,
	        onTime: React.PropTypes.func,
	        onTimeFrequency: React.PropTypes.number,
	        onCanPlay: React.PropTypes.func
	    },

	    getDefaultProps:function() {
	        return {
	            className: 'drive-in',
	            mute: true,
	            loop: true,
	            loopPaylistItems: false,
	            slideshow: false,
	            volume: 0.5,
	            onTimeFrequency: 500
	        };
	    },

	    getInitialState:function() {
	        return {
	            playlist: null,
	            initialized: false,
	            playing: false,
	            mute: true,
	            currentItem: 0,
	            playbackRate: 1.0
	        };
	    },

	    getMedia:function() {
	        return this.refs.media.getDOMNode();
	    },

	    getPlaylist:function() {
	        return this.state.playlist;
	    },

	    setPlaying:function(currentItem) {
	        this.setState({
	            playing: true,
	            currentItem: currentItem
	        });

	        if (this.props.onPlaying) {
	            this.props.onPlaying(currentItem);
	        }
	    },

	    setPause:function() {
	        this.setState({ playing: false });
	        if (this.props.onPause) {
	            this.props.onPause();
	        }
	    },

	    setLoading:function() {
	        this.setState({ canPlay: false });
	    },

	    setCanPlay:function() {
	        this.setState({ canPlay: true });
	        if (this.props.onCanPlay) {
	            this.props.onCanPlay();
	        }
	    },

	    componentWillMount:function() {
	        this.DI = new DriveIn();
	    },

	    componentDidMount:function() {
	        var DI = this.DI,
	            options,
	            playlist;

	        DI.init({ el: this.getMedia(), slideshow: this.props.slideshow });

	        options = {
	            mute: this.props.mute,
	            loop: this.props.loop,
	            loopPlaylistItems: this.props.loopPlaylistItems,
	            poster: this.props.poster
	        };

	        if (this.props.showPlaylist) {
	            playlist = DI.showPlaylist(this.props.showPlaylist, options);
	        } else {
	            playlist = DI.show(this.props.show, options);
	        }

	        DI.on('media.playing', function(currentItem)  { this.setPlaying(currentItem); }.bind(this));
	        DI.on('media.pause', function()  { this.setPause(); }.bind(this));
	        DI.on('media.loading', function()  { this.setLoading(); }.bind(this));
	        DI.on('media.canplay', function()  { this.setCanPlay(); }.bind(this));

	        if (this.props.onTime) {
	            this.intervalId = window.setInterval(function()  {
	                var currTime = DI.currentTime();
	                this.props.onTime(currTime);
	            }.bind(this), this.props.onTimeFrequency);
	        }

	        if (this.props.playbackRate) {
	            this.playbackRate(this.props.playbackRate);
	        }

	        this.setState({
	            mute: this.props.mute,
	            playlist: playlist,
	            initalized: true
	        });
	    },

	    componentWillUnmount:function() {
	        if (this.intervalId) {
	            window.clearInterval(this.intervalId);
	        }

	        this.DI.removeAllListeners();
	        this.DI.close();
	        delete(this.DI);
	    },

	    play:function(itemNum) {
	        this.DI.play(itemNum);
	    },

	    pause:function() {
	        this.DI.pause();
	    },

	    mute:function() {
	        this.DI.setVolume(0);
	        this.setState({ mute: true });
	    },

	    unmute:function() {
	        this.DI.setVolume(this.props.volume);
	        this.setState({ mute: false });
	    },

	    playbackRate:function(rate) {
	        rate = rate || 1.0;
	        this.DI.setPlaybackRate(rate);
	        this.setState({ playbackRate: rate });
	    },

	    seekTo:function(time) {
	        this.DI.seekTo(time);
	    },

	    duration:function() {
	        return this.DI.duration();
	    },

	    render:function() {
	        return (
	          React.DOM.div({ref: "wrap", id: "drive-in-wrap", className: this.props.className}, 
	            React.DOM.div({ref: "media", className: "drive-in-media"})
	          )
	        );
	    }
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */module.exports = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var Jvent = __webpack_require__(7),
	    inherits = __webpack_require__(8),
	    Timer = __webpack_require__(4),
	    Playlist = __webpack_require__(5),
	    Utils = __webpack_require__(6),
	    getWidth = Utils.getWidth,
	    getHeight = Utils.getHeight,
	    setStyles = Utils.setStyles,
	    findPoster = Utils.findPoster,
	    createEl = Utils.createEl,
	    replaceChildren = Utils.replaceChildren;

	function DriveIn() {
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

	inherits(DriveIn, Jvent);

	DriveIn.prototype._updateSize = function(mediaEl, mediaType, mediaAspect) {

	    var pad = 1;

	    var containerW = getWidth(),
	        containerH = getHeight(),
	        containerAspect = containerW / containerH;

	    if (containerAspect < mediaAspect) {

	        // taller

	        setStyles(this.parentEl, {
	            width: Math.ceil(containerH * mediaAspect) + 'px',
	            height: containerH + pad + 'px'
	        });

	        if (mediaType === 'video') {

	            setStyles(mediaEl, {
	                width: Math.ceil(containerH * mediaAspect) + 'px',
	                height: containerH + 'px'
	            });

	        } else {

	            // is image
	            setStyles(mediaEl, {
	                width: 'auto',
	                height: containerH + pad + 'px'
	            });
	        }

	    } else {

	        // wider

	        setStyles(this.parentEl, {
	            width: containerW + 'px',
	            height: Math.ceil(containerW / mediaAspect) + 1 + 'px'
	        });

	        if (mediaType === 'video') {

	            setStyles(mediaEl, {
	                width: this.parentEl.offsetWidth + 'px',
	                height: 'auto'
	            });

	        } else {

	            // is image
	            setStyles(mediaEl, {
	                width: containerW + 'px',
	                height: 'auto'
	            });
	        }
	    }
	};

	DriveIn.prototype._setVideoData = function() {
	    var mediaEl = this.mediaEl;
	    this.mediaAspect = mediaEl.videoWidth / mediaEl.videoHeight;
	    this._updateSize(mediaEl, 'video', this.mediaAspect);
	};

	DriveIn.prototype._setImageData = function(data) {
	    this.mediaAspect = data.naturalWidth / data.naturalHeight;

	    if (!this.isTouch) {
	        this._updateSize(this.mediaEl, 'image', this.mediaAspect);
	    }
	};

	DriveIn.prototype._playVideoItem = function(item, itemNum) {
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
	            sourceEl = createEl('source', { src: source.src, type: source.type });
	        }

	        if (sourceEl) {
	            canPlayType = mediaEl.canPlayType(source.type);
	            if (canPlayType === 'probably') {
	                sourceEls.unshift(sourceEl);
	            } else {
	                sourceEls.push(sourceEl);
	            }
	        }
	    }

	    if (sourceEls.length) {

	        this.emit('media.loading');

	        mediaEl.preload = 'auto';
	        if (this.playlistLength < 2 || this.loopPlaylistItems) mediaEl.loop = true;
	        if (this.mute) this.setVolume(0);

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

	        this.emit('media.error', new Error('No playable source'));
	    }
	};

	DriveIn.prototype._playImageItem = function(item, itemNum) {
	    var source,
	        src;

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

	        this.emit('media.loading');

	        this.mediaEl.src = src;
	        this.currentItem = itemNum;

	    } else {

	        this.emit('media.error', new Error('No playable source'));
	    }
	};

	DriveIn.prototype._setBackgroundItem = function() {
	    this.parentEl.style['background-image'] = 'url("' + this.poster.src + '")';
	};

	DriveIn.prototype._playItem = function(item, itemNum) {
	    if (this.isTouch) {
	        this._setBackgroundItem();

	        // This should default to load the poster, which provides
	        // the necessary events
	        this._playImageItem();
	        return;
	    }

	    if (this.currMediaType === 'video') {
	        this._playVideoItem(item, itemNum);
	    }

	    if (this.currMediaType === 'image') {
	        this._playImageItem(item, itemNum);
	    }

	    this._seeking = false;
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
	        self.emit('media.metadata', data);
	    }

	    function onPlaying() {
	        self.emit('media.playing', self.currentItem);
	    }

	    function onPause() {
	        self.emit('media.pause');
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
	        else if (typeof video.bytesTotal !== 'undefined' && video.bytesTotal > 0 && typeof video.bufferedBytes !== 'undefined') {
	            percent = video.bufferedBytes / video.bytesTotal;
	        }

	        if (percent !== null) {
	            percent = 100 * Math.min(1, Math.max(0, percent));
	        }

	        if (video.networkState === 1 && video.readyState === 0) {
	            percent = 100;
	        }

	        self.emit('media.progress', percent);
	    }

	    function onEnded() {
	        if (!self._seeking) {
	            self.emit('media.ended', self.currentItem);
	        }
	    }

	    function onCanPlay() {
	        self.emit('media.canplay');
	        mediaEl.play();
	        if (self._seeking) {
	            self._seeking = false;
	        }
	    }

	    this._addListener(mediaEl, 'loadedmetadata', onLoadedMetadata);
	    this._addListener(mediaEl, 'playing', onPlaying);
	    this._addListener(mediaEl, 'pause', onPause);
	    this._addListener(mediaEl, 'ended', onEnded);
	    this._addListener(mediaEl, 'canplay', onCanPlay);
	    this._addListener(mediaEl, 'progress', onProgress, false);
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

	    function onLoad() {
	        self.emit('media.canplay');

	        self._setImageData(this);
	        self.emit('media.metadata', this);
	        self.emit('media.playing', self.currentItem);

	        if (self.isTouch) return;

	        if (self.playlistLength > 1) {
	            if (self._slideshowTimer) self._slideshowTimer.destroy();
	            self._slideshowTimer = new Timer(ended, self.slideshowItemDuration * 1000);

	            self._slideshowTimer.on('pause', onPause);
	        }
	    }

	    function onEnded() {
	        self.emit('media.ended', self.currentItem);
	    }

	    this._addListener(mediaEl, 'load', onLoad);
	    this._addListener(mediaEl, 'ended', onEnded);
	};

	DriveIn.prototype._attachListeners = function() {
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

	    this._addListener(window, 'resize', onResize);

	    if (this.currMediaType === 'video') {
	        this._attachVideoListeners();
	    } else {
	        this._attachImageListeners();
	    }

	    function onMediaEnded() {
	        if (this._seeking) return;

	        var itemNum = 0;

	        if (self.playlistLength > 1 && self.loopPlaylistItems) {
	            if( self.currMediaType === 'image') {
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

	    this.on('media.ended', onMediaEnded);
	    this.on('media.canplay', onMediaCanplay);
	    this.on('media.metadata', onMediaMetadata);
	    this.on('media.loading', onMediaLoading);
	};

	DriveIn.prototype._setParent = function(el) {

	    if (this.isTouch) {

	        setStyles(el, {
	            width: '100%',
	            height: '100%',
	            display: 'block',
	            'background-position': '50% 50%',
	            'background-repeat': 'no-repeat no-repeat',
	            'background-attachment': 'local',
	            'background-size': 'cover'
	        });

	    } else {

	        setStyles(el, {
	            position: 'absolute',
	            display: 'block',
	            transform: 'translate3d(-50%,-50%,0)',
	            '-webkit-transform': 'translate3d(-50%,-50%,0)',
	            left: '50%',
	            top: '50%'
	        });
	    }

	    return el;
	};

	DriveIn.prototype._cleanup = function() {
	    var el = this.parentEl;
	    while (el.firstChild) {
	        el.removeChild(el.firstChild);
	    }
	};

	DriveIn.prototype._createMediaEl = function() {
	    var mediaEl;

	    if (this.mediaEl) this._cleanup();

	    if (this.isTouch) {

	        this.currMediaType = 'image';
	        mediaEl = createEl('img');
	        setStyles(mediaEl, { display: 'none' });
	        return mediaEl;

	    } else if (this.slideshow) {

	        this.currMediaType = 'image';
	        mediaEl = createEl('img');

	    } else {

	        this.currMediaType = 'video';
	        mediaEl = createEl('video', {
	            height: 1,
	            width: 1,
	            preload: 'metadata'
	        });
	    }

	    if (mediaEl) {

	        mediaEl.style.opacity = 0;
	        setStyles(mediaEl, {
	            display: 'block'
	        });

	        return mediaEl;
	    }
	};

	DriveIn.prototype._prepareContainer = function() {
	    var containerH = getHeight();

	    if (document.body.offsetHeight < containerH) {
	        setStyles(document.body, {
	            height: 'auto'
	        });

	        if (containerH > document.body.offsetHeight) {
	            setStyles(document.body, {
	                height: '100%'
	            });
	            setStyles(document.documentElement, {
	                height: '100%'
	            });
	        }
	    }
	};

	DriveIn.prototype.init = function(options) {
	    options = options || {};

	    if ('ontouchstart' in window || options.slideshow) {
	        this.isTouch = true;
	    }

	    this._prepareContainer();

	    this.parentEl = this._setParent(options.el);
	    var mediaEl = this._createMediaEl();
	    this.parentEl.appendChild(mediaEl);
	    this.mediaEl = mediaEl;

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

	    return this.showPlaylist([Playlist.makePlaylistItem(rawItem)], options);
	};

	DriveIn.prototype.showPlaylist = function(rawPlaylist, options) {
	    options = options || {};

	    if (options.hasOwnProperty('mute')) {
	        this.mute = options.mute;
	    }

	    if (options.hasOwnProperty('loop')) {
	        this.loop = options.loop;
	    }

	    if (options.hasOwnProperty('loopPlaylistItems')) {
	        this.loopPlaylistItems = options.loopPlaylistItems;
	        if (this.loopPlaylistItems) {
	            this.loop = false;
	        }
	    }

	    var playlist = Playlist.makePlaylist(rawPlaylist);

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

	DriveIn.prototype.setPlaybackRate = function(rate) {
	    if (this.currMediaType === 'image') {
	        return;
	    }

	    this.mediaEl.playbackRate = rate || 1.0;
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
	    this._seeking = true;

	    if (typeof itemNum === 'number') {
	        this._playItem(this.playlist[itemNum], itemNum);
	    } else {
	        if (this.currMediaType === 'video') {
	            this.mediaEl.play();
	        } else {
	            if (this._slideshowTimer) {
	                this._slideshowTimer.resume();
	            }
	        }
	    }
	};

	DriveIn.prototype.pause = function() {
	    if (this.currMediaType === 'video') {
	        this.mediaEl.pause();
	    } else {
	        if (this._slideshowTimer) {
	            this._slideshowTimer.pause();
	        }
	    }
	};

	DriveIn.prototype.close = function() {
	    this._removeAllListeners();
	    this._cleanup();
	    if (this._slideshowTimer) {
	        this._slideshowTimer.destroy();
	        delete this._slideshowTimer;
	    }
	};

	DriveIn.prototype.currentTime = function() {
	    if (this.currMediaType === 'video') {
	        return this.mediaEl.currentTime;
	    } else {
	        return this._slideshowTimer.currentTime();
	    }
	};

	DriveIn.prototype.seekTo = function(time) {
	    this._seeking = true;
	    if (this.currMediaType === 'video') {
	        this.mediaEl.currentTime = time;
	    } else {
	        // Not enabled for image slideshows
	    }
	};

	DriveIn.prototype.duration = function() {
	    if (this.currMediaType === 'video') {
	        return this.mediaEl.duration;
	    } else {
	        return this.slideshowItemDuration;
	    }
	};

	module.exports = DriveIn;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var Jvent = __webpack_require__(7),
	    inherits = __webpack_require__(8);

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

	    this.currentTime = function() {
	        var currTime = new Date() - start;
	        if (timerId) {
	            this.pause(true);
	            this.resume(true);
	        }
	        return currTime;
	    };

	    this.destroy = function() {
	        self.pause(true);
	        self.removeAllListeners();
	    };

	    this.resume();
	}

	inherits(Timer, Jvent);

	module.exports = Timer;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */function playlistItem(src) {
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

	    var ext = src.replace(/[\?|\#].+/, '').match(/\.([mp4|ogv|webm|jpg|jpeg|png|gif]+)$/)[1];

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

	exports.makePlaylist = makePlaylist;
	exports.makePlaylistItem = playlistItem;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var internals = {};

	internals.getWidth = function() {
	    if (self.innerHeight) {
	        return self.innerWidth;
	    }

	    if (document.documentElement && document.documentElement.clientWidth) {
	        return document.documentElement.clientWidth;
	    }

	    if (document.body) {
	        return document.body.clientWidth;
	    }
	};

	internals.getHeight = function() {
	    if (self.innerHeight) {
	        return self.innerHeight;
	    }

	    if (document.documentElement && document.documentElement.clientHeight) {
	        return document.documentElement.clientHeight;
	    }

	    if (document.body) {
	        return document.body.clientHeight;
	    }
	};

	internals.setStyles = function(el, props) {
	    var cssString = '';
	    for (var p in props) {
	        cssString += p + ':' + props[p] + ';';
	    }
	    el.style.cssText += ';' + cssString;
	};

	internals.findPoster = function(playlist) {
	    var poster,
	        item;

	    for (var i in playlist) {
	        item = playlist[i];

	        if (item.constructor === Array) {
	            poster = internals.findPoster(item);
	        } else {
	            if (item.type.search(/^image/) > -1) {
	                return item;
	            }
	        }

	        if (poster) {
	            return poster;
	        }
	    }
	};

	internals.eachNode = function(nodes, fn) {
	    [].slice.call(nodes).forEach(fn);
	};

	internals.replaceChildren = function(el, newChildren) {
	    var children = el.children || el.childNodes;

	    if (children.length) {
	        internals.eachNode(children, function (childEl) {
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
	};

	internals.createEl = function(name, props) {
	    var el = document.createElement(name);
	    for (var prop in props) {
	        el[prop] = props[prop];
	    }
	    return el;
	};

	module.exports = internals;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */'use strict';

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }
/******/ ])
});
