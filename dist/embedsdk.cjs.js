"use strict";var Constants={EMBED_APP_URL:"https://subhranshudas.github.io/embed-app",EMBED_VIEW_ROOT:"EPNS_SDK_EMBED_VIEW_ROOT",STYLE_TAG_ID_PREFIX:"STYLE_TAG_ID_",IFRAME_ID:"EPNS_SDK_EMBED_IFRAME",CSS:{ZINDEX_MAX:2147483638},IFRAME_TO_PARENT_MSG:"IFRAME_TO_PARENT_MSG"};function renderModalHeader(e){return`
        <div class="epns-sdk-embed-modal-header">
            <span class="epns-sdk-embed-modal-header-text">EPNS SDK Header</span>
            <span class="epns-sdk-embed-modal-close-btn">&times;</span>
        </div>
    `}function renderModalFooter(e){return e.showFooter?`
        <div class="epns-sdk-embed-modal-footer">
            Footer content
        </div>
    `:""}function renderModalBody(e){return`
        <div class="epns-sdk-embed-modal-body">
            <iframe id="${Constants.IFRAME_ID}" src="${Constants.EMBED_APP_URL}"></iframe>
        </div>
    `}function htmlTemplate(e){return`
        <div class="epns-sdk-embed-modal-content">
            ${renderModalHeader()}
            ${renderModalBody()}
            ${renderModalFooter(e)}
        </div>
    `}function toUpper(e=""){return e.toUpperCase()}function getRootID(e){return e.appName?Constants.EMBED_VIEW_ROOT+"_"+toUpper(e.appName):Constants.EMBED_VIEW_ROOT+"_DEFAULT_APPNAME"}function cssTemplate(e){e.theme;var t=getRootID(e);return`
        #${e.targetID}: {
            background-color: orange !important;
        }

        #${t}.epns-sdk-embed-modal {
            display: none; /* Hidden by default */
            position: absolute;
            z-index: ${Constants.CSS.ZINDEX_MAX};
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: #000000;
            opacity: 0.8;
        }

        #${t}.epns-sdk-embed-modal.epns-sdk-embed-modal-open {
            display: block;
        }

        #${t} .epns-sdk-embed-modal-content {
            background-color: #fefefe;
            padding: 5px 15px;
            border: 1px solid #888;
            border-radius: 4px;
            width: 100%;
            max-width: 450px;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content:space-between;
        }

        #${t} .epns-sdk-embed-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-basis: 40px;
        }

        #${t} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-header-text {
           font-weight: bold;
        }

        #${t} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        #${t} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn:hover,
        #${t} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        #${t} .epns-sdk-embed-modal-body {
            padding: 5px 0 10px 0;
            flex-grow: 1;
        }

        #${t} .epns-sdk-embed-modal-body iframe#${Constants.IFRAME_ID} {
          display: block;
          width: 100%;
          height: 100%;
        }

        #${t} .epns-sdk-embed-modal-footer {
            flex-basis: 20px;
        }
    `}const EmbedSDK={config:{isInitialized:!1,targetID:"epns-sdk-trigger-id",appName:"appName",viewOptions:{},theme:"light"},init(e){this.config.isInitialized||(this.config=e,this.config.isInitialized=!0,this.setUpWidget(),this.insertCSS(),console.info("EmbedSDK: CONFIG set: ",this.config))},setUpEventHandlers(){const e=document.body;e.addEventListener("click",e=>{e.target&&e.target.id===this.config.targetID&&(e.preventDefault(),e.stopPropagation(),this.showEmbedView())})},setUpWidget(){this.setUpEventHandlers()},hideEmbedView(){var e=getRootID(this.config),e=document.querySelector("#"+e);e&&document.querySelector("body")?.removeChild(e)},showEmbedView(){const t=this;var e=getRootID(this.config);const o=document.createElement("div"),d=(o.id=e,o.classList.add("epns-sdk-embed-modal"),o.classList.add("epns-sdk-embed-modal-open"),o.innerHTML=htmlTemplate(this.config),document.body.onclick=function(e){e.target==o&&t.hideEmbedView()},document.querySelector("body").appendChild(o),document.querySelector(`#${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn`));d.onclick=function(){t.hideEmbedView()},window.onmessage=function(e){try{var t=JSON.parse(e.data);t&&t.msgCode===Constants.IFRAME_TO_PARENT_MSG&&console.log("Received communication from the IFRAME: ",t)}catch(e){console.error("something went wrong parsing IFRAME message to the APP.")}}},insertCSS(){var e=getRootID(this.config),e=""+Constants.STYLE_TAG_ID_PREFIX+e;let t=document.querySelector("style#"+e);if(!t){const o=document.createElement("style");o.id=e,t=o}t.innerHTML=cssTemplate(this.config),document.querySelector("head").appendChild(t)},cleanUp(){}};module.exports=EmbedSDK;
