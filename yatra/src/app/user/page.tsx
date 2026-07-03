"use client";

/**
 * User Dashboard / Profile page
 * -------------------------------------------------------------
 * Drop this file in: src/app/dashboard/profile/page.tsx
 * (or any route folder you like — it's fully self-contained).
 *
 * Uses the same theme tokens as the rest of YatraX
 * (bg-background, bg-card, text-foreground, text-muted-foreground,
 * border-border, bg-primary/text-primary-foreground, bg-success,
 * bg-warning, bg-destructive) so it automatically supports the
 * Dark/Light toggle with no extra work.
 *
 * Everything below (verification, save, cancel booking) is wired
 * to local mock state with clearly marked TODOs — swap those for
 * your real API calls / redux actions.
 */

import { useEffect, useState } from "react";
import {
  User, Mail, Phone, ShieldCheck, ShieldAlert, Camera, MapPin, Calendar, Clock, Ticket, X, CircleDashed, Bus, ChevronRight,
} from "lucide-react";
import axios from "axios";
import { ParamsOf } from '../../../.next/dev/types/routes';
import { useSession } from "next-auth/react";
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from "react-redux";


type TabKey = "profile" | "upcoming" | "history";

interface BookingItem {
  id: string;
  vehicleName: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seat: string;
  fare: number;
  status: "upcoming" | "completed" | "cancelled";
}


const MOCK_BOOKINGS: BookingItem[] = [
  {
    id: "YTX-90231",
    vehicleName: "YatraX Express Bus",
    from: "Ranchi",
    to: "Patna",
    date: "12 Jul 2026",
    time: "08:30 AM",
    seat: "A4",
    fare: 650,
    status: "upcoming",
  },
  {
    id: "YTX-90188",
    vehicleName: "YatraX City Cab",
    from: "Ranchi",
    to: "Jamshedpur",
    date: "20 Jul 2026",
    time: "06:00 PM",
    seat: "-",
    fare: 1200,
    status: "upcoming",
  },
  {
    id: "YTX-88450",
    vehicleName: "YatraX Express Bus",
    from: "Ranchi",
    to: "Kolkata",
    date: "02 Jun 2026",
    time: "09:00 AM",
    seat: "B2",
    fare: 950,
    status: "completed",
  },
  {
    id: "YTX-87310",
    vehicleName: "YatraX Sleeper Bus",
    from: "Ranchi",
    to: "Delhi",
    date: "18 May 2026",
    time: "10:15 PM",
    seat: "S12",
    fare: 1800,
    status: "cancelled",
  },
];


function StatusBadge({ status }: { status: BookingItem["status"] }) {
  const map = {
    upcoming: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  } as const;

  const label = {
    upcoming: "Upcoming",
    completed: "Completed",
    cancelled: "Cancelled",
  } as const;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}

function VerifyBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
      <ShieldCheck size={13} />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
      <ShieldAlert size={13} />
      Not verified
    </span>
  );
}

function OtpModal({ open, target, channel, onClose, onVerified, }: {
  open: boolean;
  target: string;
  channel: "email" | "phone";
  onClose: () => void;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [id ,setUserId] = useState("")

  
  const {data : session} = useSession()
  useEffect(() => {
    if(!id){
      const userId = session?.user?.id
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(userId)
    }
  })

  if (!open) return null;

  const handleVerify = async () => {
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);

    // TODO: replace with your real verify-otp API call
    if (channel === "email") await axios.post("api/auth/verify-email", {
      params: {
        otp:otp,
        id:id,
        role:"user"
        },
    });
    if (channel === "phone") await axios.post("api/auth/verify-phone", {
      params: {
        otp:otp,
        id:id,
        role:"user"
        },
    });

    setLoading(false);
    onVerified();
    setOtp("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
            {channel === "email" ? <Mail size={20} /> : <Phone size={20} />}
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Verify your {channel === "email" ? "email" : "phone number"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit code sent to{" "}
            <span className="text-foreground font-medium">{target}</span>
          </p>
        </div>

        <input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="••••••"
          inputMode="numeric"
          className="w-full h-12 rounded-xl border border-border bg-background text-center text-lg tracking-[0.4em] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-11 mt-5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <CircleDashed size={18} className="animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        <button
          onClick={() => {
            /* TODO: call your resend-otp API */
          }}
          className="w-full text-sm text-muted-foreground hover:text-foreground mt-3 cursor-pointer"
        >
          Didn&apos;t get a code? Resend
        </button>
      </div>
    </div>
  );
}


// Profile section

function ProfileSection() {
  const dispath = useDispatch<AppDispatch>()
  
  const { userData } = useSelector(
      (state: RootState) => state.user
    );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [modal, setModal] = useState<null | "email" | "phone">(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [loading, setLoading] = useState(false)
  const [id ,setUserId] = useState("")

  
  const {data : session} = useSession()
  useEffect(() => {
    if(!id){
      const userId = session?.user?.id
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(userId)
    }
  })


  const handleSendotp = async (channel: "email" | "phone") => {
    try {
      setLoading(true);

      const payload = {
        userId: id,
        mobileNumber: phone,
        email,
        role: "user",
      };

      if (channel === "phone") {
        await axios.post("/api/auth/send-phone-otp", payload);
        setModal("phone");
      }

      if (channel === "email") {
        await axios.post("/api/auth/send-email-otp", payload);
        setModal("email");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with your real update-profile API call
    await new Promise((res) => setTimeout(res, 800));
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-hover cursor-pointer">
            <Camera size={13} className="text-foreground" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{userData ? userData.name : "Username"}</h2>
          <p className="text-sm text-muted-foreground">
            Member since Jan 2025
          </p>
        </div>
      </div>

      {/* Editable fields */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Personal details
        </h3>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Full name
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <User size={16} className="text-muted-foreground shrink-0" />
              <input
                value={name}
                placeholder={userData?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <VerifyBadge verified={emailVerified} />
            </div>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <input
                value={email}
                placeholder={userData?.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              {!emailVerified && (
                <button
                  onClick={() => {
                    handleSendotp("email")
                  }}
                  className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 cursor-pointer"
                >
                   {loading ? <CircleDashed size={16} className="animate-spin" /> : "Verify"}
                
                </button>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">
                Phone number
              </label>
              <VerifyBadge verified={phoneVerified} />
            </div>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <input
                value={phone}
                placeholder={userData?.mobileNumber}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneVerified(false);
                }}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              {!phoneVerified && (
                <button
            
                  onClick={() => {
                    handleSendotp("phone")
                  }}
                  className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 cursor-pointer"
                >
                  {loading ? <CircleDashed size={16} className="animate-spin" /> : "Verify"}

                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <CircleDashed size={16} className="animate-spin" />
            ) : (
              "Save changes"
            )}
          </button>
          {savedMsg && (
            <span className="text-sm text-success">Profile updated</span>
          )}
        </div>
      </div>

      <OtpModal
        open={modal === "email"}
        channel="email"
        target={email}
        onClose={() => setModal(null)}
        onVerified={() => {
          setEmailVerified(true);
          setModal(null);
        }}
      />
      <OtpModal
        open={modal === "phone"}
        channel="phone"
        target={phone}
        onClose={() => setModal(null)}
        onVerified={() => {
          setPhoneVerified(true);
          setModal(null);
        }}
      />
    </div>
  );
}


// Booking card (shared between upcoming + history lists)


function BookingCard({ booking }: { booking: BookingItem }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
        <Bus size={18} className="text-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-foreground">
            {booking.vehicleName}
          </h4>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
          <MapPin size={13} />
          <span>
            {booking.from} → {booking.to}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {booking.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {booking.time}
          </span>
          {booking.seat !== "-" && (
            <span className="flex items-center gap-1">
              <Ticket size={12} />
              Seat {booking.seat}
            </span>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 sm:text-right shrink-0">
        <p className="font-semibold text-foreground">₹{booking.fare}</p>
        <button className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-0.5 cursor-pointer">
          {booking.status === "upcoming" ? "View ticket" : "View details"}
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function BookingList({ items }: { items: BookingItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <Ticket size={28} className="mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}


// Page

export default function UserDashboardProfilePage() {
  const [tab, setTab] = useState<TabKey>("profile");

  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "upcoming");
  const history = MOCK_BOOKINGS.filter((b) => b.status !== "upcoming");

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "profile", label: "Profile" },
    { key: "upcoming", label: "Upcoming bookings", count: upcoming.length },
    { key: "history", label: "Booking history", count: history.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            My account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile, verification and bookings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${tab === t.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({t.count})
                </span>
              )}
              {tab === t.key && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileSection />}
        {tab === "upcoming" && <BookingList items={upcoming} />}
        {tab === "history" && <BookingList items={history} />}
      </div>
    </div>
  );
}
