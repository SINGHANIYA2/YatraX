"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Car,
  User,
  Shield,
  Clock3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "user" | "partner" | "admin";
  read: boolean;
  createdAt: string;
}

export default function NotificationPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    // Replace with API call
    setNotifications([
      {
        _id: "1",
        title: "Booking Confirmed",
        message:
          "Your booking to Ranchi has been confirmed.",
        type: "user",
        read: false,
        createdAt: "2 mins ago",
      },
      {
        _id: "2",
        title: "New Ride Request",
        message:
          "A new ride request is waiting for approval.",
        type: "partner",
        read: false,
        createdAt: "10 mins ago",
      },
      {
        _id: "3",
        title: "Partner Application",
        message:
          "A new partner application has been submitted.",
        type: "admin",
        read: true,
        createdAt: "1 hour ago",
      },
      {
        _id: "4",
        title: "Payment Successful",
        message:
          "₹520 has been credited to your wallet.",
        type: "partner",
        read: true,
        createdAt: "Yesterday",
      },
    ]);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User size={20} />;
      case "partner":
        return <Car size={20} />;
      case "admin":
        return <Shield size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--border),transparent_55%)]" />

      <div className="relative z-10 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-3xl bg-card border border-primary/20 shadow-sm p-6 sm:p-8"
        >
          {/* Header */}

          <div className="relative text-center">
            <button
              onClick={() => router.back()}
              className="absolute left-0 top-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:border-primary transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
              <Bell className="text-primary" size={30} />
            </div>

            <h1 className="text-3xl font-bold text-foreground mt-4">
              Notifications
            </h1>

            <p className="text-muted-foreground mt-2">
              Stay updated with your latest activities
            </p>
          </div>

          {/* Notifications */}

          <div className="mt-10 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell
                  className="mx-auto text-muted-foreground"
                  size={50}
                />

                <h3 className="text-foreground text-xl mt-4">
                  No Notifications
                </h3>

                <p className="text-muted-foreground mt-2">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border p-5 transition ${
                    notification.read
                      ? "border-border bg-card"
                      : "border-primary/30 bg-primary/10"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        notification.read
                          ? "bg-secondary text-muted-foreground"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <h3 className="text-foreground font-semibold">
                          {notification.title}
                        </h3>

                        {!notification.read && (
                          <span className="w-3 h-3 rounded-full bg-primary mt-2" />
                        )}
                      </div>

                      <p className="text-muted-foreground mt-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Clock3 size={14} />
                        {notification.createdAt}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Mark all read */}

          {notifications.length > 0 && (
            <button
              className="mt-8 w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Mark All as Read
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}