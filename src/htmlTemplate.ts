// @ts-nocheck
import Constants from "./constants";

function renderModalHeader(config) {
    return `
        <div class="modal-header">
            <span class="header-text">EPNS SDK Header</span>
            <span class="modal-close-btn">&times;</span>
        </div>
    `;
};

function renderModalFooter(config) {
    if (!config.showFooter) return '';

    return `
        <div class="modal-footer">
            Footer content
        </div>
    `;
}

function renderModalBody(config) {
    return `
        <div class="modal-body">
            <iframe id="${Constants.IFRAME_ID}" src="${Constants.EMBED_APP_URL}"></iframe>
        </div>
    `;
}

export default function (config) {
    return `
        <div class="modal-content">
            ${renderModalHeader(config)}
            ${renderModalBody(config)}
            ${renderModalFooter(config)}
        </div>
    `;
};