// Florida Pedestrian Deaths Map functionality
let map;
let isScrollEnabled = false;

// Initialize map centered over Research Parkway address
function initMap() {
    const initialZoom = window.innerWidth <= 768 ? 13 : 14;
    map = L.map("map", {
        center: [28.58721, -81.199648], // 12201 Research Pkwy #199, Orlando, FL 32826
        zoom: initialZoom,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        zIndex: 1
    });

    // Add light CartoDB Positron tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CartoDB",
        maxZoom: 18,
    }).addTo(map);

    // Add fullscreen control
    L.control.fullscreen({
        position: 'bottomright',
        title: 'Enter fullscreen',
        titleCancel: 'Exit fullscreen',
        forceSeparateButton: true,
        fullscreenElement: document.querySelector('.map-container')
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    setupMapInteractions();
    loadPedestrianData(map);
    return map;
}

// Function to get default marker radius based on screen size
function getDefaultRadius() {
    return window.innerWidth <= 768 ? 12 : 6;
}

// Function to create custom marker with zoom-based sizing
function createCustomMarker(map, lat, lng) {
    const currentZoom = map.getZoom();
    const defaultRadius = getDefaultRadius();
    // Use larger base size for mobile
    const radius = Math.min(16, Math.max(defaultRadius, currentZoom - 6));

    return L.circleMarker([lat, lng], {
        radius: radius,
        fillColor: "#dc3545",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
    });
}

// Function to setup map interactions
function setupMapInteractions() {
    const mapContainer = document.querySelector('.map-container');

    // Function to toggle scroll zoom
    function toggleScrollZoom(enable) {
        isScrollEnabled = enable;
        if (enable) {
            map.scrollWheelZoom.enable();
        } else {
            map.scrollWheelZoom.disable();
        }
    }

    // Disable scroll zoom by default
    map.scrollWheelZoom.disable();
    
    // Handle fullscreen mode
    map.on('fullscreenchange', function() {
        if (map.isFullscreen()) {
            toggleScrollZoom(true);
        } else {
            toggleScrollZoom(false);
        }
    });

    // Handle Ctrl + scroll
    mapContainer.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.stopPropagation();
            toggleScrollZoom(true);
        }
    });

    // Enable scroll zoom temporarily when user is holding Ctrl
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') {
            toggleScrollZoom(true);
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.key === 'Control') {
            toggleScrollZoom(false);
        }
    });

    // Handle touch interactions
    let touchStartY = 0;
    mapContainer.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    mapContainer.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1) {
            // Allow vertical scrolling with one finger
            const touchCurrentY = e.touches[0].clientY;
            const deltaY = touchCurrentY - touchStartY;
            
            // If it's a clear vertical scroll, let it pass through
            if (Math.abs(deltaY) > 10) {
                map.scrollWheelZoom.disable();
            }
        } else if (e.touches.length === 2) {
            // Enable pinch zoom with two fingers
            e.preventDefault();
            map.touchZoom.enable();
        }
    }, { passive: false });
}

// Store markers globally for zoom updates
let allMarkers = [];

// Load and display data
async function loadPedestrianData(map) {
    try {
        // Show loading indicator
        document.getElementById("loading").style.display = "block";
        
        const response = await fetch("../media/florida_pedestrian_deaths.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pedestrianDeaths = await response.json();
        console.log(`Loading ${pedestrianDeaths.length} locations...`);

        // Clear existing markers
        allMarkers.forEach(marker => map.removeLayer(marker));
        allMarkers = [];

        // Add markers for each death
        pedestrianDeaths.forEach((death, index) => {
            const lat = death.latitude;
            const lng = death.longitude;
            
            if (lat && lng) {
                const marker = L.circleMarker([lat, lng], {
                    radius: 6,
                    fillColor: "#dc2626",
                    color: "#ffffff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                    zIndexOffset: 1000
                });
                
                marker.bindPopup(`
                    <div style="font-size: 14px;">
                        <strong>Year:</strong> ${death.year}<br>
                        <strong>Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
                        ${death.intersection ? '<br><strong>At intersection:</strong> Yes' : ''}
                        ${death.hit_and_run ? '<br><strong>Hit and run:</strong> Yes' : ''}
                    </div>
                `);

                marker.addTo(map);
                allMarkers.push(marker);
            }
        });

        // Hide loading indicator
        document.getElementById("loading").style.display = "none";        // Center map on Research Parkway
        const researchPkwyCenter = [28.58721, -81.199648];
        const initialZoom = window.innerWidth <= 768 ? 13 : 14;
        map.setView(researchPkwyCenter, initialZoom);

        console.log(`Successfully added ${allMarkers.length} markers to the map`);
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById("loading").innerHTML = "Error loading data. Please try again later.";
    }
}

// Initialize map when DOM loads
document.addEventListener("DOMContentLoaded", function() {
    const map = initMap();

    // Update marker sizes when zoom changes
    map.on("zoomend", function () {
        const defaultRadius = getDefaultRadius();
        allMarkers.forEach((marker) => {
            const currentZoom = map.getZoom();
            const newRadius = Math.min(16, Math.max(defaultRadius, currentZoom - 6));
            marker.setRadius(newRadius);
        });
    });

    // Add scale control
    L.control.scale({
        position: "bottomleft",
        imperial: true,
        metric: false,
    }).addTo(map);
});
