// @ts-nocheck
import Constants from './constants'

function renderModalHeader(config) {
	return `
        <div class="epns-sdk-embed-modal-header">
            <span class="epns-sdk-embed-modal-header-text">EPNS SDK Header</span>
            <span class="epns-sdk-embed-modal-close-btn">&times;</span>
        </div>
    `
}

function renderModalFooter(config) {
	if (!config.showFooter) return ''

	return `
        <div class="epns-sdk-embed-modal-footer">
            Footer content
        </div>
    `
}

function renderModalBody(config) {
	return `
        <div class="epns-sdk-embed-modal-body">
            <iframe id="${Constants.IFRAME_ID}" src="${Constants.EMBED_APP_URL}"></iframe>
        </div>
    `
}

export default function (config) {
	return `
        <div class="epns-sdk-embed-modal-content">
            ${renderModalHeader(config)}
            ${renderModalBody(config)}
            ${renderModalFooter(config)}
        </div>
    `
}