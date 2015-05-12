'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _driveIn = require('drive-in');

var _driveIn2 = _interopRequireDefault(_driveIn);

var ReactDriveIn = (function (_React$Component) {
    function ReactDriveIn(props) {
        _classCallCheck(this, ReactDriveIn);

        _get(Object.getPrototypeOf(ReactDriveIn.prototype), 'constructor', this).call(this, props);
        var foo = 'bar';
        this.state = {
            className: 'drive-in',
            mute: true,
            loop: true,
            loopPaylistItems: false,
            slideshow: false,
            volume: 0.5,
            onTimeFrequency: 500
        };
    }

    _inherits(ReactDriveIn, _React$Component);

    _createClass(ReactDriveIn, [{
        key: 'getMedia',
        value: function getMedia() {
            return this.refs.media.getDOMNode();
        }
    }, {
        key: 'getPlaylist',
        value: function getPlaylist() {
            return this.state.playlist;
        }
    }, {
        key: 'setPlaying',
        value: function setPlaying(currentItem) {
            this.setState({
                playing: true,
                currentItem: currentItem
            });

            if (this.props.onPlaying) {
                this.props.onPlaying(currentItem);
            }
        }
    }, {
        key: 'setPause',
        value: function setPause() {
            this.setState({ playing: false });
            if (this.props.onPause) {
                this.props.onPause();
            }
        }
    }, {
        key: 'setLoading',
        value: function setLoading() {
            this.setState({ canPlay: false });
        }
    }, {
        key: 'setCanPlay',
        value: function setCanPlay() {
            this.setState({ canPlay: true });
            if (this.props.onCanPlay) {
                this.props.onCanPlay();
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.DI = new _driveIn2['default']();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var DI = this.DI,
                options,
                playlist;

            DI.init({ el: this.getMedia(), slideshow: this.props.slideshow });

            options = {
                mute: this.props.mute,
                loop: this.props.loop,
                loopPlaylistItems: this.props.loopPlaylistItems,
                poster: this.props.poster,
                isTouch: this.props.isTouch
            };

            if (this.props.showPlaylist) {
                playlist = DI.showPlaylist(this.props.showPlaylist, options);
            } else {
                playlist = DI.show(this.props.show, options);
            }

            DI.on('media.playing', function (currentItem) {
                _this2.setPlaying(currentItem);
            });
            DI.on('media.pause', function () {
                _this2.setPause();
            });
            DI.on('media.loading', function () {
                _this2.setLoading();
            });
            DI.on('media.canplay', function () {
                _this2.setCanPlay();
            });

            if (this.props.onTime) {
                this.intervalId = window.setInterval(function () {
                    var currTime = DI.currentTime();
                    _this2.props.onTime(currTime);
                }, this.props.onTimeFrequency);
            }

            if (this.props.playbackRate) {
                this.playbackRate(this.props.playbackRate);
            }

            this.setState({
                mute: this.props.mute,
                playlist: playlist,
                initalized: true
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.intervalId) {
                window.clearInterval(this.intervalId);
            }

            this.DI.removeAllListeners();
            this.DI.close();
            delete this.DI;
        }
    }, {
        key: 'play',
        value: function play(itemNum) {
            this.DI.play(itemNum);
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.DI.pause();
        }
    }, {
        key: 'mute',
        value: function mute() {
            this.DI.setVolume(0);
            this.setState({ mute: true });
        }
    }, {
        key: 'unmute',
        value: function unmute() {
            this.DI.setVolume(this.props.volume);
            this.setState({ mute: false });
        }
    }, {
        key: 'playbackRate',
        value: function playbackRate(rate) {
            rate = rate || 1;
            this.DI.setPlaybackRate(rate);
            this.setState({ playbackRate: rate });
        }
    }, {
        key: 'seekTo',
        value: function seekTo(time) {
            this.DI.seekTo(time);
        }
    }, {
        key: 'duration',
        value: function duration() {
            return this.DI.duration();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { ref: 'wrap', id: 'drive-in-wrap', className: this.props.className },
                _react2['default'].createElement('div', { ref: 'media', className: 'drive-in-media' })
            );
        }
    }]);

    return ReactDriveIn;
})(_react2['default'].Component);

ReactDriveIn.displayName = 'DriveIn';

ReactDriveIn.propTypes = {
    show: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.array]),
    showPlaylist: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.array]),
    poster: _react2['default'].PropTypes.string,
    mute: _react2['default'].PropTypes.bool,
    loop: _react2['default'].PropTypes.bool,
    loopPlaylistItems: _react2['default'].PropTypes.bool,
    playbackRate: _react2['default'].PropTypes.number,
    slideshow: _react2['default'].PropTypes.bool,
    onPlaying: _react2['default'].PropTypes.func,
    onPause: _react2['default'].PropTypes.func,
    onTime: _react2['default'].PropTypes.func,
    onTimeFrequency: _react2['default'].PropTypes.number,
    onCanPlay: _react2['default'].PropTypes.func,
    isTouch: _react2['default'].PropTypes.func
};

ReactDriveIn.defaultProps = {
    className: 'drive-in',
    mute: true,
    loop: true,
    loopPaylistItems: false,
    slideshow: false,
    volume: 0.5,
    onTimeFrequency: 500
};

exports['default'] = ReactDriveIn;
module.exports = exports['default'];