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
	
	function videoItem(src) {
	    var video = {
	        type: null,
	        src: src
	    };
	
	    var ext = src.match(/\.([0-9a-z]+)$/)[1];
	
	    video.type = 'video/' + ext;
	
	    return video;
	}
	
	function makePlaylist(toShow) {
	    var playlist = [];
	
	    if (typeof(toShow) === 'string') {
	        playlist.push(videoItem(toShow));
	    }
	
	    return playlist;
	}
	
	module.exports = React.createClass({
	    displayName: 'DriveIn',
	
	    propTypes: {
	        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object, React.PropTypes.array]).isRequired,
	        ambient: React.PropTypes.bool
	    },
	
	    getDefaultProps:function() {
	        return {
	          className: 'drive-in'
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
	            ambient: false
	        };
	    },
	
	    getWrap:function() {
	        return this.refs.wrap.getDOMNode();
	    },
	
	    getVideo:function() {
	        return this.refs.video.getDOMNode();
	    },
	
	    componentWillMount:function() {
	        var playlist = makePlaylist(this.props.show);
	        this.setState({ playlist: playlist });
	    },
	
	    componentDidMount:function() {
	        var wrap = this.getWrap();
	        this.driveIn = new DriveIn();
	        this.driveIn.init(wrap);
	    },
	
	    componentWillUnmount:function() {
	        this.driveIn.close();
	    },
	
	    getVideoUrl:function() {
	        return this.state.playlist[0].src;
	    },
	
	    renderVideo:function() {
	        return (
	            React.DOM.div({ref: "wrap", id: "drive-in-movie"}, 
	                React.DOM.video({ref: "video", src: this.getVideoUrl(), height: "1", width: "1", preload: "auto"})
	            )
	        );
	    },
	
	    render:function() {
	        return (
	          React.DOM.div({className: this.props.className}, 
	            this.renderVideo()
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

	/** @jsx React.DOM */function getVideoEl(el) {
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


/***/ }
/******/ ])
});

//# sourceMappingURL=react-drive-in.js.map