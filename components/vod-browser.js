/**
 * Displays paged grid of VOD files with optional delete functionality.
 * 
 * @event vod-selected - Fired when a VOD is selected. Detail contains the VOD object.
 * @event vod-deleted - Fired when a VOD is successfully deleted. Detail contains the deleted VOD object.
 * @event error - Fired on network or server errors. Detail contains the error object.
 */

import { ComponentCommon } from './component-common.js';

const stylePath = ComponentCommon.getComponentCssConfig('vod-browser');
const bootstrapPath = ComponentCommon.getBootstrapCss();
const iconsPath = ComponentCommon.getIconsBootstrapPath();

const template = document.createElement('template');
template.innerHTML = `
    <link rel="stylesheet" href="${bootstrapPath}">
    <link rel="stylesheet" href="${stylePath}">
    <div class="vod-browser-container">
        <div id="vod-list" class="vod-list-grid"></div>
        <div id="loading-indicator" class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>
        <div class="pagination-controls">
            <button id="prev-button" class="btn btn-secondary">Previous</button>
            <span id="page-indicator">Page 0 of 0</span>
            <button id="next-button" class="btn btn-secondary">Next</button>
        </div>
    </div>
`;

class VodBrowser extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
        
        this._currentPage = 0;
        this._totalVodCount = 0;
    }

    static get observedAttributes() {
        return ['server-url', 'page-size', 'disable-delete'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.refresh();
        }
    }

    connectedCallback() {
        this.shadowRoot.getElementById('prev-button').addEventListener('click', () => this._changePage(-1));
        this.shadowRoot.getElementById('next-button').addEventListener('click', () => this._changePage(1));
        this.shadowRoot.getElementById('vod-list').addEventListener('click', (e) => this._handleVodClick(e));

        this.refresh();
    }
    
    _handleVodClick(event) {
        const deleteButton = event.target.closest('.delete-button');
        if (deleteButton) {
            event.stopPropagation(); // Prevent VOD selection when clicking delete
            const vodItem = deleteButton.closest('.vod-item');
            if (vodItem && vodItem.dataset.vod) {
                try {
                    this._handleDeleteVod(JSON.parse(vodItem.dataset.vod));
                } catch (error) {
                    this._dispatchErrorEvent(new Error('Failed to parse VOD data for deletion.'));
                }
            }
            return;
        }

        const vodItem = event.target.closest('.vod-item');
        if (vodItem && vodItem.dataset.vod) {
            console.log('vodItem', vodItem.dataset.vod);
            try {
                this.dispatchEvent(new CustomEvent('vod-selected', {
                    detail: { vod: JSON.parse(vodItem.dataset.vod) },
                    bubbles: true,
                    composed: true
                }));
            } catch (error) {
                this._dispatchErrorEvent(new Error('Failed to parse VOD data for selection.'));
            }
        }
    }

    async _handleDeleteVod(vod) {
        if (!confirm(`Are you sure you want to delete "${vod.vodName}"?`)) {
            return;
        }

        const serverUrl = this.getAttribute('server-url');

        try {
            const response = await fetch(`${serverUrl}/rest/v2/vods/${vod.vodId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.dispatchEvent(new CustomEvent('vod-deleted', {
                    detail: { vod },
                    bubbles: true,
                    composed: true
                }));
    
                await this._fetchTotalVodCount();
            } else {
                throw new Error(`Server responded with status ${response.status}`);
            }

        } catch (error) {
            console.error('Failed to delete VOD:', error);
            this._dispatchErrorEvent(error);
        }
    }

    _changePage(direction) {
        const newPage = this._currentPage + direction;
        const totalPages = Math.ceil(this._totalVodCount / this.pageSize);

        if (newPage >= 0 && newPage < totalPages) {
            this._currentPage = newPage;
            this._fetchVodList();
        }
    }

    get pageSize() {
        return parseInt(this.getAttribute('page-size'), 10) || 10;
    }

    refresh() {
        this._currentPage = 0;
        this._fetchTotalVodCount();
    }
    
    async _fetchTotalVodCount() {
        const serverUrl = this.getAttribute('server-url');
        
        if (!serverUrl) {
            this._dispatchErrorEvent(new Error("Server URL and App Name are required attributes."));
            return;
        }

        this._showLoading(true);

        try {
            const response = await fetch(`${serverUrl}/rest/v2/vods/count`);
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            
            const data = await this._toJson(response);
            this._totalVodCount = data.number;
            await this._fetchVodList();
        } catch (error) {
            this._dispatchErrorEvent(error);
            this._updatePagination();
        } finally {
            this._showLoading(false);
        }
    }

    async _fetchVodList() {
        const serverUrl = this.getAttribute('server-url');
        const offset = this._currentPage * this.pageSize;

        this._showLoading(true);

        try {
            const response = await fetch(`${serverUrl}/rest/v2/vods/list/${offset}/${this.pageSize}`);
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            
            const vods = await this._toJson(response);
            this._renderVods(vods);
        } catch (error) {
            this._dispatchErrorEvent(error);
        } finally {
            this._showLoading(false);
            this._updatePagination();
        }
    }

    _renderVods(vods) {
        const listElement = this.shadowRoot.getElementById('vod-list');
        listElement.innerHTML = '';

        if (!vods || vods.length === 0) {
            listElement.innerHTML = '<div class="no-vods-message">No VODs found.</div>';
            return;
        }

        const deleteEnabled = !this.hasAttribute('disable-delete');

        vods.forEach(vod => {
            const item = document.createElement('div');
            item.className = 'vod-item';
            item.dataset.vod = JSON.stringify(vod);

            const thumbnailUrl = vod.previewFilePath 
                ? `${this.getAttribute('server-url')}/${vod.previewFilePath}` 
                : '../img/components/video-placeholder.png';
            
            item.innerHTML = `
                <div class="vod-thumbnail">
                    <img src="${thumbnailUrl}" alt="${vod.vodName}" onerror="this.onerror=null;this.src='../img/components/video-placeholder.png';">
                </div>
                <div class="vod-info">
                    <div class="vod-name" title="${vod.vodName}">${vod.vodName}</div>
                    <div class="vod-meta">
                        <span>${new Date(vod.creationDate).toLocaleDateString()}</span>
                        <span>${ComponentCommon.formatDuration(vod.duration)}</span>
                    </div>
                </div>
                ${deleteEnabled ? `
                <button class="delete-button btn btn-danger" title="Delete VOD">
                    <img src="${iconsPath}trash.svg" alt="Delete">
                </button>
                ` : ''}
            `;
            listElement.appendChild(item);
        });
    }

    _updatePagination() {
        const pageIndicator = this.shadowRoot.getElementById('page-indicator');
        const prevButton = this.shadowRoot.getElementById('prev-button');
        const nextButton = this.shadowRoot.getElementById('next-button');
        const totalPages = Math.ceil(this._totalVodCount / this.pageSize);

        pageIndicator.textContent = `Page ${this._currentPage + 1} of ${totalPages || 1}`;
        prevButton.disabled = this._currentPage === 0;
        nextButton.disabled = this._currentPage >= totalPages - 1;
    }
    
    async _toJson(response) {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    }

    _showLoading(isLoading) {
        this.shadowRoot.getElementById('loading-indicator').style.display = isLoading ? 'flex' : 'none';
    }

    _dispatchErrorEvent(error) {
        console.error(error);
        this.dispatchEvent(new CustomEvent('error', {
            detail: { message: error.message, name: error.name, error: error },
            bubbles: true,
            composed: true
        }));
    }
}

window.customElements.define('vod-browser', VodBrowser); 