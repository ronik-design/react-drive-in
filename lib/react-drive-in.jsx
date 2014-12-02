var React = require('react');

var DriveIn = require('./drive-in');

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

    getDefaultProps() {
        return {
          className: 'drive-in'
        };
    },

    getInitialState() {
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

    getWrap() {
        return this.refs.wrap.getDOMNode();
    },

    getVideo() {
        return this.refs.video.getDOMNode();
    },

    componentWillMount() {
        var playlist = makePlaylist(this.props.show);
        this.setState({ playlist: playlist });
    },

    componentDidMount() {
        var wrap = this.getWrap();
        this.driveIn = new DriveIn();
        this.driveIn.init(wrap);
    },

    componentWillUnmount() {
        this.driveIn.close();
    },

    getVideoUrl() {
        return this.state.playlist[0].src;
    },

    renderVideo() {
        return (
            <div ref="wrap" id="drive-in-movie">
                <video ref="video" src={this.getVideoUrl()} height="1" width="1" preload="auto"></video>
            </div>
        );
    },

    render() {
        return (
          <div className={this.props.className} >
            {this.renderVideo()}
          </div>
        );
    }
});
