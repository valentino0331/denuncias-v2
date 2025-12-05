import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AdminMap = ({ reports, getTypeColor, selectedReport }) => {
    const mapRef = useRef();
    const defaultCenter = [-5.1945, -80.6328]; // Piura coordinates

    // Custom icons logic
    const createTypeIcon = (type) => {
        const color = getTypeColor ? getTypeColor(type) : '#3b82f6';
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6]
        });
    };

    const exactLocationIcon = (type) => {
        const color = getTypeColor ? getTypeColor(type) : '#3b82f6';
        return L.divIcon({
            className: 'custom-pin-icon',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    };

    // Component to handle map centering
    const MapUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.flyTo(center, 16, {
                    duration: 1.5
                });
            }
        }, [center, map]);
        return null;
    };

    return (
        <div className="relative w-full h-96 rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {selectedReport && selectedReport.exact_location && (
                    <MapUpdater center={[selectedReport.exact_location.lat, selectedReport.exact_location.lng]} />
                )}

                {selectedReport && !selectedReport.exact_location && selectedReport.points && selectedReport.points.length > 0 && (
                    <MapUpdater center={[selectedReport.points[0].lat, selectedReport.points[0].lng]} />
                )}

                {reports.map(report => {
                    const points = typeof report.points === 'string' ? JSON.parse(report.points) : report.points;
                    const exactLoc = report.exact_location ?
                        (typeof report.exact_location === 'string' ? JSON.parse(report.exact_location) : report.exact_location)
                        : null;

                    return (
                        <React.Fragment key={report.id}>
                            {points && points.map((point, idx) => (
                                <React.Fragment key={`${report.id}-point-${idx}`}>
                                    <Marker
                                        position={[point.lat, point.lng]}
                                        icon={createTypeIcon(report.type)}
                                    >
                                        <Popup>
                                            <div className="text-sm">
                                                <p className="font-semibold capitalize">{report.type}</p>
                                                <p className="text-xs text-gray-600">{report.description?.substring(0, 50)}...</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                    <Circle
                                        center={[point.lat, point.lng]}
                                        radius={50}
                                        pathOptions={{
                                            color: getTypeColor(report.type),
                                            fillColor: getTypeColor(report.type),
                                            fillOpacity: 0.15,
                                            weight: 2
                                        }}
                                    />
                                </React.Fragment>
                            ))}

                            {points && points.length === 3 && (
                                <Polygon
                                    positions={points.map(p => [p.lat, p.lng])}
                                    pathOptions={{
                                        color: '#ef4444',
                                        fillColor: '#ef4444',
                                        fillOpacity: 0.4,
                                        weight: 2
                                    }}
                                />
                            )}

                            {exactLoc && (
                                <Marker
                                    position={[exactLoc.lat, exactLoc.lng]}
                                    icon={exactLocationIcon(report.type)}
                                >
                                    <Popup>
                                        <div className="text-sm">
                                            <p className="font-semibold">📍 Ubicación Exacta</p>
                                            <p className="capitalize">{report.type}</p>
                                            <p className="text-xs text-gray-600">{report.description?.substring(0, 50)}...</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            <div className="absolute bottom-4 right-4 bg-white/95 px-4 py-3 rounded-lg shadow-lg z-[1000]">
                <p className="text-xs font-semibold text-gray-700 mb-2">Leyenda</p>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Robo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>Asalto</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Acoso</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Vandalismo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMap;