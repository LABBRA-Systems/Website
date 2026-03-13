// LABBRA Systems - U.S. Fatal Crashes Map
// Loads a flat Int32Array binary (lat*10000, lng*10000 pairs).
// Draws via L.GridLayer canvas tiles — zero marker objects.

var map;
var isScrollEnabled = false;
var pointCount = 0;
var lats = null;  // Float64Array
var lngs = null;  // Float64Array
var crashTileLayer = null;

var US_CENTER = [38.9434, -99.4275];
var US_ZOOM = 4;

// --- Spatial index ---
var spatialGrid = {};
var GRID_CELL = 0.25;

function buildSpatialGrid() {
    spatialGrid = {};
    for (var i = 0; i < pointCount; i++) {
        var key = Math.floor(lats[i] / GRID_CELL) + "|" + Math.floor(lngs[i] / GRID_CELL);
        if (!spatialGrid[key]) spatialGrid[key] = [];
        spatialGrid[key].push(i);
    }
}

function queryBounds(s, n, w, e) {
    var minR = Math.floor(s / GRID_CELL), maxR = Math.floor(n / GRID_CELL);
    var minC = Math.floor(w / GRID_CELL), maxC = Math.floor(e / GRID_CELL);
    var out = [];
    for (var r = minR; r <= maxR; r++) {
        for (var c = minC; c <= maxC; c++) {
            var bucket = spatialGrid[r + "|" + c];
            if (bucket) out.push(bucket);
        }
    }
    return out;
}

// --- Canvas tile layer ---
var CrashTiles = L.GridLayer.extend({
    createTile: function (coords) {
        var tile = document.createElement("canvas");
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        if (pointCount === 0) return tile;

        var zoom = coords.z;
        var pad = zoom <= 9 ? 64 : 0;
        var nw = this._map.unproject([coords.x * size.x - pad, coords.y * size.y - pad], zoom);
        var se = this._map.unproject([(coords.x + 1) * size.x + pad, (coords.y + 1) * size.y + pad], zoom);
        var tb = { north: nw.lat, south: se.lat, west: nw.lng, east: se.lng };

        var buckets = queryBounds(tb.south, tb.north, tb.west, tb.east);
        if (buckets.length === 0) return tile;

        var ctx = tile.getContext("2d");
        if (zoom <= 9) {
            this._drawClustered(ctx, buckets, coords, zoom, size, tb);
        } else {
            this._drawIndividual(ctx, buckets, coords, zoom, size);
        }
        return tile;
    },

    _toPixel: function (lat, lng, coords, zoom, size) {
        var px = this._map.project([lat, lng], zoom);
        return { x: px.x - coords.x * size.x, y: px.y - coords.y * size.y };
    },

    _drawClustered: function (ctx, buckets, coords, zoom, size, tb) {
        var binPx = zoom <= 4 ? 48 : zoom <= 5 ? 32 : zoom <= 6 ? 20 : zoom <= 7 ? 12 : zoom <= 8 ? 8 : 4;
        var bins = {};
        var tileOriginX = coords.x * size.x;
        var tileOriginY = coords.y * size.y;
        var margin = binPx;

        for (var b = 0; b < buckets.length; b++) {
            var bucket = buckets[b];
            for (var j = 0; j < bucket.length; j++) {
                var idx = bucket[j];
                var la = lats[idx], ln = lngs[idx];
                var gp = this._map.project([la, ln], zoom);
                var lx = gp.x - tileOriginX, ly = gp.y - tileOriginY;
                if (lx < -margin || ly < -margin || lx > size.x + margin || ly > size.y + margin) continue;
                // Bin in global pixel space so clusters are consistent across tiles
                var bk = Math.floor(gp.x / binPx) + "," + Math.floor(gp.y / binPx);
                if (!bins[bk]) bins[bk] = { gx: 0, gy: 0, count: 0 };
                bins[bk].gx += gp.x;
                bins[bk].gy += gp.y;
                bins[bk].count++;
            }
        }

        var keys = Object.keys(bins);

        for (var i = 0; i < keys.length; i++) {
            var c = bins[keys[i]];
            var gcx = c.gx / c.count, gcy = c.gy / c.count;
            var cx = gcx - tileOriginX, cy = gcy - tileOriginY;
            var capped = Math.min(c.count, 10000);
            var sq = Math.sqrt(capped);
            var r;
            if (zoom <= 4) {
                r = Math.max(3, Math.min(18, sq * 0.35));
            } else if (zoom <= 5) {
                r = Math.max(2.5, Math.min(14, sq * 0.35));
            } else if (zoom <= 6) {
                r = Math.max(2, Math.min(10, sq * 0.5));
            } else if (zoom <= 7) {
                r = Math.max(2, Math.min(8, sq * 0.6));
            } else {
                r = Math.max(1.5, Math.min(6, sq * 0.5));
            }

            // Only draw if the bubble center falls within this tile (avoids duplicates)
            if (cx + r < 0 || cy + r < 0 || cx - r > size.x || cy - r > size.y) continue;

            var a = Math.min(0.85, 0.25 + capped * 0.0001);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 6.2832);
            ctx.fillStyle = "rgba(220,38,38," + a + ")";
            ctx.fill();
        }

        if (zoom <= 7) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            for (var k = 0; k < keys.length; k++) {
                var cl = bins[keys[k]];
                var lgcx = cl.gx / cl.count, lgcy = cl.gy / cl.count;
                var lcx = lgcx - tileOriginX, lcy = lgcy - tileOriginY;
                // Only label if center is inside this tile
                if (lcx < 0 || lcy < 0 || lcx > size.x || lcy > size.y) continue;
                var lCapped = Math.min(cl.count, 10000);
                var lsq = Math.sqrt(lCapped);
                var lr;
                if (zoom <= 4) lr = Math.max(3, Math.min(18, lsq * 0.35));
                else if (zoom <= 5) lr = Math.max(2.5, Math.min(14, lsq * 0.35));
                else if (zoom <= 6) lr = Math.max(2, Math.min(10, lsq * 0.5));
                else lr = Math.max(2, Math.min(8, lsq * 0.6));
                if (lr < 10) continue;
                var label = lCapped >= 1000 ? (lCapped / 1000).toFixed(1) + "k" : String(lCapped);
                var fontSize = Math.max(8, Math.min(14, lr * 0.6));
                ctx.font = "bold " + Math.round(fontSize) + "px Inter,sans-serif";
                ctx.fillText(label, lcx, lcy);
            }
        }
    },

    _drawIndividual: function (ctx, buckets, coords, zoom, size) {
        var r = zoom <= 11 ? 2 : zoom <= 13 ? 3 : 4;
        ctx.fillStyle = "rgba(220,38,38,0.65)";
        ctx.beginPath();
        var count = 0;
        for (var b = 0; b < buckets.length; b++) {
            var bucket = buckets[b];
            for (var j = 0; j < bucket.length; j++) {
                var idx = bucket[j];
                var p = this._toPixel(lats[idx], lngs[idx], coords, zoom, size);
                if (p.x < -r || p.y < -r || p.x > size.x + r || p.y > size.y + r) continue;
                ctx.moveTo(p.x + r, p.y);
                ctx.arc(p.x, p.y, r, 0, 6.2832);
                count++;
            }
        }
        ctx.fill();
        if (count < 5000) {
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }
});

// --- Click handler ---
function setupClickHandler() {
    map.on("click", function (e) {
        var zoom = map.getZoom();
        var hitDeg = zoom <= 7 ? 0.2 : zoom <= 10 ? 0.05 : zoom <= 13 ? 0.01 : 0.005;
        var lat = e.latlng.lat, lng = e.latlng.lng;
        var buckets = queryBounds(lat - hitDeg, lat + hitDeg, lng - hitDeg, lng + hitDeg);

        var bestIdx = -1, bestDist = Infinity;
        for (var b = 0; b < buckets.length; b++) {
            var bucket = buckets[b];
            for (var j = 0; j < bucket.length; j++) {
                var idx = bucket[j];
                var dl = lats[idx] - lat, dn = lngs[idx] - lng;
                var dist = dl * dl + dn * dn;
                if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
            }
        }

        if (bestIdx >= 0 && bestDist < hitDeg * hitDeg) {
            var bLat = lats[bestIdx], bLng = lngs[bestIdx];
            if (zoom <= 9) {
                var area = queryBounds(bLat - 0.5, bLat + 0.5, bLng - 0.5, bLng + 0.5);
                var total = 0;
                for (var i = 0; i < area.length; i++) total += area[i].length;
                L.popup().setLatLng(e.latlng)
                    .setContent('<div style="font-size:14px;text-align:center;"><strong>' +
                        total.toLocaleString() + ' fatal crashes</strong><br>in this area (2010\u20132022)</div>')
                    .openOn(map);
            } else {
                L.popup().setLatLng([bLat, bLng])
                    .setContent('<div style="font-size:14px;"><strong>Location:</strong> ' +
                        bLat.toFixed(4) + ', ' + bLng.toFixed(4) + '</div>')
                    .openOn(map);
            }
        }
    });
}

// --- Map init ---
function initMap() {
    var initialZoom = window.innerWidth <= 768 ? 3 : US_ZOOM;

    map = L.map("map", {
        center: US_CENTER,
        zoom: initialZoom,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        zIndex: 1
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CartoDB",
        maxZoom: 18,
    }).addTo(map);

    L.control.fullscreen({
        position: 'bottomright',
        title: 'Enter fullscreen',
        titleCancel: 'Exit fullscreen',
        forceSeparateButton: true,
        fullscreenElement: document.querySelector('.map-container')
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    setupMapInteractions();
    setupClickHandler();
    loadCrashData();
    return map;
}

function setupMapInteractions() {
    var mapContainer = document.querySelector('.map-container');
    function toggleScrollZoom(enable) {
        isScrollEnabled = enable;
        if (enable) map.scrollWheelZoom.enable();
        else map.scrollWheelZoom.disable();
    }
    map.scrollWheelZoom.disable();
    map.on('fullscreenchange', function () { toggleScrollZoom(map.isFullscreen()); });
    mapContainer.addEventListener('wheel', function (e) {
        if (e.ctrlKey) { e.stopPropagation(); toggleScrollZoom(true); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Control') toggleScrollZoom(true); });
    document.addEventListener('keyup', function (e) { if (e.key === 'Control') toggleScrollZoom(false); });
    var touchStartY = 0;
    mapContainer.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    }, { passive: true });
    mapContainer.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1) {
            if (Math.abs(e.touches[0].clientY - touchStartY) > 10) map.scrollWheelZoom.disable();
        } else if (e.touches.length === 2) { e.preventDefault(); map.touchZoom.enable(); }
    }, { passive: false });
}

async function loadCrashData() {
    try {
        document.getElementById("loading").style.display = "block";

        var response = await fetch("../media/crashes.bin");
        if (!response.ok) throw new Error("HTTP error: " + response.status);
        var arrayBuffer = await response.arrayBuffer();
        var int32 = new Int32Array(arrayBuffer);

        pointCount = int32.length / 2;
        lats = new Float64Array(pointCount);
        lngs = new Float64Array(pointCount);
        for (var i = 0; i < pointCount; i++) {
            lats[i] = int32[i * 2] / 10000;
            lngs[i] = int32[i * 2 + 1] / 10000;
        }

        buildSpatialGrid();

        crashTileLayer = new CrashTiles({ tileSize: 256, updateWhenZooming: false, updateWhenIdle: true });
        crashTileLayer.addTo(map);

        document.getElementById("loading").style.display = "none";
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById("loading").innerHTML = "Error loading data. Please try again later.";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var mapInstance = initMap();
    L.control.scale({ position: "bottomleft", imperial: true, metric: false }).addTo(mapInstance);
});
