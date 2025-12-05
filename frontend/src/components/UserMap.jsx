import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportsAPI } from '../services/api';
import { AlertCircle, Loader } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserMap = ({ onBack }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef();
    const defaultCenter = [-5.1945, -80.6328]; // Piura coordinates

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await reportsAPI.getPublicReports();
                if (data.success) {
                    setReports(data.reports);
                } else {
                    setError('Error al cargar reportes');
                }
            } catch (err) {
                console.error(err);
                setError('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const getTypeColor = (type) => {
        const colors = {
            'robo': '#ef4444',
            'asalto': '#f97316',
            'acoso': '#a855f7',
            'vandalismo': '#eab308',
            'pandillaje': '#ec4899',
            'sospechoso': '#6b7280'
        };
        return colors[type?.toLowerCase()] || '#3b82f6';
    };

    const createTypeIcon = (type) => {
        const color = getTypeColor(type);
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6]
        });
    };

    const exactLocationIcon = (type) => {
        const color = getTypeColor(type);
        return L.divIcon({
            className: 'custom-pin-icon',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            {error}
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Mapa de Zonas Peligrosas</h1>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Volver al Panel
                    </button>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-gray-300">
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
                </div>
            </div>
        </div>
    );
};

export default UserMap;
