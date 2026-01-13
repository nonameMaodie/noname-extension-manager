import { game, lib } from "noname";

export function autoZoom(el, options) {
  const { width, height } = options;
  if (!(width || height))
    throw new Error("autoZoom: width or height is required");

  function init() {
    const zoomX = width ? window.innerWidth / width : Number.POSITIVE_INFINITY;
    const zoomY = height
      ? window.innerHeight / height
      : Number.POSITIVE_INFINITY;

    el.style.zoom = Math.min(zoomX, zoomY) / game.documentZoom;
  }
  init();

  lib.onresize.push(init);

  const release = () => {
    lib.onresize.remove(init);
  };
  return release;
}
