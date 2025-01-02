// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Set the default view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const apiKey = "8CJTFR-Y8KBU8-QLTW4U-5E6E"; 
const satelliteIds = [25544, 33591, 20580, 26609, 25994, 40967, 41189]; // Array of satellite IDs to display [ISS, NOAA-19, Hubble, OSCAR 40, TERRA, FOX-1A, ORBCOMM FM116]
let satelliteMarkers = []; // Array to store markers for all satellites
let userMarker = null; // Marker for the user's location
const satelliteDataStore = {}; // Store satellite data keyed by satellite ID
const updateInterval = 1000; // 1 second update interval
const fetchInterval = 300; // 300 seconds data fetch

// Fetch satellite data for a specific ID and duration
async function fetchSatelliteData(id, seconds) {
    try {
        // const response = await fetch(`https://corsproxy.io/https://api.n2yo.com/rest/v1/satellite/positions/${id}/0/0/0/${seconds}/&apiKey=${apiKey}`);
        const response = await fetch(`/satelliteData/${id}/${seconds}`);
        const data = await response.json();

        // Map positions and include the satellite name
        const positions = data.positions.map(position => ({
            latitude: position.satlatitude,
            longitude: position.satlongitude,
            altitude: position.sataltitude,
            timestamp: position.timestamp,
        }));

        // Add the satellite name to the first position for later use
        if (positions.length > 0) {
            positions[0].name = data.info.satname; // Store name with positions
        }

        return positions;
    } catch (error) {
        console.error("Error fetching satellite data:", error);
        return [];
    }
}


// Generate popup content for satellites
function getPopupContent(id, position) {
    const satelliteName = satelliteDataStore[id]?.[0]?.name || "Satellite";

    return `
        <b>${satelliteName}</b><br>
        <b>Satellite ID:</b> ${id}<br>
        <b>Latitude:</b> ${position.latitude.toFixed(2)}<br>
        <b>Longitude:</b> ${position.longitude.toFixed(2)}<br>
        <b>Altitude:</b> ${position.altitude.toFixed(2)} km<br>
    `;
}

// TO-DO:optimise to account for positions that have not been fulfiiled
// Initialize or refill satellite data
async function initializeSatelliteData() {
    for (const id of satelliteIds) {
        const positions = await fetchSatelliteData(id, fetchInterval);
        satelliteDataStore[id] = positions;
    }
}

// Update marker positions based on stored data
function updateMarkers() {
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds

    for (const id of satelliteIds) {
        const positions = satelliteDataStore[id];
        if (!positions || positions.length === 0) continue;

        // Find the next position to display
        const nextPosition = positions.find(pos => pos.timestamp >= currentTime);
        if (!nextPosition) continue;

        let marker = satelliteMarkers.find(marker => marker.satelliteId === id);
        if (!marker) {
            marker = L.marker([nextPosition.latitude, nextPosition.longitude], {
                icon: L.icon({
                    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAjJJREFUWEe1lz1PFUEUhh9+gA0FP0LtKEmI9FpqBw0JiWhjaNBGqOzsRBOolEbtiL1WVpYgjT9AKwstKbjvzczNeDgzZ2e5bnJz793dOefZ8/HO2QX6jz3gblr2afKt/6OPhc6Vu8ALs2b/OhA9AE+AlxXgGkQYraEA28CrwvlZ+n2rOGch5Px5FK0hAJvAkXH+IP3/AHgQnvNs4h/QCGAdeOs4/57O3QQ8CPvkNnMCFAgtAD3l+4bzfMmDiGpbKbwdAXwDlpMlLRBQfnLroBdiEMBpkd8IoJVzLxqzOmilwBqtQYx2HqVA11VMpdJZiGs5HwLQglBNRNVeht8Vq6gNswEvHWX/R1XvasDQCNQghjpV2qqKWUbgPrCa+lPtdwH8BH5NDHxMn0edYVfktLammFMhUh7lfExIW1GYqd0EoKaYewIo+31oWKP7vILzIKYAvSo2xnlNts9yDcwLIlJM62cGIML/DeHWgdWBsRDKeSlKNhKe3Wca7zwhGgOxBGhq8mRb0bVtuJPHu5oS9kJIHw4qe4cAyhZ/XI53LSnugfgCrKVSb21QW8Bh2UY1ABkRgATKSqnXhufp/pZsbwDv7GKvCPPEq3tPgKdODq2d38CiOZlH8j/A62TjCrwFsOHLihal4y9wI1Io77oFuAN8Lm4sr7cgvgIr8wCQDe2E94Bj4IcxWoN4M9k1H84LILLjQWg60rbbfQydiKzhEmI2Ynd7D15MInsZQk8+fcsZc1wC9zSKyDaea48AAAAASUVORK5CYII=',
                    iconSize: [32, 32], 
                    iconAnchor: [12, 41], 
                    popupAnchor: [1, -34], 
                    shadowSize: [41, 41]  
                }),
            }).addTo(map);
            marker.satelliteId = id;
            satelliteMarkers.push(marker);
        } else {
            marker.setLatLng([nextPosition.latitude, nextPosition.longitude]);
        }

        marker.bindPopup(getPopupContent(id, nextPosition));
    }
}

// Periodically fetch new data
async function periodicRefetch() {
    while (true) {
        await initializeSatelliteData();
        await new Promise(resolve => setTimeout(resolve, fetchInterval * 1000)); // Wait 5 minutes
    }
}

// Track the user's location using Geolocation API
function trackUserLocation() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            if (!userMarker) {
                userMarker = L.marker([latitude, longitude], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41], 
                        iconAnchor: [12, 41], 
                        popupAnchor: [1, -34], 
                        shadowSize: [41, 41]  
                    }),
                }).addTo(map);

                userMarker.bindPopup("<b>You are here!</b>");
            } else {
                userMarker.setLatLng([latitude, longitude]);
            }
        },
        (error) => {
            console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
    );
}

// Initialize data and start periodic updates
(async function () {
    await initializeSatelliteData(); // Fetch initial data
    setInterval(updateMarkers, updateInterval); // Update markers every second
    periodicRefetch(); // Continuously refetch data every 5 minutes
})();

// Start tracking the user's location
trackUserLocation();

/*Recommended program structure and logic tree suggested by ChatGPT */
