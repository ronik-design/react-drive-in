# React Drive-In

![Git release](http://img.shields.io/github/release/ronik-design/react-drive-in.svg?style=flat)

A wicked awesome replacement for BigVideo.js that is lighter with fewer dependencies. It _does not_ use jQuery, video.js, or any other large libraries. Only X.Xk minified and gzipped.

## Install

So easy. React is the only dependency:
[React](http://facebook.github.io/react/downloads.html).

- Using NPM
```bash
  $ npm install --save ronik-design/react-drive-in
```

- [Download the latest release](https://github.com/ronik-design/react-drive-in/archive/v1.0.0.zip)

## Usage

- The easiest example
```javascript
  var DriveIn = require('react-drive-in');
  
  React.render(
    <DriveIn 
      show="http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.mp4"
      poster="http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.jpg"
    />,
    $mountNode
  );
```

- More complex
```javascript
  var DriveIn = require('react-drive-in');

  var playlist = [
    [
      'http://dfcb.github.io/BigVideo.js/vids/river.mp4',
      'http://dfcb.github.io/BigVideo.js/vids/river.ogv',
      'https://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/river.jpg'
    ],
    [
      'http://dfcb.github.io/BigVideo.js/vids/dock.mp4',
      'http://dfcb.github.io/BigVideo.js/vids/dock.ogv',
      'http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/dock.jpg'
    ],
    [
      'http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.mp4',
      'http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.ogv',
      'http://raw.githubusercontent.com/ronik-design/react-drive-in/master/example/glacier.jpg'
    ]
  ];
  
  var onPlaying = function(itemNum) {};
  var onPause = function() {};
      
  React.render(
    <DriveIn 
      showPlaylist={playlist}
      onPlaying={onPlaying}
      onPause={onPause}
      loop={true}
      slideshow={false}
      mure={true}
    />,
    $mountNode
  );
```

## What to `show`

The show and showPlaylist properties have many options. See [example/index.html](example/index.html) for an fairly complex set up.

- `show` is for SINGLE ITEMS. You can provide either a string, or a fallback array (e.g., [ 'video.mp4', 'video.ogv', 'video.jpg' ]). 
- `showPlaylist` is for MULTIPLE ITEMS. You can provide either an array or strings (e.g., [ 'video1.mp4', 'video2.mp4' ]) or an array of fallback arrays (e.g., [ [ 'video1.mp4', 'video1.ogv' ], [ 'video2.mp4', 'video2.ogv' ])

## Details

The HTML structure of this element looks like:

```html
  <div id="drive-in-wrap">
    <div class="drive-in-media">
      <video> OR <img>
    </div>
  </div>
```

The included CSS sets up some required styles for it to function correctly.

The component falls back to using an image on touch devices, since many will not play video inline. Thus, you might want to specify fallback images either through the `poster` property or in the fallback arrays.

## Formats

The component currently understands and supports, `mp4`, `ogv`, `webm`, `jpg`, `gif`, `png`.

## Component API

`<Video>` component:

Property | Type | Default | Required | Description
-------- | ---- | ------- | -------- |-----------
show | `String`,`Array` | none | no | The video or video fallback array to show.
showPlaylist | `Array` | none | no | An array of video URL strings, or of video fallback arrays.
poster | `String` | none | no | A fallback image to use, when all else fails.
mute | `Boolean` | true | no | Should the videos be played muted?
loop | `Boolean` | true | no | Should videos / playlists loop or begin again when finished?
slideshow | `Boolean` | false | no | Force the component to display fallback images / poster rather than videos.
onPlaying | `Function` | null | no | Register a callback for when the video / slideshow starts playing.
onPause | `Function` | null | no | Register a callback for when the video / slideshow is paused.

## Developing

You can clone this repo and then:

```bash
npm install && gulp
```

This will install all dev dependencies and launch browser sync in Chrome.

## License

See the [License](LICENSE) file.

## Credit

- The repo contains a clip from [this video](https://www.youtube.com/watch?v=U7IC-L2fq2o) by YouTube user [lundbekegholm](https://www.youtube.com/channel/UCMx-iVKPpKiRPQfc39nXvXw?spfreload=10)
- [BigVideo.js](http://dfcb.github.io/BigVideo.jj/) was the inspiration, and the source of some hotlinked video clips.
- [react-video](https://github.com/pedronauck/react-video) provided a great project scaffold for a React component.

