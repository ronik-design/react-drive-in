'use strict';

var React = require('react');
React = 'default' in React ? React['default'] : React;
var DriveIn = require('drive-in');
DriveIn = 'default' in DriveIn ? DriveIn['default'] : DriveIn;

var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers;
var ReactDriveIn = (function (_React$Component) {
  babelHelpers.inherits(ReactDriveIn, _React$Component);

  function ReactDriveIn(props) {
    babelHelpers.classCallCheck(this, ReactDriveIn);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ReactDriveIn).call(this, props));

    _this.state = {
      className: props.className,
      mute: props.mute,
      loop: props.loop,
      playing: !props.paused,
      loopPaylistItems: props.loopPlaylistItems,
      slideshow: props.slideshow,
      volume: props.volume,
      onTimeFrequency: props.onTimeFrequency
    };

    _this.setPlaying = _this.setPlaying.bind(_this);
    _this.setPause = _this.setPause.bind(_this);
    _this.setLoading = _this.setLoading.bind(_this);
    _this.setCanPlay = _this.setCanPlay.bind(_this);
    return _this;
  }

  babelHelpers.createClass(ReactDriveIn, [{
    key: "getMedia",
    value: function getMedia() {
      return this.refs.media;
    }
  }, {
    key: "getPlaylist",
    value: function getPlaylist() {
      return this.state.playlist;
    }
  }, {
    key: "setPlaying",
    value: function setPlaying(currentItem) {
      this.setState({ playing: true, currentItem: currentItem });
      if (this.props.onPlaying) {
        this.props.onPlaying(currentItem);
      }
    }
  }, {
    key: "setPause",
    value: function setPause() {
      this.setState({ playing: false });
      if (this.props.onPause) {
        this.props.onPause();
      }
    }
  }, {
    key: "setLoading",
    value: function setLoading() {
      this.setState({ canPlay: false });
    }
  }, {
    key: "setCanPlay",
    value: function setCanPlay() {
      this.setState({ canPlay: true });
      if (this.props.onCanPlay) {
        this.props.onCanPlay();
      }
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.DI = new DriveIn();
      this.DI.on("media.playing", this.setPlaying);
      this.DI.on("media.pause", this.setPause);
      this.DI.on("media.loading", this.setLoading);
      this.DI.on("media.canplay", this.setCanPlay);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var playlist = undefined;

      this.DI.init({
        el: this.getMedia(),
        slideshow: this.props.slideshow,
        startPaused: this.props.paused
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
          _this2.props.onTime(_this2.DI.currentTime());
        }, this.props.onTimeFrequency);
      }

      if (this.props.playbackRate) {
        this.playbackRate(this.props.playbackRate);
      }

      this.setState({ initalized: true, playlist: playlist });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
      }

      this.DI.removeAllListeners();
      this.DI.close();
      delete this.DI;
    }
  }, {
    key: "play",
    value: function play(itemNum) {
      this.DI.play(itemNum);
    }
  }, {
    key: "pause",
    value: function pause() {
      this.DI.pause();
    }
  }, {
    key: "mute",
    value: function mute() {
      this.DI.setVolume(0);
      this.setState({ mute: true });
    }
  }, {
    key: "unmute",
    value: function unmute() {
      this.DI.setVolume(this.props.volume);
      this.setState({ mute: false });
    }
  }, {
    key: "playbackRate",
    value: function playbackRate(rate) {
      rate = rate || 1.0;
      this.DI.setPlaybackRate(rate);
      this.setState({ playbackRate: rate });
    }
  }, {
    key: "seekTo",
    value: function seekTo(time) {
      this.DI.seekTo(time);
    }
  }, {
    key: "duration",
    value: function duration() {
      return this.DI.duration();
    }
  }, {
    key: "render",
    value: function render() {
      var classes = this.props.className + " drive-in-wrap";
      return React.createElement(
        "div",
        { ref: "wrap", className: classes },
        React.createElement("div", { ref: "media", className: "drive-in-media" })
      );
    }
  }]);
  return ReactDriveIn;
})(React.Component);

ReactDriveIn.displayName = "DriveIn";

ReactDriveIn.propTypes = {
  show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
  showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
  poster: React.PropTypes.string,
  mute: React.PropTypes.bool,
  paused: React.PropTypes.bool,
  loop: React.PropTypes.bool,
  loopPlaylistItems: React.PropTypes.bool,
  playbackRate: React.PropTypes.number,
  slideshow: React.PropTypes.bool,
  onPlaying: React.PropTypes.func,
  onPause: React.PropTypes.func,
  onTime: React.PropTypes.func,
  onTimeFrequency: React.PropTypes.number,
  onCanPlay: React.PropTypes.func,
  isTouch: React.PropTypes.func,
  volume: React.PropTypes.number,
  className: React.PropTypes.string
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

module.exports = ReactDriveIn;