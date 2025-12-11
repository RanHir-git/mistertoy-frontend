
import { useState, useEffect, useRef } from "react"
const API_KEY = 'AIzaSyAg-cFoosaE1LY5TDskWhdW9VyMKHpC8WM'
import { AdvancedMarker, APIProvider, Map, useMap, Pin, InfoWindow } from '@vis.gl/react-google-maps';

// Define multiple marker locations
const MARKERS = [
    { id: 1, name: 'Tel Aviv branch', lat: 32.07529427507578, lng: 34.77478840967926, address: 'Rothschild Blvd 45, Tel Aviv' },
    { id: 2, name: 'Jerusalem branch', lat: 31.7683, lng: 35.2137, address: 'Jaffa St 23, Jerusalem' },
    { id: 3, name: 'Haifa branch', lat: 32.7940, lng: 34.9896, address: 'Ben Gurion Ave 12, Haifa' },
    { id: 4, name: 'Eilat branch', lat: 29.5577, lng: 34.9519, address: 'Coral Beach St 8, Eilat' },
    { id: 5, name: 'Beer Sheva branch', lat: 31.2529, lng: 34.7915, address: 'Rager Blvd 15, Beer Sheva' }
];


function MapContent({ markers, onMarkerSelect, openInfoWindowId, onInfoWindowClose }) {
    const map = useMap();
    const prevCenterRef = useRef(null);
    const markerRefs = useRef({});

    // Update map when marker is selected
    useEffect(() => {
        if (map && onMarkerSelect) {
            const { lat, lng } = onMarkerSelect;
            if (!prevCenterRef.current || prevCenterRef.current.lat !== lat || prevCenterRef.current.lng !== lng) {
                map.setCenter({ lat, lng });
                map.setZoom(14);
                prevCenterRef.current = { lat, lng };
            }
        }
    }, [map, onMarkerSelect]);

    return (
        <>
            {markers.map(marker => (
                <AdvancedMarker 
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.name}
                    ref={(ref) => { if (ref) markerRefs.current[marker.id] = ref; }}
                >
                    <div 
                        style={{ fontSize: '2rem',color: 'black', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onInfoWindowClose(marker.id);
                        }}
                    >🏪</div>
                    {openInfoWindowId === marker.id && (
                        <InfoWindow anchor={markerRefs.current[marker.id]} onCloseClick={() => onInfoWindowClose(null)}>
                            <div style={{ padding: '8px', minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 8px 0',color: 'black' }}>{marker.name}</h3>
                                <p style={{ margin: '0 0 8px 0',color: 'black' }}>{marker.address}</p>
                                <button onClick={() => onInfoWindowClose(null)} style={{ padding: '6px 12px', cursor: 'pointer' }}>Close</button>
                            </div>
                        </InfoWindow>
                    )}
                </AdvancedMarker>
            ))}
        </>
    );
}

export function GoogleMap() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);

    const handleMarkerClick = (marker) => {
        setSelectedMarker({ lat: marker.lat, lng: marker.lng });
    };

    return (
        <section className="google-map">
            <h1>Google Map!</h1>
            <div className="map-controls">
                {MARKERS.map(marker => (
                    <button
                        key={marker.id}
                        className={`marker-btn ${selectedMarker && selectedMarker.lat === marker.lat && selectedMarker.lng === marker.lng ? 'active' : ''}`}
                        onClick={() => handleMarkerClick(marker)}
                    >
                        {marker.name}
                    </button>
                ))}
            </div>
            <APIProvider apiKey={API_KEY}>
                <Map 
                    className="map"
                    defaultCenter={{ lat: MARKERS[0].lat, lng: MARKERS[0].lng }}
                    defaultZoom={12}
                    mapId="DEMO_MAP_ID"
                    style={{ width: '100%', height: '100%' }}
                >
                    <MapContent 
                        markers={MARKERS} 
                        onMarkerSelect={selectedMarker}
                        openInfoWindowId={openInfoWindowId}
                        onInfoWindowClose={setOpenInfoWindowId}
                    />
                </Map>
            </APIProvider>
        </section>
    );
}
