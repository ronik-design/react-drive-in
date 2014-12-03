/*
 * React Video - drive-in =======
 * @version v1.0.0
 * @link https://github.com/ronik-design/react-drive-in
 * @license ISC
 * @author  ()
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

	/** @jsx React.DOM */var React = __webpack_require__(1);
	var DriveIn = __webpack_require__(2);
	
	module.exports = React.createClass({
	    displayName: 'DriveIn',
	
	    propTypes: {
	        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
	        showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
	        poster: React.PropTypes.string,
	        duration: React.PropTypes.number,
	        mute: React.PropTypes.bool,
	        loop: React.PropTypes.bool,
	        onPlaying: React.PropTypes.func
	    },
	
	    getDefaultProps:function() {
	        return {
	            className: 'drive-in',
	            duration: 'auto',
	            mute: true,
	            loop: true
	        };
	    },
	
	    getInitialState:function() {
	        return {
	            playlist: null,
	            initialized: false,
	            playing: false,
	            mute: true,
	            currentItem: 0
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
	
	    componentWillMount:function() {
	        this.DI = new DriveIn();
	    },
	
	    componentDidMount:function() {
	        var DI = this.DI,
	            options,
	            playlist;
	
	        DI.init({ el: this.getMedia() });
	
	        options = {
	            mute: this.props.mute,
	            duration: this.props.duration,
	            loop: this.props.loop
	        };
	
	        if (this.props.showPlaylist) {
	            playlist = DI.showPlaylist(this.props.showPlaylist, options);
	        } else {
	            playlist = DI.show(this.props.show, options);
	        }
	
	        DI.on('media.playing', function(currentItem)  { this.setPlaying(currentItem); }.bind(this));
	
	        this.setState({
	            mute: this.props.mute,
	            playlist: playlist,
	            initalized: true
	        });
	    },
	
	    componentWillUnmount:function() {
	        this.DI.close();
	    },
	
	    play:function(itemNum) {
	        this.DI.play(itemNum);
	    },
	
	    pause:function() {
	        this.DI.pause();
	    },
	
	    mute:function() {
	        this.DI.setVolume(0);
	    },
	
	    unmute:function() {
	        this.DI.setVolume(0.5);
	    },
	
	    renderMedia:function() {
	        var content;
	
	        if ('ontouchstart' in window) {
	            content = React.DOM.img(null);
	        } else {
	            content = React.DOM.video({height: "1", width: "1", preload: "auto", autoplay: true});
	        }
	
	        return (
	            React.DOM.div({ref: "media", id: "drive-in-media"}, 
	                content
	            )
	        );
	    },
	
	    render:function() {
	        return (
	          React.DOM.div({ref: "wrap", id: "drive-in-wrap", className: this.props.className}, 
	            this.renderMedia()
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

	/** @jsx React.DOM */var Jvent = __webpack_require__(3);
	var inherits = __webpack_require__(4);
	
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
	
	function makePlaylist(rawPlaylist) {
	    var playlist = [],
	        item;
	
	    for (var i in rawPlaylist) {
	        item = rawPlaylist[i];
	        if (item.constructor === Object) {
	            playlist.push([ item ]);
	        }
	
	        if (item.constructor === Array) {
	            playlist.push(makePlaylist(item));
	        }
	
	        if (typeof item === 'string') {
	            playlist.push([ playlistItem(item) ]);
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
	
	        if (!this.playlistLength < 2) {
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
	    this.playlistLength = playlist.length;
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
	            self.emit('media.playing', self.currentItem);
	        };
	
	        this.mediaEl.onended = function() {
	            self.emit('media.ended', self.currentItem);
	
	            if (self.playlistLength > 1) {
	                self.currentItem = (self.currentItem + 1 <= self.playlistList) ? self.currentItem + 1 : 0;
	                self.play(self.currentItem);
	            }
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
	
	DriveIn.prototype.showPlaylist = function (rawPlaylist, options) {
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


/***/ },
/* 3 */
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
/* 4 */
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

//# sourceMappingURL=react-drive-in.js.map