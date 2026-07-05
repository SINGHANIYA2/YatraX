'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { getSocket } from '@/lib/socket';

interface SearchMapProps {
  source: string;
  destination: string;
  vehicleNumber: string;
  coordinates: [number, number][];
  srcLat: number;
  srcLong: number;
  destLat: number;
  destLong: number;
  vehicleId: string;
}

function FitBounds({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    map.invalidateSize();

    map.fitBounds(points, {
      padding: [72, 72],
      animate: true,
      duration: 1,
    });
  }, [points, map]);

  return null;
}
const sourceIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:var(--success);
        color:#fff;
        padding:5px 14px;
        border-radius:10px;
        font-size:10px;
        font-weight:800;
      ">
        SOURCE
      </div>
      <div style="width:2px;height:10px;background:var(--success);"></div>
      <div style="
        width:13px;
        height:13px;
        background:var(--success);
        border-radius:50%;
        border:3px solid #fff;
      "></div>
    </div>
  `,
  className: '',
  iconSize: [90, 40],
  iconAnchor: [45, 40],
});

const destinationIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:var(--destructive);
        color:#fff;
        padding:5px 14px;
        border-radius:10px;
        font-size:10px;
        font-weight:800;
      ">
        DESTINATION
      </div>
      <div style="width:2px;height:10px;background:var(--destructive);"></div>
      <div style="
        width:13px;
        height:13px;
        background:var(--destructive);
        border-radius:50%;
        border:3px solid #fff;
      "></div>
    </div>
  `,
  className: '',
  iconSize: [120, 40],
  iconAnchor: [60, 40],
});

const currentLocationIcon = new L.DivIcon({
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background:var(--primary);
        color:#fff;
        padding:5px 14px;
        border-radius:10px;
        font-size:10px;
        font-weight:800;
      ">
        CURRENT LOCATION
      </div>
      <div style="width:2px;height:10px;background:var(--primary);"></div>
      <div style="
        width:13px;
        height:13px;
        background:var(--primary);
        border-radius:50%;
        border:3px solid #fff;
      "></div>
    </div>
  `,
  className: '',
  iconSize: [150, 50],
  iconAnchor: [75, 50],
});

export default function SearchMap({coordinates,srcLat,srcLong,destLat,destLong,vehicleId,}: SearchMapProps){
  
  const [route, setRoute] = useState<[number, number][]>([]);

  const [vehicleLocation, setVehicleLocation] = useState<[number, number]>();
  //  Get route from OSRM
 
  useEffect(() => {
    if (!coordinates || coordinates.length < 2) {
      setRoute([]);
      return;
    }

    const getRoute = async () => {
      try {
        const osrmCoords = coordinates.map(([lat, lng]) => `${lng},${lat}`).join(';');

        const { data } = await axios.get(`https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson`);

        const polyline: [number,number ][] = data.routes[0].geometry.coordinates.map(([lng, lat]: [
              number,
              number
            ]) => [lat, lng]
          );

        setRoute(polyline);
      } catch (err) {
        console.log(err);
      }
    };

    getRoute();
  }, [coordinates]);



  //  Initial vehicle location

  useEffect(() => {
    if (!vehicleId || vehicleLocation)
      return;

    const getLocation = async () => {
      try {
        const { data } = await axios.get(`/api/track/getlocation/${vehicleId}`);

         if (data?.currentLatitude != null && data?.currentLongitude != null ) {
          setVehicleLocation([
            data.currentLatitude,
            data.currentLongitude,
          ]);
        }
        console.log("Initial location API:", data);
        console.log("vehicleLocation:", vehicleLocation);
        console.log("Socket location:", data);
      } catch (err) {
        console.log(err);
      }
    };

    getLocation();
  }, [vehicleId]);

  //  Live socket updates

  useEffect(() => {
    if (!vehicleId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit(
      "join:vehicle",
      vehicleId
    );

    const handleLocation = (data: {vehicleId: string;latitude: number;longitude: number;speed?: number;heading?: number;}) => {
      if (data.vehicleId !== vehicleId) {
        return;
      }

      setVehicleLocation([data.latitude,data.longitude,]);

    };

    socket.on("location:update", handleLocation);

    return () => {
      socket.off("location:update", handleLocation);

      socket.emit("leave:vehicle", vehicleId);
    };
  }, [vehicleId]);

  const fitPoints = [
    [srcLat, srcLong],
    ...(Array.isArray(coordinates)
      ? coordinates
      : []),
    [destLat, destLong],
  ];

  // const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629,];

  const sourcePoint = coordinates?.length > 0 ? coordinates[0] : [srcLat, srcLong];

const destinationPoint = coordinates?.length > 0
    ? coordinates[
        coordinates.length - 1
      ]
    : [destLat, destLong];
  if (!coordinates || srcLat == null || srcLong == null || destLat == null || destLong == null) {
    return <div>
      <p>Search Vehicle</p>
      <p>
        Loading....
      </p>
    </div>;
  }
  return (
    <div className="h-[650px] w-full">
      <MapContainer
        center={sourcePoint}

        zoom={5}
        scrollWheelZoom
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <TileLayer
          attribution="&copy; YatraX"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />

        <FitBounds points={fitPoints} />

        {
          sourcePoint &&

          <Marker
            position={sourcePoint}
            icon={sourceIcon}
          />
        }

        {destinationPoint &&
          <Marker
            position={destinationPoint}
            icon={destinationIcon}
          />
        }

        {
          vehicleLocation && (
            <Marker
              position={vehicleLocation}
              icon={currentLocationIcon}
            />
          )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: 'var(--primary)',
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}