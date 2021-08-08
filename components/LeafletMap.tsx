import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";

interface point {
  lat: number;
  long: number;
  name: string;
}

interface prop {
  routeId: string;
}

const LeafletMap = ({ routeId }: prop) => {
  const [leafletMap, setLeafletMap] = useState<any>();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (routeId) {
      axios
        .get(`/api/routes/${routeId}`)
        .then((res) => {
          const points = res.data.route;
          setPoints(points);
          let maxLong = -180,
            minLong = 180,
            minLat = 90,
            maxLat = -90;

          for (let i in points) {
            if (points[i].long > maxLong) maxLong = points[i].long;
            if (points[i].long < minLong) minLong = points[i].long;
            if (points[i].lat > maxLat) maxLat = points[i].lat;
            if (points[i].lat < minLat) minLat = points[i].lat;
          }
          leafletMap.closePopup();
          leafletMap.fitBounds([
            [minLat, minLong],
            [maxLat, maxLong],
          ]);
        })
        .catch((err) => console.log(err));
    }
  }, [routeId, leafletMap]);

  return (
    <MapContainer whenCreated={(map) => setLeafletMap(map)} id="map" center={[0, 0]} zoom={1}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.length > 0 &&
        points.map((point: point, idx: number) => (
          <Marker key={idx} position={[point.lat, point.long]}>
            <Popup>
              <div className="popup-text">
                <span>
                  {point.name} <br />({point.lat.toFixed(2)}, {point.long.toFixed(2)})
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      <Polyline positions={points.map((point: point) => [point.lat, point.long])}></Polyline>
    </MapContainer>
  );
};

export default LeafletMap;
