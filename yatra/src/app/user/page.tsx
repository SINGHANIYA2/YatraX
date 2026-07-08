/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, Phone, ShieldCheck, ShieldAlert, Camera, MapPin, Calendar, Clock, Ticket, X, CircleDashed, Bus, ChevronRight, Pencil, Lock, ArrowLeft, Eye, EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  const [id, setUserId] = useState("")


  const { data: session } = useSession()
  useEffect(() => {
    if (!id) {
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

    try {
      if (channel === "email") {
        await axios.post("/api/auth/verify-email", {
          userId: id,
          otp,
          role: "user",
        });
      }
      if (channel === "phone") {
        await axios.post("/api/auth/verify-phone", {
          userId: id,
          otp,
          role: "user",
        });
      }
      onVerified();
      setOtp("");
    } catch (err) {
      console.log(err);
      setError("Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };


  const handleResendOtp = async (channel: "email" | "phone") => {
    try {
      setLoading(true);

      const payload = {
        userId: id,
        mobileNumber: Phone,
        Mail,
        role: "user",
      };

      if (channel === "phone") {
        await axios.post("/api/auth/send-phone-otp", payload);
      }

      if (channel === "email") {
        await axios.post("/api/auth/send-email-otp", payload);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
          { loading  ? (
            <CircleDashed size={18} className="animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        <button
          onClick={() => {
            handleResendOtp(channel)
          }}
          className="w-full text-sm text-muted-foreground hover:text-foreground mt-3 cursor-pointer"
        >
          Didn&apos;t get a code? Resend
        </button>
      </div>
    </div>
  );
}


// Change password modal

function ChangePasswordModal({ open, onClose, }: {
  open: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [id, setUserId] = useState("");

  const { data: session } = useSession();
  useEffect(() => {
    if (!id) {
      const userId = session?.user?.id;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserId(userId);
    }
  });

  if (!open) return null;

  const resetAndClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleChangePassword = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {

      await axios.post("/api/update-password", {
        id,
        role: "user",
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={resetAndClose} />

      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6">
        <button
          onClick={resetAndClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
            <Lock size={20} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Change password
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your current password and choose a new one
          </p>
        </div>

        {success ? (
          <div className="text-center py-2">
            <p className="text-sm text-success font-medium mb-4">
              Password updated successfully
            </p>
            <button
              onClick={resetAndClose}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <CircleDashed size={18} className="animate-spin" />
              ) : (
                "Update password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// Profile section

function ProfileSection() {
  const dispath = useDispatch<AppDispatch>()

  const { userData } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [modal, setModal] = useState<null | "email" | "phone">(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [id, setUserId] = useState("")
  const [isEditing, setIsEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { data: session } = useSession()


  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!id) {
      const userId = session?.user?.id;
      setUserId(userId);
    }
  }, [session, id]);

  useEffect(() => {
    if (userData && !initialized) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.mobileNumber || "");

      // read the actual verification flags from the user schema
      setEmailVerified(Boolean(userData.isEmailVerified));
      setPhoneVerified(Boolean(userData.isMobileVerified));

      setInitialized(true);
    }
  }, [userData, initialized]);


  const handleSendotp = async (channel: "email" | "phone") => {
    try {
      setError("")
      setLoading(true);

      const payload = {
        userId: id,
        mobileNumber: phone,
        email,
        role: "user",
      };
      console.log("sending otp")
      if (channel === "phone") {
        await axios.post("/api/auth/send-phone-otp", payload);
        setModal("phone");
      }

      if (channel === "email") {
        await axios.post("/api/auth/send-email-otp", payload);
        setModal("email");
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error)
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
        setError("");
        setSaving(true);

        if (!emailVerified) {
            setError("Verify your email");
            setSaving(false);
            return;
        }

        if (!phoneVerified) {
            setError("Verify your phone number");
            setSaving(false);
            return;
        }

        const payload = {
          userId:id,
          name: name || userData?.name,
          email :email || userData?.email,
          phone:phone || userData?.phone,
          role:"user"
        }

        await axios.post("/api/auth/save",payload);

        setSaving(false);
        setSavedMsg(true);
        setIsEditing(false);
        setError("");

    } catch (error: any) {
        setSaving(false);
        setError(
            error.response?.data?.message || "Failed to save profile"
        );
        console.error(error);
    }
};

  const handleCancelEdit = () => {
    setName("");
    setEmail("");
    setPhone("");
    setIsEditing(false);
  };



  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {userData ? userData.name.charAt(0).toUpperCase() : ""}
          </div>
          <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-hover cursor-pointer">
            <Camera size={13} className="text-foreground" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{userData ? userData.name : "Username"}</h2>
          {/* <p className="text-sm text-muted-foreground">
            Member since Jan 2025
          </p> */}
        </div>
      </div>

      {/* Editable fields */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">
            Personal details
          </h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover cursor-pointer"
            >
              <Pencil size={14} />
              Edit profile
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Full name
            </label>
            <div
              className={`flex items-center gap-2 h-12 rounded-xl border border-border px-4 ${isEditing ? "bg-background" : "bg-muted"
                }`}
            >
              <User size={16} className="text-muted-foreground shrink-0" />
              <input
                value={name}
                placeholder={userData?.name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none disabled:cursor-not-allowed disabled:text-muted-foreground"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <VerifyBadge verified={emailVerified} />
            </div>
            <div
              className={`flex items-center gap-2 h-12 rounded-xl border border-border px-4 ${isEditing ? "bg-background" : "bg-muted"
                }`}
            >
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <input
                value={email}
                placeholder={userData?.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                }}
                disabled={!isEditing}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none disabled:cursor-not-allowed disabled:text-muted-foreground"
              />
              {isEditing && !emailVerified && (
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
            <div
              className={`flex items-center gap-2 h-12 rounded-xl border border-border px-4 ${isEditing ? "bg-background" : "bg-muted"
                }`}
            >
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <input
                value={phone}
                placeholder={userData?.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneVerified(false);
                }}
                disabled={!isEditing}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none disabled:cursor-not-allowed disabled:text-muted-foreground"
              />
              {isEditing && !phoneVerified && (
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

        {isEditing && (
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
            >

              {error && <p className="text-xl text-red-500">*{error}</p>}
              {saving ? (
                <CircleDashed size={16} className="animate-spin" />
              ) : (
                "Save changes"
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="h-11 px-6 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
            {savedMsg && (
              <span className="text-sm text-success">Profile updated</span>
            )}
          </div>
        )}
        {!isEditing && savedMsg && (
          <div className="mt-6">
            <span className="text-sm text-success">Profile updated</span>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-1">
          Security
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your account password
        </p>
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
              <Lock size={15} className="text-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">
                Last changed a while ago
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPasswordModalOpen(true)

            }}
            className="text-sm font-medium text-primary hover:text-primary-hover cursor-pointer"
          >
            Change password
          </button>
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
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
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
  const router = useRouter();
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
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
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