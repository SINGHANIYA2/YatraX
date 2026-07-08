/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import axios from "axios";
import { Search, MapPin, Bus, Clock, ChevronRight, Phone, User, Radio, Gauge, Users, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig, number } from 'motion/react';
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const SearchMap = dynamic(() => import("./SearchMap"), { ssr: false, });

export default function page() {

  type Place = {
    id?: string;
    name: string;
    city?: string;
    state?: string;
    country?: string;
    countryCode?: string;
    lat: number;
    lng: number;
  };

  // Matches the shape actually returned by /api/vehicle/search
  type VehicleType = {
    _id: string;
    vehicleNumber: string;
    vehicleType: "bike" | "auto" | "cab" | "bus";
    brand?: string;
    modelName?: string;

    status: "available" | "assigned" | "maintenance";
    tripStatus: "idle" | "boarding" | "running" | "completed";
    isOnline: boolean;

    speed?: number;
    heading?: number;
    lastLocationUpdate?: string | null;

    availableSeats?: number;
    seatingCapacity?: number;

    endPoints: [
      [number, number], // Source [lat, lng]
      [number, number]  // Destination [lat, lng]
    ];
    assignedPartnerId?: {
      _id: string;
      name: string;
      phone: string;
    } | null;

    routeId?: {
      distanceInKm?: number;
      estimatedDurationInMinutes?: number;
      locations?: {
        name: string;
        city?: string;
        latitude: number;
        longitude: number;
      }[];
    };
  };

  type Path = {
    lat: number,
    long: number
  }

  const [source, setSource] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [srcLat, setSrcLat] = useState<number | null>(null)
  const [destLat, setDestLat] = useState<number | null>(null)
  const [srcLong, setSrcLong] = useState<number | null>(null)
  const [destLong, setDestLong] = useState<number | null>(null)
  const [vehicleNumber, setVehicleNumber] = useState<string>("")
  const [srcSugg, setSrcSugg] = useState<Place[]>([])
  const [destSugg, setDestSugg] = useState<Place[]>([])
  const [route, setRoute] = useState<[number, number][]>([])
  const [routeId, setRouteId] = useState<string>("")
  const [vehicleId, setVehicleId] = useState<string>("")
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number][]>([])
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const [searchedByNumber, setSearchedByNumber] = useState(false)

  const canSearch = !!((source && destination && srcLat !== null && srcLong !== null && destLat !== null && destLong !== null)
    || (vehicleNumber.length >= 9 && vehicleNumber.length <= 12));

  const getVehicle = async () => {
    try {
      setLoading(true);
      setHasSearched(true);

      const { data: routeData } = await axios.get("/api/route/search", {
        params: {
          source: source.split(",")[0].trim(),
          destination: destination.split(",")[0].trim(),
        },
      }
      );

      const { data } = await axios.post("/api/vehicle/search", { routeIds: routeData.routeIds, });
      setVehicles(data.vehicles);

      if (data.vehicles.length > 0) {
        const vehicle = data.vehicles[0];

        const coords = vehicle.routeId.locations.map((loc: any) => [
          loc.latitude,
          loc.longitude,
        ]);

        setCoordinates(coords);

        setVehicleId(vehicle._id);
        setVehicleNumber(vehicle.vehicleNumber);

        // Source & Destination from endPoints
        if (
          vehicle.endPoints &&
          vehicle.endPoints.length === 2
        ) {
          setSrcLat(vehicle.endPoints[0][0]);
          setSrcLong(vehicle.endPoints[0][1]);

          setDestLat(vehicle.endPoints[1][0]);
          setDestLong(vehicle.endPoints[1][1]);
        }

      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getVehilceByVehicleNumber = async () => {
    try {
      setHasSearched(true);
      setLoading(true);
      setSearchedByNumber(true)
      if (!vehicleNumber.trim()) return;

      const { data } = await axios.get(
        `api/vehicle/search-by-number`, {
        params: {
          vehicleNumber
        }
      }
      );

      console.log("API Response:", data);


      if (!data.vehicles) {
        console.error("vehicles array missing");
        return;
      }

      setVehicles(data.vehicles);
      console.log(data)

      if (data.vehicles.length > 0) {
        const vehicle = data.vehicles[0];

        const coords = vehicle.routeId.locations.map((loc: any) => [
          loc.latitude,
          loc.longitude,
        ]);

        setCoordinates(coords);

        setVehicleId(vehicle._id);
        setVehicleNumber(vehicle.vehicleNumber);

        // Source & Destination from endPoints
        if (
          vehicle.endPoints &&
          vehicle.endPoints.length === 2
        ) {
          setSrcLat(vehicle.endPoints[0][0]);
          setSrcLong(vehicle.endPoints[0][1]);

          setDestLat(vehicle.endPoints[1][0]);
          setDestLong(vehicle.endPoints[1][1]);
        }

        setLoading(false);
      }

    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  };

  const getSuggestion = async (query: string, setResult: (r: Place[]) => void, restrict?: string | null) => {
    try {
      if (!query || query.trim().length < 3) {
        setResult([])
        return
      }
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=5&lang=en`)

      const results: Place[] = (data.features ?? []).map((f: any) => ({
        id: String(f.properties.osm_id),
        name: f.properties.name,
        city: f.properties.city,
        state: f.properties.state,
        country: f.properties.country,
        countryCode: f.properties.countrycode,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }))

      setResult(results)

    } catch (error) {
      console.log("errro :", error)
      setResult([])
    }
  }

  const suggestion = (p: Place) => [p.name, p.city, p.state, p.country].filter(Boolean).join(", ");

  // Helpers for trip status badge
  const tripStatusStyles: Record<string, string> = {
    running: "bg-green-100 text-green-700",
    boarding: "bg-amber-100 text-amber-700",
    idle: "bg-gray-100 text-gray-600",
    completed: "bg-blue-100 text-blue-700",
  };

  const timeAgo = (dateStr?: string | null) => {
    if (!dateStr) return "No updates yet";
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr ago`;
  };

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-6">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="h-10 w-10 shrink-0 bg-black rounded-full border border-border flex items-center justify-center hover:bg-black/35 transition-colors cursor-pointer"
      >
        <ChevronLeft size={18} className="text-foreground" />
      </button>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Section */}
        <div className="bg-card rounded-3xl shadow-sm p-5 md:p-6">
          <h1 className="text-2xl font-bold mb-5">
            Track Your Vehicle
          </h1>

          <div className="grid md:grid-cols-4 gap-2">

            <input
              type="text"
              placeholder="vehicleNumber"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border outline-none focus:border-border"
              onChange={(e) => {
                setVehicleNumber(e.target.value.toUpperCase())
                setSource("")
                setDestination("")
              }
              }
              value={vehicleNumber}
            />
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Source"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border outline-none focus:border-border"
                onChange={(e) => {
                  setSource(e.target.value)
                  getSuggestion(e.target.value, setSrcSugg)
                  setVehicleNumber("")
                }
                }
                value={source}
              />

              <AnimatePresence>
                {srcSugg.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-md max-h-52 overflow-y-auto z-50"
                  >
                    {
                      srcSugg.map((p, i) => (

                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-0"
                          onClick={() => {
                            setSource(suggestion(p))
                            setSrcLat(p.lat)
                            setSrcLong(p.lng)
                            setSrcSugg([])
                            setVehicleNumber("")
                          }}
                        >
                          <MapPin size={13} className="text-muted-foreground flex-shrink-0" />

                          <span className="text-sm text-foreground font-medium truncate">
                            {suggestion(p)}
                          </span>

                          <ChevronRight
                            size={13}
                            className="text-muted-foreground flex-shrink-0 ml-auto"
                          />

                        </motion.div>

                      ))
                    }

                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                disabled={!source}
                value={destination}
                placeholder="Destination"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border outline-none focus:border-border"
                onChange={(e) => {
                  setDestination(e.target.value)
                  getSuggestion(e.target.value, setDestSugg)
                  setVehicleNumber("")
                }
                }
              />

              <AnimatePresence>
                {destSugg.length > 0 && (
                  <motion.div

                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-2xl shadow-md max-h-52 overflow-y-auto z-50"

                  >
                    {
                      destSugg.map((p, i) => (

                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-0"
                          onClick={() => {
                            setDestination(suggestion(p))
                            setDestLat(p.lat)
                            setDestLong(p.lng)
                            setDestSugg([])
                          }}
                        >
                          <MapPin size={13} className="text-muted-foreground flex-shrink-0" />

                          <span className="text-sm text-foreground font-medium truncate">
                            {suggestion(p)}
                          </span>

                          <ChevronRight
                            size={13}
                            className="text-muted-foreground flex-shrink-0 ml-auto"
                          />

                        </motion.div>

                      ))
                    }

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className={`${canSearch ? 'h-12 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-primary-hover' : 'h-12 cursor-pointer rounded-xl bg-muted text-muted-foreground font-medium flex items-center justify-center gap-2'}`}
              onClick={
                vehicleNumber.trim().length >= 9 && vehicleNumber.trim().length <= 12
                  ? getVehilceByVehicleNumber
                  : getVehicle
              }

              disabled={!canSearch}
            >
              <Search size={18} />
              Search
            </button>

          </div>
        </div>

        {/* Main Section */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Vehicle Section */}
          <div className="lg:col-span-1 bg-card rounded-3xl shadow-sm p-5 h-[750px]">
            <h2 className="text-xl font-semibold mb-5">
              Available Vehicles
            </h2>

            <div className="overflow-y-auto h-[650px] pr-2">
              {
                !hasSearched && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-7xl mb-5">
                      🚌
                    </div>

                    <h3 className="text-xl font-semibold">
                      Find your ride
                    </h3>

                    <p className="text-muted-foreground mt-3 max-w-xs">
                      Search a route and discover buses travelling
                      between your source and destination.
                    </p>

                    <p className="text-muted-foreground text-sm mt-6">
                      Enter source and destination to start tracking.
                    </p>
                  </div>
                )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-border border-t-foreground rounded-full animate-spin" />

                  <p className="mt-5 text-muted-foreground">
                    Searching vehicles...
                  </p>
                </div>
              )}

              {!loading && hasSearched && vehicles.length === 0 &&
                (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">
                      😔
                    </div>

                    <h3 className="text-xl font-semibold">
                      No Vehicles Found
                    </h3>

                    <p className="text-muted-foreground mt-3">
                      No active vehicles are currently available
                      on this route.
                    </p>
                  </div>
                )}

              {!loading &&
                vehicles.length > 0 &&
                vehicles.map((vehicle) => {
                  const locations = vehicle.routeId?.locations ?? [];
                  const firstStop = locations[0];
                  const lastStop = locations[locations.length - 1];
                  const isTracking = vehicleId === vehicle._id;

                  return (
                    <div
                      key={vehicle._id}
                      onClick={() => {
                        if (!vehicle.routeId || !vehicle.routeId.locations) {
                          return;
                        }


                        setVehicleId(vehicle._id);
                        setVehicleNumber(vehicle.vehicleNumber);


                        const routeCoords: [number, number][] =
                          vehicle.routeId.locations.map((loc) => [
                            loc.latitude,
                            loc.longitude,
                          ]);

                        setCoordinates(routeCoords);
                      }}
                      className={`border rounded-2xl p-4 mb-4 cursor-pointer transition
                        ${isTracking
                          ? "border-primary shadow-lg ring-2 ring-primary/30"
                          : "border-border hover:shadow-md"
                        }`}
                    >
                      {/* Header row: vehicle number + live/trip status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Bus size={16} className="text-muted-foreground" />
                            <h3 className="font-semibold text-lg">
                              {vehicle.vehicleNumber}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                            {vehicle.vehicleType}
                            {vehicle.brand ? ` • ${vehicle.brand}` : ""}
                            {vehicle.modelName ? ` ${vehicle.modelName}` : ""}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${tripStatusStyles[vehicle.tripStatus] ?? "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {vehicle.tripStatus}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Radio
                              size={11}
                              className={vehicle.isOnline ? "text-green-500" : "text-gray-400"}
                            />
                            {vehicle.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <p className="text-sm text-muted-foreground mt-3">
                        {firstStop?.name ?? "--"}
                        {" → "}
                        {lastStop?.name ?? "--"}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        {vehicle.routeId?.distanceInKm ?? "--"} km
                        {" • "}
                        {vehicle.routeId?.estimatedDurationInMinutes ?? "--"} mins
                      </p>

                      {/* Partner + speed + seats + last update */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 pt-3 border-t border-border">
                        {vehicle.assignedPartnerId && (
                          <>
                            <div className="flex items-center gap-1.5 text-xs text-foreground truncate">
                              <User size={12} className="text-muted-foreground flex-shrink-0" />
                              {vehicle.assignedPartnerId.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-foreground truncate">
                              <Phone size={12} className="text-muted-foreground flex-shrink-0" />
                              {vehicle.assignedPartnerId.phone}
                            </div>
                          </>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <Gauge size={12} className="text-muted-foreground flex-shrink-0" />
                          {vehicle.speed ?? 0} km/h
                        </div>

                        {typeof vehicle.availableSeats === "number" && (
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <Users size={12} className="text-muted-foreground flex-shrink-0" />
                            {vehicle.availableSeats}/{vehicle.seatingCapacity} seats
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
                          <Clock size={12} className="flex-shrink-0" />
                          {timeAgo(vehicle.lastLocationUpdate)}
                        </div>
                      </div>

                      <button
                        className={`mt-4 w-full h-11 rounded-xl font-medium transition cursor-pointer
                          ${isTracking
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-hover"
                          }`}
                      >
                        {isTracking ? "Tracking Vehicle" : "Track Vehicle"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 bg-card rounded-3xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-5">
              Live Map
            </h2>

            <div className="h-[650px] rounded-2xl overflow-hidden bg-secondary">
              {vehicleId && !searchedByNumber ? (

                <SearchMap
                
                  source={source}
                  destination={destination}
                  coordinates={coordinates}
                  vehicleNumber={vehicleNumber}
                  srcLat={srcLat}
                  srcLong={srcLong}
                  destLat={destLat}
                  destLong={destLong}
                  vehicleId={vehicleId}
                
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <div className="text-7xl mb-4">
                    🗺️
                  </div>

                  <p>Select a vehicle to start tracking.</p>
                </div>
              )
              }
              {/* {
                vehicleId && searchedByNumber && (

                )
              } */}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}