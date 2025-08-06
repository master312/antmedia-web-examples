# Ant Media Server - WebRTC Samples

** [ W I P ] **


This project provides reusable Web Components for building WebRTC applications with Ant Media Server. Sample demonstrations using these components can be found in the `/samples/` directory.

### TODO:
- Image Sharing via Data Channel
- Better organize simples or something?
- Custom selector instead of \<select\> for dropdowns? So that it can be customised?
- URL Parameter Handling?
- Rename 'stream-simple-controls' to somehting more descriptive
- Fix 'stream-simple-state' bugs
- Fix display bugs for 'simple-stream-controlls' while reconnecting

---

## Table of Contents

- [Development Guidelines](#development-guidelines)
- [Component CSS Customization](#component-css-customization)
- [Components](#components)
  - [Core Stream Controls](#core-stream-controls)
  - [Media Input/Output](#media-inputoutput)
  - [Advanced Settings](#advanced-settings)
  - [Analytics & Monitoring](#analytics--monitoring)
  - [Content Browsing](#content-browsing)
  - [Communication](#communication)
  - [Misc](#misc)

---

## Development Guidelines

### Running
 - Make sure to have AMS running on http://localhost:5080/WebRTCAppEE

 - Just serve it using any http server. Check out a simple python webserver in ``./start_server.sh``

 - Enjoy the index.html!

### Basic Component Usage
Components can be styled by setting `AntMediaCSSConfig.js` configuration, or by overriding CSS paths directly on top of HTML file. See `samples/css-customization.html` for examples.

1. Setup custom styling based on exmaple
2. Import components as ES6 modules: `import { ComponentName } from './components/component-name.js'`
3. Most components require a WebRTC adaptor instance via `setup(adaptor)` method. See projects in `/samples/` for examples
4. Many components are self-managing and listen to adaptor events automatically (check individual component source files for specific behavior)

## Component CSS Customization

All components use CSS that can be overriden. Default CSS files are stored in `./components/styles/`. You can always override those like shown in example below. The code responsible for managing this is in `./components/component-common.js`

```html
<!-- Load config first -->
<script src="AntMediaCSSConfig.js"></script>

<!-- Override default paths, or create your own custom AntMediaCSSConfig based on exisitng exmaple-->
<script>
window.AntMediaConfig.componentStyles['stream-simple-controls'] = './my-custom.css';
</script>

<!-- Load components -->
<script type="module" src="components/stream-simple-controls.js"></script>
```

## Components

*More details about individual component, see the component source files in the `/components` directory.*

### Core Stream Controls
- `stream-simple-controls` - Stream ID input with start/stop toggle
- `stream-simple-state` - Stream status and role display  [BROKEN]
- `video-view` - Video player component

### Media Input/Output
- `input-audio-selector` - Audio device selection
- `input-video-selector` - Video device and screen sharing selection
- `toggle-camera` - Camera enable/disable button
- `toggle-microphone` - Microphone mute/unmute button
- `resolution-selector` - Stream resolution quality selection dropdown for play

### Advanced Settings
- `advanced-audio-publisher-settings` - Audio processing controls (noise suppression, gain)
- `advanced-video-publisher-settings` - Video configuration (bitrate configuration)
- `virtual-background-manager` - Background blur and custom images
- `deepar-effects-manager` - DeepAR effects selection

### Analytics & Monitoring
- `stream-play-analytics` - Real-time play statistics with charts
- `stream-publish-analytics` - Real-time publish statistics with charts
- `msg-display` - WebRTC event logging and debugging

### Content Browsing
- `broadcast-browser` - Live broadcast browsing with filters
- `vod-browser` - VOD file browsing with pagination
- `vod-uploader` - File upload with drag-and-drop

### Communication
- `data-channel-messaging` - WebRTC data channel chat
- `collaborative-canvas` - Real-time collaborative drawing

### Misc
- `component-common` - CSS configuration utilities and common stuff

---

