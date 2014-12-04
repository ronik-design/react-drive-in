var React = require('react');
var DriveIn = require('./drive-in');

module.exports = React.createClass({
    displayName: 'DriveIn',

    propTypes: {
        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
        poster: React.PropTypes.string,
        duration: React.PropTypes.number,
        mute: React.PropTypes.bool,
        loop: React.PropTypes.bool,
        slideshow: React.PropTypes.bool,
        onPlaying: React.PropTypes.func,
        onPause: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            className: 'drive-in',
            duration: 'auto',
            mute: true,
            loop: true,
            slideshow: false,
            volume: 0.5
        };
    },

    getInitialState() {
        return {
            playlist: null,
            initialized: false,
            playing: false,
            mute: true,
            currentItem: 0
        };
    },

    getMedia() {
        return this.refs.media.getDOMNode();
    },

    getPlaylist() {
        return this.state.playlist;
    },

    setPlaying(currentItem) {
        this.setState({
            playing: true,
            currentItem: currentItem
        });

        if (this.props.onPlaying) {
            this.props.onPlaying(currentItem);
        }
    },

    setPause() {
        this.setState({ playing: false });
        if (this.props.onPause) {
            this.props.onPause();
        }
    },

    componentWillMount() {
        this.DI = new DriveIn();
    },

    componentDidMount() {
        var DI = this.DI,
            options,
            playlist;

        DI.init({ el: this.getMedia() });

        options = {
            mute: this.props.mute,
            duration: this.props.duration,
            loop: this.props.loop,
            poster: this.props.poster
        };

        if (this.props.showPlaylist) {
            playlist = DI.showPlaylist(this.props.showPlaylist, options);
        } else {
            playlist = DI.show(this.props.show, options);
        }

        DI.on('media.playing', (currentItem) => { this.setPlaying(currentItem); });
        DI.on('media.pause', (currentItem) => { this.setPause(); });

        this.setState({
            mute: this.props.mute,
            playlist: playlist,
            initalized: true
        });
    },

    componentWillUnmount() {
        this.DI.removeAllListeners();
        this.DI.close();
        delete(this.DI);
    },

    play(itemNum) {
        this.DI.play(itemNum);
    },

    pause() {
        this.DI.pause();
    },

    mute() {
        this.DI.setVolume(0);
        this.state.mute = true;
    },

    unmute() {
        this.DI.setVolume(this.props.volume);
        this.state.mute = false;
    },

    renderMedia() {
        var content;

        if ('ontouchstart' in window || this.props.slideshow) {
            content = <img />;
        } else {
            content = <video height="1" width="1" preload="auto" autoplay></video>;
        }

        return (
            <div ref="media" className="drive-in-media">
                {content}
            </div>
        );
    },

    render() {
        return (
          <div ref="wrap" id="drive-in-wrap" className={this.props.className}>
            {this.renderMedia()}
          </div>
        );
    }
});
