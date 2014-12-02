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
	
	function playlistItem(src) {
	    var item = {},
	        type,
	        videoExts = { mp4: true, ogg: true, webm: true },
	        imageExts = { jpg: true, png: true, gif: true };
	
	    var ext = src.match(/\.([mp4|ogg|webm|jpg|png|gif]+)$/)[1];
	    if (videoExts[ext]) {
	        type = 'video/' + ext;
	    }
	
	    if (imageExts[ext]) {
	        type = 'image/' + ext;
	    }
	
	    item[type] = src;
	    return item;
	}
	
	function makePlaylist(toShow) {
	    var playlist = [];
	
	    if (typeof(toShow) === 'string') {
	        playlist.push(playlistItem(toShow));
	    }
	
	    if (toShow.constructor === Array) {
	        for (var i in toShow) {
	            playlist.push(makePlaylist(toShow[i]));
	        }
	    }
	
	    if (toShow.constructor === Object) {
	        playlist.push(toShow);
	    }
	
	    return playlist;
	}
	
	module.exports = React.createClass({
	    displayName: 'DriveIn',
	
	    propTypes: {
	        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object, React.PropTypes.array]).isRequired,
	        poster: React.PropTypes.string.isRequired,
	        ambient: React.PropTypes.bool
	    },
	
	    getDefaultProps:function() {
	        return {
	            className: 'drive-in',
	            ambient: true
	        };
	    },
	
	    getInitialState:function() {
	        return {
	            thumb: null,
	            imageLoaded: false,
	            showingVideo: false,
	
	            playlist: null,
	            initialized: false,
	            seeking: false,
	            playing: false,
	            queued: false,
	            ambient: true
	        };
	    },
	
	    getMedia:function() {
	        return this.refs.media.getDOMNode();
	    },
	
	    getPlaylist:function() {
	        return this.state.playlist;
	    },
	
	    getAmbient:function() {
	        return this.state.ambient;
	    },
	
	    componentWillMount:function() {
	        var playlist = makePlaylist(this.props.show);
	
	        this.setState({
	            playlist: playlist,
	            ambient: this.props.ambient
	        });
	    },
	
	    componentDidMount:function() {
	        this.driveIn = new DriveIn();
	        this.driveIn.init(this.getMedia());
	        this.driveIn.show(this.getPlaylist(), { ambient: this.getAmbient() });
	    },
	
	    componentWillUnmount:function() {
	        this.driveIn.close();
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

	/** @jsx React.DOM */function getMedia(el) {
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


/***/ }
/******/ ])
});

//# sourceMappingURL=react-drive-in.js.map