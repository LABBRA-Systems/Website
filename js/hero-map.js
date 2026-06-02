// Home hero — decorative Leaflet background (non-interactive)
// Change coordinates on #hero-map data-lat / data-lng / data-zoom

(function () {
  const DEFAULT_CENTER = [28.5413, -81.3786];
  const DEFAULT_ZOOM = 17;

  function parseCoord(value, fallback) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function initHeroMap() {
    const el = document.getElementById("hero-map");
    if (!el || typeof L === "undefined") return;

    const lat = parseCoord(el.dataset.lat, DEFAULT_CENTER[0]);
    const lng = parseCoord(el.dataset.lng, DEFAULT_CENTER[1]);
    const zoom = parseCoord(el.dataset.zoom, DEFAULT_ZOOM);

    const map = L.map(el, {
      center: [lat, lng],
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      touchZoom: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    map.setView([lat, lng], zoom, { animate: false });

    function refreshSize() {
      map.invalidateSize({ animate: false });
    }

    requestAnimationFrame(refreshSize);
    window.addEventListener("resize", refreshSize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshSize);
    }
  }

  document.addEventListener("DOMContentLoaded", initHeroMap);
})();
