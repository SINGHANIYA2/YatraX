"use client";

import { motion } from "motion/react";
import {
  Bus,
  ShieldCheck,
  MapPinned,
  Clock3,
  Users,
  Globe,
  Target,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage(){
  const stats = [
    {
      title: "10K+",
      subtitle: "Happy Travellers",
    },
    {
      title: "500+",
      subtitle: "Daily Trips",
    },
    {
      title: "50+",
      subtitle: "Cities Connected",
    },
    {
      title: "99%",
      subtitle: "Customer Satisfaction",
    },
  ];

  const features = [
    {
      icon: Bus,
      title: "Easy Booking",
      desc: "Book buses, taxis and vans in just a few clicks.",
    },
    {
      icon: MapPinned,
      title: "Real-Time Tracking",
      desc: "Track your vehicle live and know exactly when it arrives.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Safe and encrypted payment experience.",
    },
    {
      icon: Clock3,
      title: "24/7 Support",
      desc: "Dedicated support whenever you need assistance.",
    },
  ];
  const router = useRouter()
  return (
    <div className="bg-[#020617] text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb30,transparent_60%)]" />

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              About <span className="text-blue-500">YatraX</span>
            </h1>

            <p className="text-slate-400 text-lg max-w-3xl mx-auto mt-6">
              YatraX is a smart transportation platform that simplifies
              intercity travel through real-time vehicle tracking,
              seamless booking experiences, and secure management
              for users, partners, and administrators.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-20">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 text-center"
              >
                <h2 className="text-4xl font-bold text-blue-500">
                  {item.title}
                </h2>

                <p className="text-slate-400 mt-2">
                  {item.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-20">

          <h2 className="text-4xl font-bold text-center">
            Why Choose YatraX?
          </h2>

          <p className="text-slate-400 text-center mt-4">
            We make transportation simple, secure and efficient.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Icon className="text-blue-500" size={28} />
                  </div>

                  <h3 className="text-xl font-semibold mt-6">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 mt-3">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Mission Vision */}
        <section className="max-w-7xl mx-auto px-6 py-20">

          <div className="grid lg:grid-cols-2 gap-8">

            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 p-10"
            >
              <Target className="text-blue-500" size={40} />

              <h2 className="text-3xl font-bold mt-6">
                Our Mission
              </h2>

              <p className="text-slate-400 mt-4 leading-8">
                To revolutionize transportation by connecting
                travellers with reliable transport providers
                through technology-driven solutions and real-time
                information.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 p-10"
            >
              <Rocket className="text-blue-500" size={40} />

              <h2 className="text-3xl font-bold mt-6">
                Our Vision
              </h2>

              <p className="text-slate-400 mt-4 leading-8">
                To become India's most trusted transportation
                ecosystem by delivering seamless journeys and
                empowering transport businesses through digital
                transformation.
              </p>
            </motion.div>

          </div>
        </section>

        {/* Story */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">

          <Globe
            className="mx-auto text-blue-500"
            size={50}
          />

          <h2 className="text-4xl font-bold mt-6">
            Connecting Cities, Connecting People
          </h2>

          <p className="text-slate-400 mt-6 max-w-4xl mx-auto leading-8">
            YatraX was created with one goal: to remove the
            complexities of transportation. Whether you're booking
            a bus, reserving a taxi, or tracking your ride in
            real time, YatraX ensures that every journey is
            comfortable, transparent, and efficient.
          </p>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 py-24">

          <div className="rounded-[40px] bg-gradient-to-r from-blue-600 to-blue-500 p-14 text-center">

            <Users className="mx-auto" size={50} />

            <h2 className="text-4xl font-bold mt-6">
              Join the Journey with YatraX
            </h2>

            <p className="mt-4 text-blue-100">
              Experience smarter travel with real-time tracking,
              seamless booking and reliable transportation.
            </p>

            <button className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-2"
              onClick={() => router.push('/booking')}
            >
              Book Your Trip
              <ArrowRight size={18}
              />
            </button>

          </div>

        </section>

      </div>
    </div>
  );
}