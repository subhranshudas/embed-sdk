// @ts-nocheck
import htmlTemplate from './htmlTemplate'
import cssTemplate from './cssTemplate'
import Constants from './constants'
import { getRootID } from './helpers'


const EmbedSDK = {
	config: {
		isInitialized: false,
		targetID: 'epns-sdk-trigger-id',
		appName: 'appName',
		viewOptions: {},
		theme: 'light'
	},
	/**
     * Call this function when your APP intializes
     * 1. inject SDK-EMBED <style> into the <HEAD>
     */
	init(options: any) {
		if (!this.config.isInitialized) {
			this.config = options
			this.config.isInitialized = true
			this.setUpWidget()
			this.insertCSS()
			console.info('EmbedSDK: CONFIG set: ', this.config)
		}
	},
	setUpEventHandlers() {
		const rootElement = document.body

		rootElement.addEventListener('click', (clickEvent) => {
			if (clickEvent.target && clickEvent.target.id === this.config.targetID) {
				clickEvent.preventDefault()
				clickEvent.stopPropagation()
				this.showEmbedView()
			}
		})
	},
	setUpWidget() {
		this.setUpEventHandlers()
	},
	hideEmbedView() {
		const rootId = getRootID(this.config)
		const embedViewElement = document.querySelector(`#${rootId}`)

		if (embedViewElement) {
			document.querySelector('body')?.removeChild(embedViewElement)
		}
	},
	showEmbedView() {
		const sdkRef = this
		const rootId = getRootID(this.config)
		const embedViewElement = document.createElement('div')

		// set up the Element props
		embedViewElement.id = rootId
		embedViewElement.classList.add('epns-sdk-embed-modal')
		embedViewElement.classList.add('epns-sdk-embed-modal-open')
		embedViewElement.innerHTML = htmlTemplate(this.config)


		// When the user clicks anywhere outside of the modal, close it
		document.body.onclick = function(event) {
			if (event.target == embedViewElement) {
				sdkRef.hideEmbedView()
			}
		}

		document.querySelector('body').appendChild(embedViewElement)

		// Get the close button element that closes the modal
		const modalCloseBtn = document.querySelector(`#${rootId} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn`)

		// When the user clicks on <span> (x), close the modal
		modalCloseBtn.onclick = function() {
			sdkRef.hideEmbedView()
		}

		/**
         * if the close button or any other message is passed.
        */
		window.onmessage = function(evt) {
			try {
				const publishedMessage = JSON.parse(evt.data)

				if (publishedMessage && publishedMessage.msgCode === Constants.IFRAME_TO_PARENT_MSG) {
					console.log('Received communication from the IFRAME: ', publishedMessage)
				}
			} catch (err) {
				console.error('something went wrong parsing IFRAME message to the APP.')
			}
		}
	},
	insertCSS() {
		const rootId = getRootID(this.config)
		const styleTagId = `${Constants.STYLE_TAG_ID_PREFIX}${rootId}`

		let CSSElement = document.querySelector(
			`style#${styleTagId}`
		)
		if (!CSSElement) {
			const styleEl = document.createElement('style')
			styleEl.id = `${styleTagId}`
			CSSElement = styleEl
		}

		CSSElement.innerHTML = cssTemplate(this.config)
        
		document.querySelector('head').appendChild(CSSElement)
	},
	cleanUp() {

	}
}

export default EmbedSDK