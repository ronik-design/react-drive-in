"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

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