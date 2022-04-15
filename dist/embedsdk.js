var embedsdk=function(){"use strict";var s={EMBED_APP_URL:"https://subhranshudas.github.io/embed-app",EMBED_VIEW_ROOT:"EPNS_SDK_EMBED_VIEW_ROOT",STYLE_TAG_ID_PREFIX:"STYLE_TAG_ID_",IFRAME_ID:"EPNS_SDK_EMBED_IFRAME",CSS:{ZINDEX_MAX:2147483638},IFRAME_TO_PARENT_MSG:"IFRAME_TO_PARENT_MSG"};function n(e){return`
        <div class="epns-sdk-embed-modal-content">
            
        <div class="epns-sdk-embed-modal-header">
            <span class="epns-sdk-embed-modal-header-text">EPNS SDK Header</span>
            <span class="epns-sdk-embed-modal-close-btn">&times;</span>
        </div>
    
            ${`
        <div class="epns-sdk-embed-modal-body">
            <iframe id="${s.IFRAME_ID}" src="${s.EMBED_APP_URL}"></iframe>
        </div>
    `}
            ${e=e,e.showFooter?`
        <div class="epns-sdk-embed-modal-footer">
            Footer content
        </div>
    `:""}
        </div>
    `}function i(e){return e.appName?s.EMBED_VIEW_ROOT+"_"+([e=""]=[e.appName],e.toUpperCase()):s.EMBED_VIEW_ROOT+"_DEFAULT_APPNAME"}return{config:{isInitialized:!1,targetID:"epns-sdk-trigger-id",appName:"appName",viewOptions:{},theme:"light"},init(e){this.config.isInitialized||(this.config=e,this.config.isInitialized=!0,this.setUpWidget(),this.insertCSS(),console.info("EmbedSDK: CONFIG set: ",this.config))},setUpEventHandlers(){const e=document.body;e.addEventListener("click",e=>{e.target&&e.target.id===this.config.targetID&&(e.preventDefault(),e.stopPropagation(),this.showEmbedView())})},setUpWidget(){this.setUpEventHandlers()},hideEmbedView(){var e=i(this.config),e=document.querySelector("#"+e);e&&document.querySelector("body")?.removeChild(e)},showEmbedView(){const d=this;var e=i(this.config);const o=document.createElement("div"),t=(o.id=e,o.classList.add("epns-sdk-embed-modal"),o.classList.add("epns-sdk-embed-modal-open"),o.innerHTML=n(this.config),document.body.onclick=function(e){e.target==o&&d.hideEmbedView()},document.querySelector("body").appendChild(o),document.querySelector(`#${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn`));t.onclick=function(){d.hideEmbedView()},window.onmessage=function(e){try{var d=JSON.parse(e.data);d&&d.msgCode===s.IFRAME_TO_PARENT_MSG&&console.log("Received communication from the IFRAME: ",d)}catch(e){console.error("something went wrong parsing IFRAME message to the APP.")}}},insertCSS(){var e,d=i(this.config),d=""+s.STYLE_TAG_ID_PREFIX+d;let o=document.querySelector("style#"+d);if(!o){const t=document.createElement("style");t.id=d,o=t}o.innerHTML=((d=this.config).theme,e=i(d),`
        #${d.targetID}: {
            background-color: orange !important;
        }

        #${e}.epns-sdk-embed-modal {
            display: none; /* Hidden by default */
            position: absolute;
            z-index: ${s.CSS.ZINDEX_MAX};
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: #000000;
            opacity: 0.8;
        }

        #${e}.epns-sdk-embed-modal.epns-sdk-embed-modal-open {
            display: block;
        }

        #${e} .epns-sdk-embed-modal-content {
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

        #${e} .epns-sdk-embed-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-basis: 40px;
        }

        #${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-header-text {
           font-weight: bold;
        }

        #${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        #${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn:hover,
        #${e} .epns-sdk-embed-modal-header .epns-sdk-embed-modal-close-btn:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        #${e} .epns-sdk-embed-modal-body {
            padding: 5px 0 10px 0;
            flex-grow: 1;
        }

        #${e} .epns-sdk-embed-modal-body iframe#${s.IFRAME_ID} {
          display: block;
          width: 100%;
          height: 100%;
        }

        #${e} .epns-sdk-embed-modal-footer {
            flex-basis: 20px;
        }
    `),document.querySelector("head").appendChild(o)},cleanUp(){}}}();
