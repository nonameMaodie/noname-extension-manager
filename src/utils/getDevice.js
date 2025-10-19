let _getDevice = function () {
	if (window.cordova) {
		_getDevice = () => 'mobile'
		return 'mobile'
	} else if (typeof window.require == "function" && typeof window.process == "object") {
		_getDevice = () => 'desktop'
		return 'desktop'
	} else {
		_getDevice = () => 'browser'
		return 'browser'
	}
}

export function getDevice() {
	return _getDevice()
}
