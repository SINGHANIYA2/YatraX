"use client";

import { motion } from "motion/react";
import { Users, Bus, Map, Target } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      value: "50,000+",
      label: "Happy Passengers",
      icon: Users,
    },
    {
      value: "1,000+",
      label: "Daily Trips",
      icon: Bus,
    },
    {
      value: "500+",
      label: "Routes Across India",
      icon: Map,
    },
    {
      value: "99%",
      label: "Tracking Accuracy",
      icon: Target,
    },
  ];

  return (
    <section className="mt-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#08111F]">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5" />

        <div className="relative grid grid-cols-2 lg:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-5 lg:p-7 border-r border-white/10 last:border-r-0"
              >
                <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Icon size={28} className="text-blue-400" />
                </div>

                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-blue-400">
                    {stat.value}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </div>

              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}