var React = require('react');

var DriveIn = require('./drive-in');

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

    getDefaultProps() {
        return {
            className: 'drive-in',
            ambient: true
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
            ambient: true
        };
    },

    getMedia() {
        return this.refs.media.getDOMNode();
    },

    getPlaylist() {
        return this.state.playlist;
    },

    getAmbient() {
        return this.state.ambient;
    },

    componentWillMount() {
        var playlist = makePlaylist(this.props.show);

        this.setState({
            playlist: playlist,
            ambient: this.props.ambient
        });
    },

    componentDidMount() {
        this.driveIn = new DriveIn();
        this.driveIn.init(this.getMedia());
        this.driveIn.show(this.getPlaylist(), { ambient: this.getAmbient() });
    },

    componentWillUnmount() {
        this.driveIn.close();
    },

    renderMedia() {
        var content;

        if ('ontouchstart' in window) {
            content = <img />;
        } else {
            content = <video height="1" width="1" preload="auto" autoplay></video>;
        }

        return (
            <div ref="media" id="drive-in-media">
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
