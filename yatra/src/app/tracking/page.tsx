/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import axios from "axios";
import { Search, MapPin, Bus, Clock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig, number } from 'motion/react';
import vehicles from '../../components/vehicles';

export default function page() {
  // eslint-disable-next-line prefer-const
  const vehicles = [
    {
      id: 1,
      type: "Bus",
      number: "JH01AB1234",
      route: "Ranchi → Patna",
      fare: 350,
      eta: "25 mins",
      availableSeats: 18,
      status: "Running",
    },
    {
      id: 2,
      type: "Auto",
      number: "JH01CD5678",
      route: "Ranchi → Patna",
      fare: 80,
      eta: "40 mins",
      availableSeats: 3,
      status: "Running",
    },
  ];

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

  const vehicleTypes = [
    { value: "all", label: "All Vehicles" },
    { value: "bus", label: "Bus" },
    { value: "auto", label: "Auto" },
    { value: "cab", label: "Cab" },
    { value: "bike", label: "Bike" },
    ,
  ];

  const [source, setSource] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [srcLat, setSrcLat] = useState<number | null>()
  const [destLat, setDestLat] = useState<number | null>()
  const [srcLong, setSrcLong] = useState<number | null>()
  const [destLong, setDestLong] = useState<number | null>()
  const [vehicleNumber, setVehicleNumber] = useState<number | null>()
  const [srcSugg, setSrcSugg] = useState<Place[]>([])
  const [destSugg, setDestSugg] = useState<Place[]>([])
  const [vehicle, setVechicleTypes] = useState<string>("All Vehicles")
  const [route, setRoute] = useState<[number, number][]>()
  const canSearch = !!(source && destination && srcLat && srcLong && destLat && destLong)

  // const getVehicleRoute = async () =>{
  //   try {
  //       const {data} = await axios.get(`api/track/getroute`,route)
  //   } catch (error) {
      
  //   }
  // }
  // useEffect(()=>{

  // })
  
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
  const getVehicles = async (source, destination) => {

  }




  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6">
          <h1 className="text-2xl font-bold mb-5">
            Track Your Vehicle
          </h1>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <select
                value={vehicle}
                onChange={(e) => setVechicleTypes(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-black bg-white"
              >
                {
                  vehicleTypes.map((type) => type && (

                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
              </select>
            </div>
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

            <button className={`${canSearch ? 'h-12 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2' : 'h-12 rounded-xl bg-black/30 text-white font-medium flex items-center justify-center gap-2'}`}
              onClick={getVehicles}

              disabled={!canSearch}
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Vehicles */}
          <div className="bg-white rounded-3xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-5">
              Available Vehicles
            </h2>
            <div className="space-y-4 max-h-[650px] overflow-y-auto">

              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bus size={20} />

                        <h3 className="font-semibold">
                          {vehicle.number}
                        </h3>
                      </div>

                      <p className="text-gray-500 mt-2">
                        {vehicle.route}
                      </p>

                      <div className="mt-2 text-sm font-medium text-zinc-700">
                        Fare: ₹{vehicle.fare}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        Seats Available: {vehicle.availableSeats}
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Clock size={16} />
                        ETA: {vehicle.eta}
                      </div>

                      <div className="mt-2">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-5 w-full h-11 rounded-xl bg-black text-white font-medium">
                    Track Vehicle
                  </button>
                </div>
              ))}

            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4">
              Live Map
            </h2>

            <div className="h-[650px] rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">

              {/* Replace with Leaflet */}
              <div className="text-center text-gray-500">
                <MapPin
                  size={45}
                  className="mx-auto mb-4"
                />

                <p className="font-medium">
                  Leaflet Map Goes Here
                </p>

                <p className="text-sm mt-2">
                  Route Polyline + Live Bus Marker
                </p>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}