/**
 * StreamSimpleControls component provides a user interface for
 * managing a single stream. It includes a stream ID input and a single
 * toggle button to start and stop the stream.
 * 
 * This component is self-managing. Once provided with a WebRTCAdaptor instance,
 * it listens to the adaptor's internal events (`publish_started`, `publish_finished`, etc...)
 * to automatically update its own UI state
 */

import { ComponentCommon } from './component-common.js';

const stylePath = ComponentCommon.getComponentCssConfig('stream-controls');
const bootstrapPath = ComponentCommon.getBootstrapCss();
const commonStylePath = ComponentCommon.getCommonCss();

const template = document.createElement('template');
template.innerHTML = `
    <!-- Link to the shared Bootstrap CSS for consistent styling -->
    <link rel="stylesheet" href="${bootstrapPath}">
    <link rel="stylesheet" href="${stylePath}">
    <link rel="stylesheet" href="${commonStylePath}">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Stream Name</span>
        </div>
        <input type="text" class="form-control" id="streamName" placeholder="Enter stream name">
        <div class="input-group-append">
            <button id="toggle_button" class="btn" type="button">Start</button>
        </div>
    </div>
    <div class="custom-control custom-switch mt-2">
        <input type="checkbox" class="custom-control-input" id="reconnect_checkbox" checked>
        <label class="custom-control-label" for="reconnect_checkbox">Auto-reconnect</label>
    </div>
`;

class StreamSimpleControls extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._adaptor = null;
        this._streamType = 'publish'; // Defaults to publish
        this._state = 'idle'; // idle, pending, active
    }

    connectedCallback() {
        this.toggleButton = this.shadowRoot.getElementById('toggle_button');
        this.streamNameInput = this.shadowRoot.getElementById('streamName');
        this.reconnectCheckbox = this.shadowRoot.getElementById('reconnect_checkbox');

        this.streamNameInput.value = this.getAttribute('default-stream-id') || this._generateRandomString();

        this.toggleButton.addEventListener('click', this._onToggle.bind(this));
        this.reconnectCheckbox.addEventListener('change', this._onReconnectToggle.bind(this));

        this._updateUI();
    }

    setup(adaptor, streamType = 'publish') {
        this._adaptor = adaptor;
        this._streamType = streamType;

        // Sync initial reconnect state
        this._onReconnectToggle();

        this._adaptor.addEventListener((info, obj) => this._handleStateChange(info));
        this._adaptor.addErrorEventListener((error, message) => this._handleStateChange('error'));
    }

    isActive() {
        return this._state === 'active';
    }

    getStreamId() {
        return this.streamNameInput.value;
    }

    _onToggle() {
        console.log("Button pressed. State: " + this._state + " StreamId: " + this.streamNameInput.value);
        if (this._state === 'idle') {
            this.dispatchEvent(new CustomEvent('start-stream', {
                detail: { streamId: this.streamNameInput.value }
            }));
            this._state = 'pending';
        } else if (this._state === 'active') {
            this.dispatchEvent(new CustomEvent('stop-stream', {
                detail: { streamId: this.streamNameInput.value }
            }));
            this._state = 'pending';
        }
        this._updateUI();
    }

    _onReconnectToggle() {
        if (this._adaptor) {
            this._adaptor.reconnectIfRequiredFlag = this.reconnectCheckbox.checked;
        }
    }

    _handleStateChange(info) {
        const startEvent = this._streamType === 'publish' ? 'publish_started' : 'play_started';
        const stopEvent = this._streamType === 'publish' ? 'publish_finished' : 'play_finished';
        
        if (info === startEvent) {
            this._state = 'active';
        } else if (info === stopEvent || info === 'error') {
            // Only transition to idle if we're not in a reconnection scenario
            if (this._adaptor && this._adaptor.reconnectIfRequiredFlag) {
                this._state = 'pending';
                setTimeout(() => {
                    // Add bit of delay before allowing new interactions
                    this._state = 'idle';
                    this._updateUI();
                }, 850);
            } else {
                this._state = 'idle';
            }
        } else if (info === 'reconnection_attempt_for_publisher' || info === 'reconnection_attempt_for_player') {
            // Ensure we stay in pending state during reconnection
            this._state = 'pending';
        }
        this._updateUI();
    }
    
    _updateUI() {
        const shouldDisableInput = this.hasAttribute('disable-input');
        
        switch (this._state) {
            case 'idle':
                this.toggleButton.textContent = this.getAttribute('start-button-text') || 'Start';
                this.toggleButton.className = 'btn btn-primary';
                this.toggleButton.disabled = false;
                this.streamNameInput.disabled = shouldDisableInput;
                break;
            case 'pending':
                this.toggleButton.textContent = 'Pending...';
                this.toggleButton.disabled = true;
                this.streamNameInput.disabled = true;
                break;
            case 'active':
                this.toggleButton.textContent = this.getAttribute('stop-button-text') || 'Stop';
                this.toggleButton.className = 'btn btn-danger';
                this.toggleButton.disabled = false;
                this.streamNameInput.disabled = true;
                break;
        }
    }

    /**
     * Generates a random string for a default stream ID.
     */
    _generateRandomString(length = 9) {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'streamId_';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

window.customElements.define('stream-controls', StreamSimpleControls); 