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

// const currentLocationIcon = new L.DivIcon({
//   html: `
//     <div style="display:flex;flex-direction:column;align-items:center;">
//       <div style="
//         background:var(--primary);
//         color:#fff;
//         padding:5px 14px;
//         border-radius:10px;
//         font-size:10px;
//         font-weight:800;
//       ">
//         CURRENT LOCATION
//       </div>
//       <div style="width:2px;height:10px;background:var(--primary);"></div>
//       <div style="
//         width:13px;
//         height:13px;
//         background:var(--primary);
//         border-radius:50%;
//         border:3px solid #fff;
//       "></div>
//     </div>
//   `,
//   className: '',
//   iconSize: [150, 50],
//   iconAnchor: [75, 50],
// });


const currentLocationIcon = new L.DivIcon({
  html: `
    <div class="relative flex items-center justify-center w-[50px] h-[50px]">
      <span class="absolute inline-flex w-full h-full rounded-full bg-purple-500 opacity-30 animate-ping"></span>
      <span class="relative inline-flex w-4 h-4 rounded-full bg-purple-600 border-[3px] border-white shadow-md"></span>
    </div>
  `,
  className: '',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

export default function SearchMap({
  source,
  destination,
  vehicleNumber,
  coordinates: coordinatesProp,
  srcLat: srcLatProp,
  srcLong: srcLongProp,
  destLat: destLatProp,
  destLong: destLongProp,
  vehicleId,
}: SearchMapProps) {

  const [route, setRoute] = useState<[number, number][]>([]);

  const [vehicleLocation, setVehicleLocation] = useState<[number, number]>();

  // ---------------------------------------------------------------
  // Fallback: source/destination weren't passed in as props (e.g. the
  // user searched by vehicle number only), but we do have a vehicleId.
  // Fetch the vehicle (with its route + stop locations populated) and
  // derive src/dest lat-lng + the coordinates array from that route,
  // the same way the parent page does when it searches by source/destination.
  // ---------------------------------------------------------------
  const [fallbackCoordinates, setFallbackCoordinates] = useState<[number, number][]>([]);
  const [fallbackSrcLat, setFallbackSrcLat] = useState<number | null>(null);
  const [fallbackSrcLong, setFallbackSrcLong] = useState<number | null>(null);
  const [fallbackDestLat, setFallbackDestLat] = useState<number | null>(null);
  const [fallbackDestLong, setFallbackDestLong] = useState<number | null>(null);
  const [resolvingVehicleRoute, setResolvingVehicleRoute] = useState(false);
  const [resolveError, setResolveError] = useState('');

  const hasSrcDestProps =
    srcLatProp != null &&
    srcLongProp != null &&
    destLatProp != null &&
    destLongProp != null;

  useEffect(() => {
    // Only fall back to a fetch if the parent didn't already give us
    // usable src/dest, but we do have a vehicleId to look it up with.
    if (hasSrcDestProps || !vehicleId) return;

    let cancelled = false;

    const resolveFromVehicle = async () => {
      try {
        setResolvingVehicleRoute(true);
        setResolveError('');

        // NOTE: this endpoint needs routeId populated with its stop
        // locations (each with latitude/longitude), the same shape used
        // by /api/vehicle/search-by-number. If /api/vehicle/[vehicleId]
        // doesn't currently .populate("routeId") with nested locations,
        // add that populate on the backend or point this at whichever
        // route already returns that shape.
        const { data } = await axios.get(`/api/vehicle/${vehicleId}`);

        const vehicle = data?.vehicle ?? data;
        const locations = vehicle?.routeId?.locations;

        if (!Array.isArray(locations) || locations.length < 2) {
          if (!cancelled) {
            setResolveError('No route found for this vehicle');
          }
          return;
        }

        const coords: [number, number][] = locations.map(
          (loc: { latitude: number; longitude: number }) => [
            loc.latitude,
            loc.longitude,
          ]
        );

        if (cancelled) return;

        setFallbackCoordinates(coords);
        setFallbackSrcLat(coords[0][0]);
        setFallbackSrcLong(coords[0][1]);
        setFallbackDestLat(coords[coords.length - 1][0]);
        setFallbackDestLong(coords[coords.length - 1][1]);
      } catch (err) {
        console.log(err);
        if (!cancelled) {
          setResolveError('Failed to load this vehicle\'s route');
        }
      } finally {
        if (!cancelled) setResolvingVehicleRoute(false);
      }
    };

    resolveFromVehicle();

    return () => {
      cancelled = true;
    };
  }, [vehicleId, hasSrcDestProps]);

  // Effective values used everywhere below: prefer what the parent passed
  // in, fall back to what we resolved from the vehicle's route ourselves.
  const coordinates = hasSrcDestProps ? coordinatesProp : fallbackCoordinates;
  const srcLat = hasSrcDestProps ? srcLatProp : fallbackSrcLat;
  const srcLong = hasSrcDestProps ? srcLongProp : fallbackSrcLong;
  const destLat = hasSrcDestProps ? destLatProp : fallbackDestLat;
  const destLong = hasSrcDestProps ? destLongProp : fallbackDestLong;

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

        const polyline: [number, number][] = data.routes[0].geometry.coordinates.map(([lng, lat]: [
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


  useEffect(() => {
    if (!vehicleId || vehicleLocation)
      return;

    const getLocation = async () => {
      try {
        const { data } = await axios.get(`/api/track/getlocation/${vehicleId}`);

        if (data?.currentLatitude != null && data?.currentLongitude != null) {
          setVehicleLocation([
            data.currentLatitude,
            data.currentLongitude,
          ]);
        }
        

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

    const handleLocation = (data: { vehicleId: string; latitude: number; longitude: number; speed?: number; heading?: number; }) => {
      if (data.vehicleId !== vehicleId) {
        return;
      }

      setVehicleLocation([data.latitude, data.longitude,]);

    };

    socket.on("location:update", handleLocation);

    return () => {
      socket.off("location:update", handleLocation);

      socket.emit("leave:vehicle", vehicleId);
    };
  }, [vehicleId]);

  useEffect(() => {
    console.log("coordinates =", coordinates);

    if (!coordinates || coordinates.length < 2) {
      console.log("Not enough coordinates");
      return;
    }

  }, [coordinates]);

  const fitPoints = [
    ...(srcLat != null && srcLong != null ? [[srcLat, srcLong] as [number, number]] : []),
    ...(Array.isArray(coordinates)
      ? coordinates
      : []),
    ...(destLat != null && destLong != null ? [[destLat, destLong] as [number, number]] : []),
  ];

  // const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629,];

  const sourcePoint: [number, number] | null =
    coordinates?.length > 0
      ? coordinates[0]
      : srcLat != null && srcLong != null
        ? [srcLat, srcLong]
        : null;

  const destinationPoint: [number, number] | null =
    coordinates?.length > 0
      ? coordinates[coordinates.length - 1]
      : destLat != null && destLong != null
        ? [destLat, destLong]
        : null;

  if (resolvingVehicleRoute) {
    return (
      <div>
        <p>Search Vehicle</p>
        <p>Loading route for this vehicle....</p>
      </div>
    );
  }

  if (resolveError) {
    return (
      <div>
        <p>Search Vehicle</p>
        <p>{resolveError}</p>
      </div>
    );
  }

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
        center={sourcePoint ?? [20.5937, 78.9629]}

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
              color: "blue",
              weight: 8,
              opacity: 1,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}