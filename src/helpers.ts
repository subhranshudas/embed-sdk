// @ts-nocheck
import Constants from './constants'

function toUpper(str = '') {
	return str.toUpperCase()
}

export function getRootID(config) {
	if (config.appName) {
		return `${Constants.EPNS_SDK_EMBED_VIEW_ROOT}_${toUpper(config.appName)}`
	}

	return `${Constants.EPNS_SDK_EMBED_VIEW_ROOT}_DEFAULT_APPNAME`
}

export function isNumber(num) {
	return Number.isInteger(parseInt(num))
}