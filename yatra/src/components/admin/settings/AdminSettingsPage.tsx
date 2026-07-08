"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import LoadingState from "@/components/ui/LoadingState";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    CreditCard,
    Shield,
    Camera,
    Edit3,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight,
    Lock,
    BadgeCheck,
    Landmark,
    Hash,
    FileText,
} from "lucide-react";
import AdminTopbar from "./SettingsTopbar";

interface AdminProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    profilePhoto?: { url: string };
    organizationName?: string;
    organizationType?: string;
    gstNumber?: string;
    registrationNumber?: string;
    aadharNumber?: string;
    panNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    bankDetails?: {
        accountHolder?: string;
        accountNumber?: string;
        ifsc?: string;
        bankName?: string;
        upiId?: string;
    };
    totalVehicles?: number;
    totalPartners?: number;
    totalEarnings?: number;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    createdAt?: string;
}

type Tab = "profile" | "organization" | "bank" | "security";

function Avatar({ src, name, size = 20 }: { src?: string; name: string; size?: number }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    if (src)
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover`}
                style={{ width: size, height: size }}
            />
        );
    return (
        <div
            className="rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.36 }}
        >
            {initials}
        </div>
    );
}

function Field({
    label,
    value,
    icon: Icon,
    editing,
    name,
    onChange,
    type = "text",
    placeholder,
}: {
    label: string;
    value: string;
    icon?: typeof User;
    editing: boolean;
    name: string;
    onChange: (name: string, val: string) => void;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
            </label>
            {editing ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder || label}
                    className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary/50 focus:bg-secondary/60 transition-colors"
                />
            ) : (
                <p className="rounded-xl border border-transparent px-4 py-2.5 text-sm text-foreground/90 bg-secondary/20">
                    {value || <span className="text-muted-foreground italic">Not set</span>}
                </p>
            )}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
            <h3 className="mb-5 text-sm font-semibold text-muted-foreground uppercase tracking-widest">{title}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
        </div>
    );
}

const TABS: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "bank", label: "Bank Details", icon: Landmark },
    { id: "security", label: "Security", icon: Shield },
];


export default function AdminSettingsPage() {
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Partial<AdminProfile>>({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [otpModal, setOtpModal] = useState<{ type: "email" | "phone" } | null>(null);
    const [otpValue, setOtpValue] = useState("");
    const [otpStage, setOtpStage] = useState<"sending" | "enter" | "verifying">("sending");
    const [otpError, setOtpError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/api/admin/me");
                setAdmin(data);
                setForm(data);
            } catch {
                showToast("error", "Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function showToast(type: "success" | "error", msg: string) {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    }

    function handleChange(name: string, val: string) {
        if (name.startsWith("bankDetails.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                bankDetails: { ...prev.bankDetails, [key]: val },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: val }));
        }
    }

    function cancelEdit() {
        setForm(admin ?? {});
        setEditing(false);
    }

    async function save() {
        if (!admin) return;
        setSaving(true);
        try {
            const { data } = await axios.patch("/api/profile-update/admin", {
                _id: admin._id,
                ...form,
            });
            setAdmin(data.admin);
            setForm(data.admin);
            setEditing(false);
            showToast("success", "Profile updated successfully");
        } catch (err: any) {
            showToast("error", err?.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !admin) return;
        setPhotoUploading(true);
        try {
            const fd = new FormData();
            fd.append("profilePhoto", file);
            // Upload via profile-update endpoint with form data
            const { data } = await axios.patch("/api/profile-update/admin", fd, {
                params: { _id: admin._id },
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Fallback: just patch profile photo url into form after local preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target?.result as string;
                setAdmin((prev) => prev ? { ...prev, profilePhoto: { url } } : prev);
            };
            reader.readAsDataURL(file);
            showToast("success", "Photo updated");
        } catch {
            // show local preview even if upload fails in dev
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target?.result as string;
                setAdmin((prev) => prev ? { ...prev, profilePhoto: { url } } : prev);
            };
            reader.readAsDataURL(file);
        } finally {
            setPhotoUploading(false);
        }
    }

    async function openOtpModal(type: "email" | "phone") {
        if (!admin) return;
        setOtpModal({ type });
        setOtpValue("");
        setOtpError(null);
        setOtpStage("sending");
        try {
            if (type === "email") {
                await axios.post("/api/auth/send-email-otp", {
                    userId: admin._id,
                    email: admin.email,
                    role: "admin",
                });
            } else {
                await axios.post("/api/auth/send-phone-otp", {
                    userId: admin._id,
                    mobileNumber: admin.phone,
                    role: "admin",
                });
            }
            setOtpStage("enter");
        } catch (err: any) {
            setOtpError(err?.response?.data?.message || "Failed to send OTP");
            setOtpStage("enter");
        }
    }

    async function submitOtp() {
        if (!admin || !otpModal) return;
        setOtpStage("verifying");
        setOtpError(null);
        try {
            const endpoint = otpModal.type === "email" ? "/api/auth/verify-email" : "/api/auth/verify-phone";
            await axios.post(endpoint, {
                userId: admin._id,
                otp: otpValue,
                role: "admin",
            });
            setAdmin((prev) =>
                prev
                    ? {
                          ...prev,
                          isEmailVerified: otpModal.type === "email" ? true : prev.isEmailVerified,
                          isPhoneVerified: otpModal.type === "phone" ? true : prev.isPhoneVerified,
                      }
                    : prev
            );
            showToast("success", otpModal.type === "email" ? "Email verified successfully" : "Phone verified successfully");
            setOtpModal(null);
        } catch (err: any) {
            setOtpError(err?.response?.data?.message || "Invalid OTP, please try again");
            setOtpStage("enter");
        }
    }

    if (loading) {
        return <LoadingState label="Loading profile..." fullScreen />;
    }

    if (!admin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Failed to load admin profile.</p>
            </div>
        );
    }

    const f = form as AdminProfile;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <AdminTopbar admin={admin} />

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className={`fixed top-6 right-6 z-[200] flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-2xl backdrop-blur-sm text-sm font-medium
                            ${toast.type === "success"
                                ? "border-success/30 bg-success/10 text-success"
                                : "border-destructive/30 bg-destructive/10 text-destructive"
                            }`}
                    >
                        {toast.type === "success"
                            ? <CheckCircle2 className="h-4 w-4" />
                            : <AlertCircle className="h-4 w-4" />
                        }
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OTP verification modal */}
            <AnimatePresence>
                {otpModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                        onClick={() => otpStage !== "verifying" && setOtpModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-1">
                                {otpModal.type === "email" ? (
                                    <Mail className="h-5 w-5 text-primary" />
                                ) : (
                                    <Phone className="h-5 w-5 text-primary" />
                                )}
                                <h3 className="text-base font-semibold text-foreground">
                                    Verify {otpModal.type === "email" ? "Email" : "Phone"}
                                </h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">
                                {otpStage === "sending"
                                    ? `Sending a verification code to ${otpModal.type === "email" ? admin.email : admin.phone}…`
                                    : `Enter the 6-digit code sent to ${otpModal.type === "email" ? admin.email : admin.phone}.`}
                            </p>

                            {otpStage === "sending" ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                                        placeholder="••••••"
                                        className="w-full text-center tracking-[0.5em] text-lg rounded-xl border border-border bg-secondary/40 px-4 py-3 text-foreground outline-none focus:border-primary/50 focus:bg-secondary/60 transition-colors"
                                        autoFocus
                                    />
                                    {otpError && (
                                        <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                                            <AlertCircle className="h-3 w-3" /> {otpError}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => setOtpModal(null)}
                                            className="flex-1 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitOtp}
                                            disabled={otpValue.length !== 6 || otpStage === "verifying"}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-50"
                                        >
                                            {otpStage === "verifying" ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            )}
                                            Verify
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => openOtpModal(otpModal.type)}
                                        className="mt-3 w-full text-center text-xs text-primary hover:underline"
                                    >
                                        Resend code
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
                {/* Profile hero card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-2xl border border-border bg-secondary/20 p-6 mb-6 overflow-hidden"
                >
                    {/* subtle gradient bg */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar with upload */}
                        <div className="relative flex-shrink-0">
                            <Avatar src={admin.profilePhoto?.url} name={admin.name} size={88} />
                            <button
                                onClick={() => fileRef.current?.click()}
                                disabled={photoUploading}
                                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                            >
                                {photoUploading
                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : <Camera className="h-3.5 w-3.5" />
                                }
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-xl font-bold text-foreground truncate">{admin.name}</h1>
                                {admin.isEmailVerified && (
                                    <span className="flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2 py-0.5 text-[11px] text-success">
                                        <BadgeCheck className="h-3 w-3" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                            {admin.organizationName && (
                                <p className="text-xs text-muted-foreground/80 mt-1">{admin.organizationName} · {admin.organizationType}</p>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                            {[
                                { label: "Vehicles", value: admin.totalVehicles ?? 0 },
                                { label: "Partners", value: admin.totalPartners ?? 0 },
                                { label: "Member since", value: admin.createdAt ? new Date(admin.createdAt).getFullYear() : "—" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Tabs + Content */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Tab nav */}
                    <motion.nav
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="flex lg:flex-col gap-1 lg:w-48 flex-shrink-0 overflow-x-auto lg:overflow-visible"
                    >
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setEditing(false); setForm(admin); }}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all whitespace-nowrap w-full
                                        ${active
                                            ? "bg-primary/15 text-primary border border-primary/25"
                                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground border border-transparent"
                                        }`}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {tab.label}
                                    {active && <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:block" />}
                                </button>
                            );
                        })}
                    </motion.nav>

                    {/* Content panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.08 }}
                        className="flex-1 min-w-0"
                    >
                        {/* Edit/Save toolbar */}
                        {activeTab !== "security" && (
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-foreground capitalize">{activeTab} Settings</h2>
                                <div className="flex items-center gap-2">
                                    {editing ? (
                                        <>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/60 transition-colors"
                                            >
                                                <X className="h-3.5 w-3.5" /> Cancel
                                            </button>
                                            <button
                                                onClick={save}
                                                disabled={saving}
                                                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-60"
                                            >
                                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                                {saving ? "Saving…" : "Save"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {/* ── Profile tab ── */}
                                {activeTab === "profile" && (
                                    <>
                                        <Section title="Personal Information">
                                            <Field label="Full Name" value={f.name ?? ""} icon={User} editing={editing} name="name" onChange={handleChange} />
                                            <Field label="Email" value={f.email ?? ""} icon={Mail} editing={false} name="email" onChange={handleChange} type="email" />
                                            <Field label="Phone" value={f.phone ?? ""} icon={Phone} editing={editing} name="phone" onChange={handleChange} />
                                            <Field label="Alternate Phone" value={f.alternatePhone ?? ""} icon={Phone} editing={editing} name="alternatePhone" onChange={handleChange} />
                                        </Section>
                                        <Section title="Address">
                                            <div className="sm:col-span-2">
                                                <Field label="Street Address" value={f.address ?? ""} icon={MapPin} editing={editing} name="address" onChange={handleChange} />
                                            </div>
                                            <Field label="City" value={f.city ?? ""} editing={editing} name="city" onChange={handleChange} />
                                            <Field label="State" value={f.state ?? ""} editing={editing} name="state" onChange={handleChange} />
                                            <Field label="Pincode" value={f.pincode ?? ""} editing={editing} name="pincode" onChange={handleChange} />
                                        </Section>
                                    </>
                                )}

                                {/* ── Organization tab ── */}
                                {activeTab === "organization" && (
                                    <>
                                        <Section title="Organization Details">
                                            <Field label="Organization Name" value={f.organizationName ?? ""} icon={Building2} editing={editing} name="organizationName" onChange={handleChange} />
                                            <Field label="Organization Type" value={f.organizationType ?? ""} editing={editing} name="organizationType" onChange={handleChange} />
                                            <Field label="GST Number" value={f.gstNumber ?? ""} icon={Hash} editing={editing} name="gstNumber" onChange={handleChange} />
                                            <Field label="Registration Number" value={f.registrationNumber ?? ""} icon={FileText} editing={editing} name="registrationNumber" onChange={handleChange} />
                                        </Section>
                                        <Section title="Identity Documents">
                                            <Field label="Aadhar Number" value={f.aadharNumber ?? ""} icon={CreditCard} editing={editing} name="aadharNumber" onChange={handleChange} />
                                            <Field label="PAN Number" value={f.panNumber ?? ""} icon={CreditCard} editing={editing} name="panNumber" onChange={handleChange} />
                                        </Section>
                                    </>
                                )}

                                {/* ── Bank tab ── */}
                                {activeTab === "bank" && (
                                    <Section title="Bank Details">
                                        <Field label="Bank Name" value={f.bankDetails?.bankName ?? ""} icon={Landmark} editing={editing} name="bankDetails.bankName" onChange={handleChange} />
                                        <Field label="Account Holder" value={f.bankDetails?.accountHolder ?? ""} icon={User} editing={editing} name="bankDetails.accountHolder" onChange={handleChange} />
                                        <Field label="Account Number" value={f.bankDetails?.accountNumber ?? ""} editing={editing} name="bankDetails.accountNumber" onChange={handleChange} />
                                        <Field label="IFSC Code" value={f.bankDetails?.ifsc ?? ""} editing={editing} name="bankDetails.ifsc" onChange={handleChange} />
                                        <Field label="UPI ID" value={f.bankDetails?.upiId ?? ""} editing={editing} name="bankDetails.upiId" onChange={handleChange} />
                                    </Section>
                                )}

                                {/* ── Security tab ── */}
                                {activeTab === "security" && (
                                    <div className="space-y-4">
                                        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
                                            <h3 className="mb-5 text-sm font-semibold text-muted-foreground uppercase tracking-widest">Verification Status</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: "Email Verified", type: "email" as const, verified: admin.isEmailVerified, icon: Mail },
                                                    { label: "Phone Verified", type: "phone" as const, verified: admin.isPhoneVerified, icon: Phone },
                                                ].map(({ label, type, verified, icon: Icon }) => (
                                                    <div key={label} className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/10 px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm text-foreground/90">{label}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
                                                                ${verified
                                                                    ? "bg-success/10 text-success border border-success/20"
                                                                    : "bg-warning/10 text-warning border border-warning/20"
                                                                }`}>
                                                                {verified ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                                                                {verified ? "Verified" : "Not verified"}
                                                            </span>
                                                            {!verified && (
                                                                <button
                                                                    onClick={() => openOtpModal(type)}
                                                                    className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                                                >
                                                                    Verify
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
                                            <h3 className="mb-5 text-sm font-semibold text-muted-foreground uppercase tracking-widest">Account</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/10 px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-foreground/90">Password</p>
                                                            <p className="text-xs text-muted-foreground/70">Last changed: —</p>
                                                        </div>
                                                    </div>
                                                    <button className="rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                                                        Change
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/10 px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-foreground/90">Account ID</p>
                                                            <p className="text-xs text-muted-foreground/70 font-mono">{admin._id}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {admin.createdAt && (
                                                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/10 px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-sm text-foreground/90">Member Since</p>
                                                                <p className="text-xs text-muted-foreground/70">{new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}