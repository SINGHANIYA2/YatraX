/* eslint-disable react-hooks/rules-of-hooks */
"use client";

/**
 * Partner Dashboard
 * -------------------------------------------------------------
 * Same theme tokens as the rest of YatraX (bg-background, bg-card,
 * text-foreground, text-muted-foreground, border-border, bg-primary /
 * text-primary-foreground, bg-success / bg-warning / bg-destructive)
 * so it automatically supports the Dark/Light toggle.
 *
 * Wired to local mock state with // TODO markers wherever you'd hook
 * up your real API / redux actions.
 */

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Car,
  Bike,
  Truck,
  Wallet,
  Star,
  TrendingUp,
  Calendar,
  CircleDashed,
  Camera,
  Power,
  ChevronRight,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

type TabKey = "profile" | "vehicle" | "earnings";

interface PayoutItem {
  id: string;
  date: string;
  trips: number;
  amount: number;
  status: "paid" | "pending";
}

// ---------------------------------------------------------------
// Mock data — replace with your real API data
// ---------------------------------------------------------------

const MOCK_PAYOUTS: PayoutItem[] = [
  { id: "PO-3391", date: "01 Jul 2026", trips: 42, amount: 18400, status: "paid" },
  { id: "PO-3312", date: "24 Jun 2026", trips: 37, amount: 15650, status: "paid" },
  { id: "PO-3288", date: "17 Jun 2026", trips: 29, amount: 12100, status: "pending" },
];

const VEHICLE_ICONS = { bike: Bike, car: Car, truck: Truck, bus: Truck } as const;

// ---------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------

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

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
        <Icon size={17} className="text-foreground" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground mt-0.5">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------
// Profile tab (personal details + verification)
// ---------------------------------------------------------------

function ProfileTab() {
  const { partnerData } = useSelector((state: RootState) => state.partner);

  const [name, setName] = useState(partnerData?.name || "Ravi Kumar");
  const [email, setEmail] = useState(partnerData?.email || "ravi.partner@example.com");
  const [phone, setPhone] = useState(partnerData?.phone || "+91 98765 43210");
  const [address, setAddress] = useState("Ranchi, Jharkhand");
  const [licenseNumber, setLicenseNumber] = useState("JH-14 2019 0045821");

  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with your real update-partner-profile API call
    await new Promise((res) => setTimeout(res, 800));
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {partnerData?.name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-hover cursor-pointer">
            <Camera size={13} className="text-foreground" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{partnerData?.name}</h2>
          <p className="text-sm text-muted-foreground">Partner since Mar 2025</p>
        </div>
      </div>

      {/* Personal details */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Personal details
        </h3>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Full name
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <User size={16} className="text-muted-foreground shrink-0" />
              <input
                value={name}
                placeholder={partnerData?.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <VerifyBadge verified={emailVerified} />
            </div>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <input
                value={email}
                placeholder={partnerData?.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              {!emailVerified && (
                <button className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 cursor-pointer">
                  Verify
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Phone number</label>
              <VerifyBadge verified={phoneVerified} />
            </div>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <input
                value={phone}
                placeholder={partnerData?.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneVerified(false);
                }}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              {!phoneVerified && (
                <button className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 cursor-pointer">
                  Verify
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Address
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <MapPin size={16} className="text-muted-foreground shrink-0" />
              <input
                value={address}
                placeholder="Sherghati,Gaya,Bihar"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Driving license number
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <FileText size={16} className="text-muted-foreground shrink-0" />
              <input
                value={licenseNumber}
                placeholder={partnerData?.dlNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
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
          {savedMsg && <span className="text-sm text-success">Profile updated</span>}
        </div>
      </div>
    </div>
  );
}

// Vehicle tab

function VehicleTab() {
  const [vehicleType] = useState<keyof typeof VEHICLE_ICONS>("car");
  const [vehicleNumber, setVehicleNumber] = useState("JH14 AB 4521");
  const [model, setModel] = useState("Maruti Suzuki Dzire");
  const [capacity, setCapacity] = useState("4 seats");
  const [rcVerified] = useState(true);
  const [insuranceVerified] = useState(false);
  const [insuranceExpiry, setInsuranceExpiry] = useState("2027-02-14");

  const Icon = VEHICLE_ICONS[vehicleType];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
          <Icon size={26} className="text-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{model}</h2>
          <p className="text-sm text-muted-foreground">{vehicleNumber}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Vehicle details
        </h3>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Vehicle number
            </label>
            <input
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Model
            </label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Seating capacity
            </label>
            <input
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Insurance expiry
            </label>
            <input
              type="date"
              value={insuranceExpiry}
              onChange={(e) => setInsuranceExpiry(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <button className="h-11 px-6 mt-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer">
          Save changes
        </button>
      </div>

      {/* Documents */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Documents
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">
                Registration Certificate (RC)
              </span>
            </div>
            <VerifyBadge verified={rcVerified} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Insurance</span>
            </div>
            <VerifyBadge verified={insuranceVerified} />
          </div>
        </div>
      </div>
    </div>
  );
}


// Earnings tab


function EarningsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Total earnings" value="₹1,26,400" />
        <StatCard icon={TrendingUp} label="This month" value="₹18,400" sub="+12% vs last month" />
        <StatCard icon={Calendar} label="Total trips" value="284" />
        <StatCard icon={Star} label="Rating" value="4.8" sub="from 210 reviews" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Recent payouts
        </h3>

        <div className="space-y-3">
          {MOCK_PAYOUTS.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{p.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.date} · {p.trips} trips
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-foreground">
                  ₹{p.amount.toLocaleString()}
                </p>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    p.status === "paid"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {p.status === "paid" ? "Paid" : "Pending"}
                </span>
                <ChevronRight size={14} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------

export default function page() {
    
  const [tab, setTab] = useState<TabKey>("profile");
  const [online, setOnline] = useState(true);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "vehicle", label: "Vehicle" },
    { key: "earnings", label: "Earnings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Partner dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your profile, vehicle and earnings
            </p>
          </div>

          <button
            onClick={() => setOnline((v) => !v)}
            className={`shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium cursor-pointer transition-colors ${
              online
                ? "bg-success/10 text-success"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <Power size={14} />
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors ${
                tab === t.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {tab === "profile" && <ProfileTab />}
        {tab === "vehicle" && <VehicleTab />}
        {tab === "earnings" && <EarningsTab />}
      </div>
    </div>
  );
}