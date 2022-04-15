// @ts-nocheck
import { getRootID } from "./helpers";
import Contstants from "./constants";

export default function (config) {
    const isDarkTheme = config.theme === "dark";
    const rootID = getRootID(config);

    return `
        #${config.targetID}: {
            background-color: orange !important;
        }

        #${rootID}.modal {
            display: none; /* Hidden by default */
            position: absolute;
            z-index: ${Contstants.CSS.ZINDEX_MAX};
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: #000000;
            opacity: 0.8;
        }

        #${rootID}.modal.modal-open {
            display: block;
        }

        #${rootID} .modal-content {
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

        #${rootID} .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-basis: 40px;
        }

        #${rootID} .modal-header .header-text {
           font-weight: bold;
        }

        #${rootID} .modal-header .modal-close-btn {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        #${rootID} .modal-header .modal-close-btn:hover,
        #${rootID} .modal-header .modal-close-btn:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
        }

        #${rootID} .modal-body {
            padding: 5px 0 10px 0;
            flex-grow: 1;
        }

        #${rootID} .modal-body iframe#${Contstants.IFRAME_ID} {
          display: block;
          width: 100%;
          height: 100%;
        }

        #${rootID} .modal-footer {
            flex-basis: 20px;
        }
    `;
};