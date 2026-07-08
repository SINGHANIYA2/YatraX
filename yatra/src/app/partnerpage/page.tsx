/* eslint-disable react-hooks/set-state-in-effect */
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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  ChevronLeft,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
} from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { setVehicleData } from "@/redux/vehicleSlice"


// Types


type TabKey = "profile" | "vehicle" | "trips" | "bookings" | "earnings";

interface PayoutItem {
  id: string;
  date: string;
  trips: number;
  amount: number;
  status: "paid" | "pending";
}

interface VehicleDetail {
  vehicleType: keyof typeof VEHICLE_ICONS;
  vehicleNumber: string;
  model: string;
  capacity: string;
  insuranceExpiry: string;
  rcVerified: boolean;
  insuranceVerified: boolean;
  rcDocumentUrl: string;
  insuranceDocumentUrl: string;
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------
// Profile tab (personal details + verification + password)
// ---------------------------------------------------------------

function ProfileTab() {
  const { partnerData } = useSelector((state: RootState) => state.partner);

  const initialValues = {
    name: partnerData?.name || "Ravi Kumar",
    email: partnerData?.email || "Ramu@example.com",
    phone: partnerData?.phone || "+91 98765 43210",
    address: "Ranchi, Jharkhand",
    licenseNumber: "JH-14 2019 0045821",
  };

  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [phone, setPhone] = useState(initialValues.phone);
  const [address, setAddress] = useState(initialValues.address);
  const [licenseNumber, setLicenseNumber] = useState(initialValues.licenseNumber);

  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // ---- Change password state ----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSavedMsg, setPwSavedMsg] = useState(false);

  // ---- Password visibility toggles ----
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Id ,setUserId] = useState("")
  
const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {data : session} = useSession()
  useEffect(() => {
    if(!Id){
      // console.log(partnerData)

      const userId = session?.user?.id
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(userId)
    }
  })

  const handleEditClick = () => {
    setIsEditing(true);
    setSavedMsg(false);
  };

  const handleCancel = () => {
    // revert any unsaved edits
    setName(initialValues.name);
    setEmail(initialValues.email);
    setPhone(initialValues.phone);
    setAddress(initialValues.address);
    setLicenseNumber(initialValues.licenseNumber);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
        userId: Id,
        phone : phone || partnerData?.phone,
        email : email || partnerData?.email,
        role: "partner",
      };

    const {data} = await axios.post("api/auth/save",payload);

    setSaving(false);
    setSavedMsg(true);
    setIsEditing(false);
  };

  const handlePasswordSave = async () => {
    setPwError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirm password do not match.");
      return;
    }

    setPwSaving(true);
  
    const payload = {
      id : Id,
      role: "partner",
      newPassword,
      currentPassword
    }
    
    await axios.post("api/update-password",payload)

    setPwSaving(false);
    setPwSavedMsg(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setTimeout(() => setPwSavedMsg(false), 2500);
  };


  const handleSendotp = async (channel: "email" | "phone") => {
    try {
      setError("")
      setLoading(true);

      const payload = {
        userId: Id,
        mobileNumber: phone,
        email,
        role: "user",
      };
      // console.log("sending otp")
      if (channel === "phone") {
        await axios.post("/api/auth/send-phone-otp", payload);
      }
      if (channel === "email") {
        await axios.post("/api/auth/send-email-otp", payload);
     
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error)
      setLoading(false);
    }
  };
  // Shared input classes so disabled (view-only) state looks intentional
  const inputWrapClass = (disabled: boolean) =>
    `flex items-center gap-2 h-12 rounded-xl border border-border px-4 ${
      disabled ? "bg-secondary/40" : "bg-background"
    }`;

  const inputClass = (disabled: boolean) =>
    `w-full bg-transparent text-sm focus:outline-none ${
      disabled ? "text-muted-foreground cursor-default" : "text-foreground"
    }`;

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
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Personal details
          </h3>

          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="h-9 px-4 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-hover transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <User size={14} />
              Edit profile
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Full name
            </label>
            <div className={inputWrapClass(!isEditing)}>
              <User size={16} className="text-muted-foreground shrink-0" />
              <input
                value={name}
                disabled={!isEditing}
                placeholder={partnerData?.name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass(!isEditing)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <VerifyBadge verified={emailVerified} />
            </div>
            <div className={inputWrapClass(!isEditing)}>
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <input
                value={email}
                disabled={!isEditing}
                placeholder={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                className={inputClass(!isEditing)}
              />
              {isEditing && !emailVerified && (
                <button className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 cursor-pointer"
                  onClick={() => handleSendotp("email")}
                >
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
            <div className={inputWrapClass(!isEditing)}>
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <input
                value={phone}
                disabled={!isEditing}
                placeholder={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneVerified(false);
                }}
                className={inputClass(!isEditing)}
              />
              {isEditing && !phoneVerified && (
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
            <div className={inputWrapClass(!isEditing)}>
              <MapPin size={16} className="text-muted-foreground shrink-0" />
              <input
                value={address}
                disabled={!isEditing}
                placeholder="Sherghati,Gaya,Bihar"
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass(!isEditing)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Driving license number
            </label>
            <div className={inputWrapClass(!isEditing)}>
              <FileText size={16} className="text-muted-foreground shrink-0" />
              <input
                value={licenseNumber}
                disabled={!isEditing}
                placeholder={partnerData?.dlNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className={inputClass(!isEditing)}
              />
            </div>
          </div>
        </div>

        {isEditing && (
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
            <button
              onClick={handleCancel}
              disabled={saving}
              className="h-11 px-6 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-hover transition-colors cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
            {savedMsg && <span className="text-sm text-success">Profile updated</span>}
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Change password
        </h3>

        <div className="space-y-5 max-w-md">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Current password
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              New password
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Confirm new password
            </label>
            <div className="flex items-center gap-2 h-12 rounded-xl border border-border bg-background px-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {pwError && <p className="text-sm text-destructive">{pwError}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handlePasswordSave}
              disabled={pwSaving}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              {pwSaving ? (
                <CircleDashed size={16} className="animate-spin" />
              ) : (
                "Update password"
              )}
            </button>
            {pwSavedMsg && (
              <span className="text-sm text-success">Password updated</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Vehicle tab (read-only — vehicle is fixed by backend, not editable)
// ---------------------------------------------------------------

function VehicleTab() {
  const dispatch = useDispatch<AppDispatch>();

  // Which vehicle belongs to this partner
  const { partnerData } = useSelector((state: RootState) => state.partner);
  const assignedVehicleId = partnerData?.assignedVehicleId as string | undefined;

  // Real vehicle data, once fetched, lives in the vehicle slice
  const { vehicleData } = useSelector((state: RootState) => state.vehicle);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignedVehicleId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await axios.get(`/api/vehicle/${assignedVehicleId}`);

        if (!cancelled) {
          dispatch(setVehicleData(data.vehicle));
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.message ?? err.message ?? "Failed to load vehicle");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchVehicle();

    return () => {
      cancelled = true;
    };
  }, [assignedVehicleId, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <CircleDashed size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Fallback mock data — only used until a real vehicle has been fetched
  // TODO: your Vehicle schema (vehicle.models.ts) doesn't currently store
  // insuranceExpiry / rcVerified / insuranceVerified as booleans/dates —
  // it only stores documents.rc / documents.insurance as IFile. Adjust the
  // backend schema (or this mapping) once those fields exist for real.
  const vehicle: VehicleDetail = vehicleData
    ? {
        vehicleType: (vehicleData.vehicleType as VehicleDetail["vehicleType"]) ?? "car",
        vehicleNumber: vehicleData.vehicleNumber ?? "—",
        model: vehicleData.model ?? vehicleData.brand ?? "—",
        capacity: vehicleData.seatingCapacity
          ? `${vehicleData.seatingCapacity} seats`
          : "—",
        insuranceExpiry: vehicleData.scheduledEndAt
          ? String(vehicleData.scheduledEndAt)
          : new Date().toISOString(),
        rcVerified: !!vehicleData.documents?.rc?.url,
        insuranceVerified: !!vehicleData.documents?.insurance?.url,
        rcDocumentUrl: vehicleData.documents?.rc?.url ?? "",
        insuranceDocumentUrl: vehicleData.documents?.insurance?.url ?? "",
      }
    : {
        vehicleType: "car",
        vehicleNumber: "JH14 AB 4521",
        model: "Maruti Suzuki Dzire",
        capacity: "4 seats",
        insuranceExpiry: "2027-02-14",
        rcVerified: true,
        insuranceVerified: false,
        rcDocumentUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/rc-doc.pdf",
        insuranceDocumentUrl:
          "https://res.cloudinary.com/your-cloud-name/image/upload/v1/insurance-doc.pdf",
      };

  const Icon = VEHICLE_ICONS[vehicle.vehicleType] ?? Car;

  const formattedExpiry = new Date(vehicle.insuranceExpiry).toLocaleDateString(
    "en-IN",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error} — showing sample data below.
        </div>
      )}

      {/* Summary */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
          <Icon size={26} className="text-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{vehicle.model}</h2>
          <p className="text-sm text-muted-foreground">{vehicle.vehicleNumber}</p>
        </div>
      </div>

      {/* Vehicle details — read only */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Vehicle details
          </h3>
          <span className="text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-full">
            Managed by YatraX
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <DetailRow label="Vehicle number" value={vehicle.vehicleNumber} />
          <DetailRow label="Model" value={vehicle.model} />
          <DetailRow label="Seating capacity" value={vehicle.capacity} />
          <DetailRow label="Insurance expiry" value={formattedExpiry} />
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Vehicle details are fixed and can only be updated by YatraX support.
          Contact support if any of this information is incorrect.
        </p>
      </div>

      {/* Documents */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Documents
        </h3>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">
                Registration Certificate (RC)
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <VerifyBadge verified={vehicle.rcVerified} />
              {vehicle.rcDocumentUrl ? (
                <a
                  href={vehicle.rcDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover cursor-pointer"
                >
                  View document
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">Not uploaded</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Insurance</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <VerifyBadge verified={vehicle.insuranceVerified} />
              {vehicle.insuranceDocumentUrl ? (
                <a
                  href={vehicle.insuranceDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover cursor-pointer"
                >
                  View document
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">Not uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Add this component into page.tsx, alongside the other tabs ---

function BookingHistoryTab() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get("/api/booking/history");
        setBookings(data.bookings ?? []);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <CircleDashed size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Booking history
          </h3>
          <span className="text-xs text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-full">
            Read-only — tickets are issued by YatraX admin
          </span>
        </div>

        {bookings.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No bookings yet.
          </p>
        )}

        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {b.boardStopName} → {b.alightStopName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {b.seatsBooked} passenger{b.seatsBooked !== 1 ? "s" : ""} ·{" "}
                  {b.departureDateTime
                    ? new Date(b.departureDateTime).toLocaleString("en-IN")
                    : new Date(b.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-foreground">
                  ₹{b.totalFare?.toLocaleString()}
                </p>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    b.paymentStatus === "paid"
                      ? "bg-success/10 text-success"
                      : b.paymentStatus === "pending"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {b.paymentStatus}
                </span>

                {b.bookingStatus === "cancelled" && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function TripsTab() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingOn, setActingOn] = useState<string | null>(null); // tripId currently being started/completed

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("/api/trip/mine");
      setTrips(data.trips ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load today's trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAction = async (tripId: string, action: "start" | "complete") => {
    try {
      setActingOn(tripId);
      const endpoint =
        action === "complete"
          ? `/api/trip/${tripId}/complete-and-reverse` // marks completed AND spins up the return leg
          : `/api/trip/${tripId}/start`;
      await axios.post(endpoint);
      await fetchTrips(); // refresh statuses after the action — the new return trip will now show up too
    } catch (err: any) {
      setError(err?.response?.data?.message ?? `Failed to ${action} trip`);
    } finally {
      setActingOn(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <CircleDashed size={22} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-5">
          Today&apos;s trips
        </h3>

        {trips.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No trips scheduled for today.
          </p>
        )}

        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.tripId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {trip.stops[0]} → {trip.stops[trip.stops.length - 1]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Departs{" "}
                  {new Date(trip.departureDateTime).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {trip.seatsBooked}/{trip.seatingCapacity} seats booked
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    trip.status === "running"
                      ? "bg-success/10 text-success"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {trip.status}
                </span>

                {trip.status === "scheduled" && (
                  <button
                    onClick={() => handleAction(trip.tripId, "start")}
                    disabled={actingOn === trip.tripId}
                    className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors text-sm font-medium cursor-pointer disabled:opacity-60"
                  >
                    {actingOn === trip.tripId ? (
                      <CircleDashed size={14} className="animate-spin" />
                    ) : (
                      "Start trip"
                    )}
                  </button>
                )}

                {trip.status === "running" && (
                  <button
                    onClick={() => handleAction(trip.tripId, "complete")}
                    disabled={actingOn === trip.tripId}
                    className="h-9 px-4 rounded-xl border border-border text-foreground hover:bg-hover transition-colors text-sm font-medium cursor-pointer disabled:opacity-60"
                    title="Marks this trip complete and immediately starts the return trip on the reversed route"
                  >
                    {actingOn === trip.tripId ? (
                      <CircleDashed size={14} className="animate-spin" />
                    ) : (
                      "Complete & start return"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// Earnings tab
// ---------------------------------------------------------------

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


export default function page() {
  const router = useRouter();
  const { data: session } = useSession();

  const [tab, setTab] = useState<TabKey>("profile");
  const [online, setOnline] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  const tabs: { key: TabKey; label: string }[] = [
       { key: "profile", label: "Profile" },
       { key: "vehicle", label: "Vehicle" },
       { key: "trips", label: "Trips" },
       { key: "bookings", label: "Bookings" },
       { key: "earnings", label: "Earnings" },
     ];


  const handleOnline = async (nextStatus: boolean) => {
    const partnerId = session?.user?.id;

    if (!partnerId) {
      setStatusError("Not signed in");
      setOnline((prev) => !prev); // revert the optimistic flip
      return;
    }

    setStatusLoading(true);
    setStatusError("");

    try {
      await axios.post("/api/partner/toggle-status", {
        partnerId,
        isOnline: nextStatus,
      });
    } catch (error: any) {
      // Revert the UI back if the server call fails
      setOnline((prev) => !prev);
      setStatusError(
        error?.response?.data?.message ?? "Failed to update status"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="h-10 w-10 shrink-0 rounded-full border border-border flex items-center justify-center hover:bg-hover transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Partner dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your profile, vehicle and earnings
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => {
                const next = !online;
                setOnline(next); // optimistic UI update
                handleOnline(next); // fire the actual API call
              }}
              disabled={statusLoading}
              className={`shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full text-sm font-medium cursor-pointer transition-colors disabled:opacity-60 ${
                online
                  ? "bg-success/10 text-success"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {statusLoading ? (
                <CircleDashed size={14} className="animate-spin" />
              ) : (
                <Power size={14} />
              )}
              {online ? "Online" : "Offline"}
            </button>

            {statusError && (
              <span className="text-xs text-destructive">{statusError}</span>
            )}
          </div>
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
      {tab === "trips" && <TripsTab />}
      {tab === "bookings" && <BookingHistoryTab />}
      {tab === "earnings" && <EarningsTab />}

      </div>
    </div>
  );
}