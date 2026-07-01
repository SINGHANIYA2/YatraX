/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import axios from "axios";
import { Search, MapPin, Bus, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig, number } from 'motion/react';
import { useSession } from "next-auth/react";
import vehicles from '../../components/vehicles';
import dynamic from "next/dynamic";

const SearchMap = dynamic(() => import("./SearchMap"),
  {
    ssr: false,
  }
);



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

  type VehicleType = {
  _id: string;
  vehicleNumber: string;
  vehicleType: string;
  tripStatus: string;

  routeId?: {
    distanceInKm?: number;
    estimatedDurationInMinutes?: number;
    locations?: {
      name: string;
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

  const canSearch = !!((source && destination && srcLat !== null && srcLong !== null && destLat !== null && destLong !== null) 
                    || (vehicleNumber.length >= 9 && vehicleNumber.length <= 12));
  const getVehicle = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      console.log("searching ... ")
      const { data: routeData } = await axios.get("/api/route/search", {
          params: {
            source: source.split(",")[0].trim(),
            destination: destination.split(",")[0].trim(),
          },
        }
        );

      const { data } =
        await axios.post("/api/vehicle/search",{routeIds: routeData.routeIds,});

      setVehicles(data.vehicles);

      if (data.vehicles.length > 0) {
        const coords = data.vehicles[0].routeId.locations.map((loc: any) => [
          loc.latitude,
          loc.longitude,
        ]
        );

        setCoordinates(coords);

        setVehicleId(data.vehicles[0]._id);

        setVehicleNumber(data.vehicles[0].vehicleNumber);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getVehilceByVehicleNumber = async () => {
    try {
      setLoading(true)
      if(!vehicleNumber) return;
      
      const {data} = await axios.get(`api/track/getlocation/vehiclelocation/${vehicleNumber}`)
      console.log(data)
      setVehicles(data.vehicles);

      if (data.vehicles.length > 0) {
        const coords = data.vehicles[0].routeId.locations.map((loc: any) => [
          loc.latitude,
          loc.longitude,
        ]
        );

        setCoordinates(coords);

        setVehicleId(data.vehicles[0]._id);

        setVehicleNumber(data.vehicles[0].vehicleNumber);
       
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
    }
  }


  // get the path 



  const getSuggestion = async (query: string, setResult: (r: Place[]) => void, restrict?: string | null) => {
    try {
      if (!query || query.trim().length < 3) {
        setResult([])
        return
      }
      const { data } = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=5&lang=en`)
      console.log(data)

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


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6">
          <h1 className="text-2xl font-bold mb-5">
            Track Your Vehicle
          </h1>

          <div className="grid md:grid-cols-4 gap-2">

            <input
              type="text"
              placeholder="vehicleNumber"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 outline-none focus:border-black"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Source"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 outline-none focus:border-black"
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
                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50"
                  >
                    {
                      srcSugg.map((p, i) => (

                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                          onClick={() => {
                            setSource(suggestion(p))
                            setSrcLat(p.lat)
                            setSrcLong(p.lng)
                            setSrcSugg([])
                            setVehicleNumber("")
                          }}
                        >
                          {/* Content here */}
                          <MapPin size={13} className="text-zinc-400 flex-shrink-0" />

                          <span className="text-sm text-zinc-800 font-medium truncate">
                            {suggestion(p)}
                          </span>

                          <ChevronRight
                            size={13}
                            className="text-zinc-300 flex-shrink-0 ml-auto"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                disabled={!source}
                value={destination}
                placeholder="Destination"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-300 outline-none focus:border-black"
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
                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto z-50"

                  >
                    {
                      destSugg.map((p, i) => (

                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                          onClick={() => {
                            setDestination(suggestion(p))
                            setDestLat(p.lat)
                            setDestLong(p.lng)
                            setDestSugg([])
                          }}
                        >
                          {/* Content here */}
                          <MapPin size={13} className="text-zinc-400 flex-shrink-0" />

                          <span className="text-sm text-zinc-800 font-medium truncate">
                            {suggestion(p)}
                          </span>

                          <ChevronRight
                            size={13}
                            className="text-zinc-300 flex-shrink-0 ml-auto"
                          />

                        </motion.div>

                      ))
                    }

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className={`${canSearch ? 'h-12 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2 cursor-pointer' : 'h-12 cursor-pointer rounded-xl bg-black/30 text-white font-medium flex items-center justify-center gap-2'}`}
              onClick={getVehicle}

              disabled = {!canSearch }
            >
              <Search size={18} />
              Search
            </button>

          </div>
        </div>

        {/* Main Section */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Vehicle Section */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm p-5 h-[750px]">
            <h2 className="text-xl font-semibold mb-5">
              Available Vehicles
            </h2>

            <div className="overflow-y-auto h-[650px] pr-2">
              {!hasSearched && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-7xl mb-5">
                    🚌
                  </div>

                  <h3 className="text-xl font-semibold">
                    Find your ride
                  </h3>

                  <p className="text-zinc-500 mt-3 max-w-xs">
                    Search a route and discover buses travelling
                    between your source and destination.
                  </p>

                  <p className="text-zinc-400 text-sm mt-6">
                    Enter source and destination to start tracking.
                  </p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-zinc-300 border-t-black rounded-full animate-spin" />

                  <p className="mt-5 text-zinc-500">
                    Searching vehicles...
                  </p>
                </div>
              )}

              {!loading &&
                hasSearched &&
                vehicles.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">
                      😔
                    </div>

                    <h3 className="text-xl font-semibold">
                      No Vehicles Found
                    </h3>

                    <p className="text-zinc-500 mt-3">
                      No active vehicles are currently available
                      on this route.
                    </p>
                  </div>
                )}

              {!loading &&
                vehicles.length > 0 &&
                vehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    onClick={() => {
                      if (!vehicle.routeId || !vehicle.routeId.locations
                      ) {
                        return;
                      }

                      setVehicleId(vehicle._id);

                      setVehicleNumber(
                        vehicle.vehicleNumber
                      );

                      const routeCoords: [
                        number,
                        number
                      ][] =
                        vehicle.routeId.locations.map(
                          (loc) => [
                            loc.latitude,
                            loc.longitude,
                          ]
                        );

                      setCoordinates(routeCoords);
                    }}
                    className={`border rounded-2xl p-4 mb-4 cursor-pointer transition
            ${vehicleId === vehicle._id
                        ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                        : "border-gray-200 hover:shadow-md"
                      }`}
                  >
                    <div>
                    <h3 className="font-semibold text-lg">
                      {vehicle.vehicleNumber}
                    </h3>

                    <p className="text-sm text-zinc-500 mt-3">
                      {vehicle.routeId?.locations?.[0]?.name}
                      {" → "}
                      {
                        vehicle.routeId?.locations?.[
                          vehicle.routeId.locations.length - 1
                        ]?.name
                      }
                    </p>

                    <p className="text-sm text-zinc-600 mt-2">
                      {vehicle.routeId?.distanceInKm ?? "--"} km
                      •
                      {" "}
                      {vehicle.routeId?.estimatedDurationInMinutes ?? "--"} mins
                    </p>
                  </div>

                    <button
                      className={`mt-5 w-full h-11 rounded-xl font-medium transition cursor-pointer
              ${vehicleId === vehicle._id
                          ? "bg-blue-600 text-white"
                          : "bg-black text-white"
                        }`}
                    >
                      {vehicleId === vehicle._id
                        ? "Tracking Vehicle"
                        : "Track Vehicle"}
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-5">
              Live Map
            </h2>

            <div className="h-[650px] rounded-2xl overflow-hidden bg-zinc-100">
              {vehicleId ? (
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
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <div className="text-7xl mb-4">
                    🗺️
                  </div>

                  <p>Select a vehicle to start tracking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}