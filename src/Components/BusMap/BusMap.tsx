import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Bus = {
  id: string;
  lat: number;
  lon: number;
  route: string | null;
};


export default function BusMap() {
  const [buses, setBuses] = useState<Bus[]>([]);

  const fetchBuses = async () => {
    console.log('fetching')
    const res = await fetch("http://localhost:4000/api/buses");
    const data = await res.json();
    console.log('data is', data)
    setBuses(data);
  };

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[33.749, -84.388]} zoom={11} style={{ height: "100vh", width: "100%" }}>
      {/* <TileLayer
        // osm
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"

      /> */}
      <TileLayer
url='https://gibs-a.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/EPSG3857_500m/8/102/68.jpeg'
attribution="&copy; NASA Blue Marble, image service by OpenGeo"
          maxNativeZoom={8}
        />
      {buses.map(bus => (
        <Marker key={bus.id} position={[bus.lat, bus.lon]}>
          <Popup>
            <strong>Bus {bus.id}</strong><br />
            Route: {bus.route ?? 'Unknown'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
