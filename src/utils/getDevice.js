let _getDevice = () => {
  if (window.cordova) {
    _getDevice = () => "mobile";
    return "mobile";
  }
  if (
    typeof window.require == "function" &&
    typeof window.process == "object"
  ) {
    _getDevice = () => "desktop";
    return "desktop";
  }
  _getDevice = () => "browser";
  return "browser";
};

export function getDevice() {
  return _getDevice();
}
