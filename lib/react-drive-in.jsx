var React = require('react'),
    DriveIn = require('drive-in');

module.exports = React.createClass({
    displayName: 'DriveIn',

    propTypes: {
        show: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
        poster: React.PropTypes.string,
        duration: React.PropTypes.number,
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

    getDefaultProps() {
        return {
            className: 'drive-in',
            duration: 'auto',
            mute: true,
            loop: true,
            loopPaylistItems: false,
            slideshow: false,
            volume: 0.5,
            onTimeFrequency: 500
        };
    },

    getInitialState() {
        return {
            playlist: null,
            initialized: false,
            playing: false,
            mute: true,
            currentItem: 0,
            playbackRate: 1.0
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

    setLoading() {
        this.setState({ canPlay: false });
    },

    setCanPlay() {
        this.setState({ canPlay: true });
        if (this.props.onCanPlay) {
            this.props.onCanPlay();
        }
    },

    componentWillMount() {
        this.DI = new DriveIn();
    },

    componentDidMount() {
        var DI = this.DI,
            options,
            playlist;

        DI.init({ el: this.getMedia(), slideshow: this.props.slideshow });

        options = {
            mute: this.props.mute,
            duration: this.props.duration,
            loop: this.props.loop,
            loopPlaylistItems: this.props.loopPlaylistItems,
            poster: this.props.poster
        };

        if (this.props.showPlaylist) {
            playlist = DI.showPlaylist(this.props.showPlaylist, options);
        } else {
            playlist = DI.show(this.props.show, options);
        }

        DI.on('media.playing', (currentItem) => { this.setPlaying(currentItem); });
        DI.on('media.pause', () => { this.setPause(); });
        DI.on('media.loading', () => { this.setLoading(); });
        DI.on('media.canplay', () => { this.setCanPlay(); });

        if (this.props.onTime) {
            this.intervalId = window.setInterval(() => {
                var currTime = DI.currentTime();
                this.props.onTime(currTime);
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
    },

    componentWillUnmount() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
        }

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
        this.setState({ mute: true });
    },

    unmute() {
        this.DI.setVolume(this.props.volume);
        this.setState({ mute: false });
    },

    playbackRate(rate) {
        rate = rate || 1.0;
        this.DI.setPlaybackRate(rate);
        this.setState({ playbackRate: rate });
    },

    seekTo(time) {
        this.DI.seekTo(time);
    },

    duration() {
        return this.DI.duration();
    },

    render() {
        return (
          <div ref="wrap" id="drive-in-wrap" className={this.props.className}>
            <div ref="media" className="drive-in-media"></div>
          </div>
        );
    }
});
