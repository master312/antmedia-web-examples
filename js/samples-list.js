import { createSampleHomeCard, createSampleHomeCardNoImage } from './sample-home-card.js';

const SAMPLES_DIR = 'samples/';
const DEMOS_DIR = 'demos/';
const IMG_DIR = 'img/samples/';
const ICONS_DIR = 'css/external/icons/';

const CATEGORIES = {
    BASIC: {
        id: 'basic',
        title: 'Basic Samples',
        icon: `${ICONS_DIR}joystick.svg`,
    },
    LIVE_DEMO: {
        id: 'live-demo',
        title: 'Live demos',
        icon: `${ICONS_DIR}cast.svg`,
        showInSamplesViewMenu: false,
    },
    ADVANCED: {
        id: 'advanced',
        title: 'Advanced Scenarios',
        icon: `${ICONS_DIR}gear-wide-connected.svg`,
    }
};

const TAGS = {
    WEBRTC: { title: 'WebRTC', color: '#007bff' },
    PUBLISH: { title: 'Publish', color: '#28a745' },
    PLAY: { title: 'Play', color: '#17a2b8' },
    AUDIO: { title: 'Audio', color: '#ffc107' },
    VIDEO: { title: 'Video', color: '#dc3545' },
    VIRTUAL_BACKGROUND: { title: 'Virtual Background', color: '#6f42c1' },
    DEEPAR: { title: 'DeepAR', color: '#fd7e14' },
    VOD: { title: 'VOD', color: '#6c757d' },
};

export const BACKEND_URL = new URL("http://localhost:5080/WebRTCAppEE/");

export const samples = [
    {
        name: "Conference",
        link: `https://meet.antmedia.io/Conference/`,
        category: CATEGORIES.LIVE_DEMO,
        description: "Join a multi-party conference call. (Placeholder)",
        image: `${IMG_DIR}conference.png`,
        onHoverMedia: `${IMG_DIR}/conference_hover.mp4`,
        tags: [TAGS.PUBLISH, TAGS.PLAY, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCard,
    },
    {
        name: "Webinar",
        link: `${SAMPLES_DIR}webinar.html`,
        useSampleViewer: true,
        category: CATEGORIES.LIVE_DEMO,
        description: "Publish and watch in a webinar setting. (Placeholder)",
        image: `${IMG_DIR}webinar.png`,
        // onHoverMedia: 'img/samples/webinar_hover.mp4',
        tags: [TAGS.PUBLISH, TAGS.PLAY, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCard,
    },
    {
        name: "Broadcast Live",
        link: `${DEMOS_DIR}publish-demo.html`,
        category: CATEGORIES.LIVE_DEMO,
        description: "Publish and watch in a webinar setting. (Placeholder)",
        image: `${IMG_DIR}publish-demo.png`,
        onHoverMedia: `${IMG_DIR}publish-demo.mp4`,
        tags: [TAGS.PUBLISH, TAGS.PLAY, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCard,
    },
    {
        name: "Play WebRTC",
        link: `${SAMPLES_DIR}play-webrtc.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Play any stream (from RTMP, WebRTC, IP cameras, etc.) with WebRTC.",
        image: `${IMG_DIR}play_webrtc.png`,
        tags: [TAGS.PLAY, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCard,
    },
    {
        name: "Publish WebRTC",
        link: `${SAMPLES_DIR}publish-webrtc.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Publish your camera and microphone to the server with WebRTC.",
        image: `${IMG_DIR}publish-webrtc.png`,
        tags: [TAGS.PUBLISH, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCard,
    },
    {
        name: "Publish and Play",
        link: `${SAMPLES_DIR}play-publish.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Publish your camera and microphone, and play the stream in the same tab.",
        image: ``,
        tags: [],
        homeCardFactory: createSampleHomeCardNoImage,
    },
    // {
    //     name: "Publish Audio",
    //     link: `${SAMPLES_DIR}publish_audio.html`,
    //     useSampleViewer: true,
    //     category: CATEGORIES.BASIC,
    //     description: "Publish an audio-only stream from your microphone.",
    //     image: `${IMG_DIR}publish_audio.png`,
    //     tags: [TAGS.PUBLISH, TAGS.AUDIO],
    //     homeCardFactory: createSampleHomeCard,
    // },
    // {
    //     name: "Play Audio",
    //     link: `${SAMPLES_DIR}play_audio.html`,
    //     useSampleViewer: true,
    //     category: CATEGORIES.BASIC,
    //     description: "Play an audio-only WebRTC stream.",
    //     image: `${IMG_DIR}play_audio.png`,
    //     tags: [TAGS.PLAY, TAGS.AUDIO],
    //     homeCardFactory: createSampleHomeCard,
    // },
    {
        name: "VOD Exmaple",
        link: `${SAMPLES_DIR}vod.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Upload, browse and play VODs.",
        image: `${IMG_DIR}publish_webrtc.webp`,
        tags: [TAGS.VOD],
        homeCardFactory: createSampleHomeCardNoImage,
    },
    {
        name: "Broadcast Browser",
        link: `${SAMPLES_DIR}broadcast-browser.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Browse and play broadcasts.",
        image: `${IMG_DIR}publish_webrtc.webp`,
        tags: [TAGS.PLAY, TAGS.VIDEO, TAGS.AUDIO],
        homeCardFactory: createSampleHomeCardNoImage,
    },
    {
        name: 'Collaborative Drawing - Publish',
        link: 'samples/canvas-publish.html',
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: 'A sample that demonstrates real-time collaborative drawing on top of a video stream.',
        image: `${IMG_DIR}play_audio.png`,
        tags: [],
        homeCardFactory: createSampleHomeCardNoImage,
    },
    {
        name: 'Collaborative Drawing - Play',
        link: 'samples/canvas-play.html',
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: 'A sample that demonstrates real-time collaborative drawing on top of a video stream.',
        image: `${IMG_DIR}play_audio.png`,
        tags: [],
        homeCardFactory: createSampleHomeCardNoImage,
    },
    {
        name: "Custom component CSS",
        link: `${SAMPLES_DIR}css-customization.html`,
        useSampleViewer: true,
        category: CATEGORIES.BASIC,
        description: "Examle of customized look and feel of components",
        image: `${IMG_DIR}play_audio.png`,
        tags: [],
        homeCardFactory: createSampleHomeCardNoImage,
    },
]; 