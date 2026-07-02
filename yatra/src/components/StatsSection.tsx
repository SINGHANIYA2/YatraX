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
  <div
    className="
      relative overflow-hidden rounded-3xl
      border border-border/40
      bg-background dark:bg-card
      shadow-lg
    "
  >
    <div
      className="
        absolute inset-0
        bg-gradient-to-r
        from-primary/[0.03]
        via-transparent
        to-primary/[0.03]
      "
    />

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
            className="
              flex items-center gap-4
              p-5 lg:p-7
              border-r border-border/20
              last:border-r-0
              hover:bg-accent/40
              transition-all duration-300
            "
          >
            <div
              className="
                h-14 w-14 rounded-2xl
                bg-primary/10
                dark:bg-primary/20
                flex items-center justify-center
                shrink-0
              "
            >
              <Icon size={28} className="text-primary" />
            </div>

            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                {stat.value}
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
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