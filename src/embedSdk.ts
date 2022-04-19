// @ts-nocheck
import htmlTemplate from './htmlTemplate'
import cssTemplate from './cssTemplate'
import Constants from './constants'
import { getRootID, isNumber } from './helpers'


const EmbedSDK = {
	config: {
		isInitialized: false,
		isFrameVisible: false,
		targetID: 'epns-sdk-trigger-id',
		appName: 'appName',
		viewOptions: {
			type: 'sidebar',
			showUnreadIndicator: false,
			unreadIndicatorColor: '#cc1919',
			unreadIndicatorPosition: 'top-right',
			theme: 'light'
		},
	},
	/**
     * Call this function when your APP intializes
     */
	init(options: any) {
		if (!this.config.isInitialized) {
			this.config = options;
			this.config.isInitialized = true
			this.setUpWidget()
			this.insertCSS()
			this.handleUnreadNotifications();
			console.info('EmbedSDK: CONFIG set: ', this.config)
		}
	},
	setUpWidget() {
		const sdkRef = this;
		
		/**
		 * Add stuff needed after the page has loaded
		 */
		window.addEventListener('load', () => {
            sdkRef.setUpEventHandlers();
        });

		/**
		 * MESSAGE pub/sub
		 */
		window.addEventListener('message',
			(evt) => {
				try {
					if (typeof evt.data === 'string') {
						const publishedMessage = JSON.parse(evt.data)
						if (publishedMessage && publishedMessage.msgCode === Constants.EPNS_SDK_IFRAME_TO_PARENT_MSG) {
							/**
							* Add different cases for sub here
							*/
							console.log('Received communication from the IFRAME: ', publishedMessage)
						}
					}
				} catch (err) {
					console.error('something went wrong parsing IFRAME message to the APP.')
				}
			},
			false
		);
	},
	setUpEventHandlers() {
		const sdkRef = this;
		const triggerElement = document.querySelector(`#${sdkRef.config.targetID}`);

		if (triggerElement && triggerElement.id === sdkRef.config.targetID) {
			triggerElement.addEventListener('click', (clickEvent) => {
				clickEvent.preventDefault()
				clickEvent.stopPropagation()
				sdkRef.showEmbedView()
			})
		} else {
			console.error(`Did not find the trigger element ${sdkRef.config.targetID}`)
		}
	},
	hideEmbedView() {
		const rootID = getRootID(this.config)
		const embedViewElement = document.querySelector(`#${rootID}`)

		if (embedViewElement) {
			document.querySelector('body')?.removeChild(embedViewElement)
		}
	},
	showEmbedView() {
		const sdkRef = this
		const rootID = getRootID(sdkRef.config)
		const embedViewElement = document.createElement('div')

		// set up the Element props
		embedViewElement.id = rootID
		embedViewElement.classList.add('epns-sdk-embed-modal', 'epns-sdk-embed-modal-open')
		embedViewElement.innerHTML = htmlTemplate(sdkRef.config)

		document.querySelector('body').appendChild(embedViewElement)

		sdkRef.removeUnreadIndicatorElement();

		// When the user clicks anywhere outside of the modal, close it
		const overlayId = `#${rootID} .epns-sdk-embed-modal-overlay`;
		const overlayElement = document.querySelector(overlayId);

		overlayElement.onclick = function(event) {
			event.preventDefault();
			event.stopPropagation();
			sdkRef.hideEmbedView();
		}
	},
	insertCSS() {
		const rootID = getRootID(this.config)
		const styleTagId = `${Constants.EPNS_SDK_STYLE_TAG_ID_PREFIX}${rootID}`

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
	handleUnreadNotifications() {
		const sdkRef = this;
	
		// Unread notifications
		if (sdkRef.config.viewOptions.showUnreadIndicator) {
			sdkRef.refreshUnreadCount();
		} else {
			sdkRef.removeUnreadIndicatorElement();
		}
	},
	async refreshUnreadCount() {
		const sdkRef = this;
		const rootID = getRootID(this.config);

		let lastOpenedPayloadId = window.localStorage.getItem(
			`${Constants.EPNS_SDK_LOCAL_STORAGE_PREFIX}${rootID}_LAST_OPENED_PAYLOAD_ID`
		)

		
		let unreadNotifications = await this.getUnreadNotifications();
		let latestNotification = unreadNotifications.pop();
		console.log("latestNotification: ", latestNotification);
		let latestOpenedPayloadId = latestNotification && latestNotification.payload_id;

		console.log("lastOpenedPayloadId: ", lastOpenedPayloadId);
		console.log("latestOpenedPayloadId: ", latestOpenedPayloadId);
		let count = 0;

		if ( /** WHEN THERE IS A LAST OPENED */
			isNumber(lastOpenedPayloadId) && isNumber(latestOpenedPayloadId)
			&& latestOpenedPayloadId > lastOpenedPayloadId
		) {
			count = latestOpenedPayloadId - lastOpenedPayloadId;
			sdkRef.addUnreadIndicatorElement(count);
			console.warn("subsequent load: ");
			window.localStorage.setItem(
				`${Constants.EPNS_SDK_LOCAL_STORAGE_PREFIX}${rootID}_LAST_OPENED_PAYLOAD_ID`,
				latestOpenedPayloadId
			)
		} else if ( /** FIRST LOAD */
			!isNumber(lastOpenedPayloadId) && isNumber(latestOpenedPayloadId)
		) {
				console.warn("first load: ");
				count = latestOpenedPayloadId;
				sdkRef.addUnreadIndicatorElement(count);
				window.localStorage.setItem(
					`${Constants.EPNS_SDK_LOCAL_STORAGE_PREFIX}${rootID}_LAST_OPENED_PAYLOAD_ID`,
					latestOpenedPayloadId
				);
		} else {
			sdkRef.removeUnreadIndicatorElement();
		}
	},
	async getUnreadNotifications() {
		// call the API here
		try {
			const response = await fetch(Constants.EPNS_SDK_EMBED_API_URL);

			if (response.ok) {
				const json = await response.json();
				console.log("JSON? : ", json);
				return json.notifications || [];
			  } else {
				return [];
			  }

		} catch (error) {
			console.error(`[EPNS_SDK_EMBED] - error while calling ${Constants.EPNS_SDK_EMBED_API_URL}`);
			return [];
		}
	},
	addUnreadIndicatorElement(count) {
		this.removeUnreadIndicatorElement();
		const throbber = document.createElement('div')

		throbber.classList.add(
		  'epns-sdk-unread-indicator',
		  `epns-sdk-appname-${this.config.appName}`,
		  this.config.viewOptions.unreadIndicatorPosition
		)
		if (count !== undefined) {
		  throbber.innerText = count > 9 ? 9 : count
		}
		if (document.querySelector(`#${this.config.targetID}`)) {
		  document.querySelector(`#${this.config.targetID}`).appendChild(throbber)
		}
	},
	removeUnreadIndicatorElement() {
		if (
		  document.querySelector(`#${this.config.targetID}`) &&
		  document
			.querySelector(`#${this.config.targetID}`)
			.querySelector(
			  `.epns-sdk-unread-indicator.epns-sdk-appname-${this.config.appName}`
			)
		) {
		  document
			.querySelector(`#${this.config.targetID}`)
			.removeChild(
			  document
				.querySelector(`#${this.config.targetID}`)
				.querySelector(
				  `.epns-sdk-unread-indicator.epns-sdk-appname-${this.config.appName}`
				)
			)
		}
	},
	cleanUp() {

	}
}

export default EmbedSDK