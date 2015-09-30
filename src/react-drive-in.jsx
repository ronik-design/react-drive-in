import React from "react";
import DriveIn from "drive-in";

class ReactDriveIn extends React.Component {

  constructor(props) {

    super(props);

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

  getMedia() {
    return this.refs.media.getDOMNode();
  }

  getPlaylist() {
    return this.state.playlist;
  }

  setPlaying(currentItem) {
    this.setState({ playing: true, currentItem });
    if (this.props.onPlaying) {
      this.props.onPlaying(currentItem);
    }
  }

  setPause() {
    this.setState({ playing: false });
    if (this.props.onPause) {
      this.props.onPause();
    }
  }

  setLoading() {
    this.setState({ canPlay: false });
  }

  setCanPlay() {
    this.setState({ canPlay: true });
    if (this.props.onCanPlay) {
      this.props.onCanPlay();
    }
  }

  componentWillMount() {
    this.DI = new DriveIn();
    this.DI.on("media.playing", this.setPlaying);
    this.DI.on("media.pause", this.setPause);
    this.DI.on("media.loading", this.setLoading);
    this.DI.on("media.canplay", this.setCanPlay);
  }

  componentDidMount() {

    let playlist;

    this.DI.init({
      el: this.getMedia(),
      slideshow: this.props.slideshow
    });

    const options = {
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
      this.intervalId = window.setInterval(() => {
        this.props.onTime(this.DI.currentTime());
      }, this.props.onTimeFrequency);
    }

    if (this.props.playbackRate) {
      this.playbackRate(this.props.playbackRate);
    }

    this.setState({ initalized: true, playlist });
  }

  componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.DI.removeAllListeners();
    this.DI.close();
    delete this.DI;
  }

  play(itemNum) {
    this.DI.play(itemNum);
  }

  pause() {
    this.DI.pause();
  }

  mute() {
    this.DI.setVolume(0);
    this.setState({ mute: true });
  }

  unmute() {
    this.DI.setVolume(this.props.volume);
    this.setState({ mute: false });
  }

  playbackRate(rate) {
    rate = rate || 1.0;
    this.DI.setPlaybackRate(rate);
    this.setState({ playbackRate: rate });
  }

  seekTo(time) {
    this.DI.seekTo(time);
  }

  duration() {
    return this.DI.duration();
  }

  render() {
    return (
      <div ref="wrap" className={this.props.className + " drive-in-wrap"}>
        <div ref="media" className="drive-in-media"></div>
      </div>
    );
  }
}

ReactDriveIn.displayName = "DriveIn";

ReactDriveIn.propTypes = {
  show: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array
  ]),
  showPlaylist: React.PropTypes.oneOfType([React.PropTypes.array]),
  poster: React.PropTypes.string,
  mute: React.PropTypes.bool,
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

export default ReactDriveIn;
