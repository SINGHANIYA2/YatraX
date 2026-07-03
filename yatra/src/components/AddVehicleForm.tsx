"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bike,
    Bus,
    Car,
    Check,
    FileCheck2,
    Loader2,
    ShieldCheck,
    Truck,
    UploadCloud,
    X,
} from "lucide-react";

// ---------- types ----------

type VehicleType = "bike" | "auto" | "cab" | "bus";

type DocKey = "rc" | "insurance" | "pollution";

interface UploadedFile {
    url: string;
    publicId?: string;
    name?: string;
}

interface FormState {
    vehicleType: VehicleType | "";
    brand: string;
    model: string;
    vehicleNumber: string;
    seatingCapacity: string;
    documents: Partial<Record<DocKey, UploadedFile>>;
}

const VEHICLE_TYPES: { value: VehicleType; label: string; icon: typeof Bus }[] = [
    { value: "bus", label: "Bus", icon: Bus },
    { value: "cab", label: "Cab", icon: Car },
    { value: "auto", label: "Auto", icon: Truck },
    { value: "bike", label: "Bike", icon: Bike },
];

const DOC_FIELDS: { key: DocKey; label: string; hint: string }[] = [
    { key: "rc", label: "Registration Certificate", hint: "RC book / smart card" },
    { key: "insurance", label: "Insurance", hint: "Valid policy document" },
    { key: "pollution", label: "Pollution Certificate", hint: "PUC certificate" },
];

const emptyForm: FormState = {
    vehicleType: "",
    brand: "",
    model: "",
    vehicleNumber: "",
    seatingCapacity: "",
    documents: {},
};

export default function AddVehicleForm({
    open,
    onClose,
    onSuccess,
}: {
    open: boolean;
    onClose: () => void;
    onSuccess?: (vehicle: any) => void;
}) {
    const [step, setStep] = useState<1 | 2>(1);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [uploadingDoc, setUploadingDoc] = useState<DocKey | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);


    const refNumber = useMemo(
        () => `VR-${Math.floor(100000 + Math.random() * 900000)}`,
        []
    );

    const step1Valid =
        form.vehicleType !== "" &&
        form.brand.trim() !== "" &&
        form.model.trim() !== "" &&
        form.vehicleNumber.trim() !== "" &&
        Number(form.seatingCapacity) > 0;

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleDocUpload(key: DocKey, file: File) {
        setUploadingDoc(key);
        setError(null);
        try {
            const body = new FormData();
            // field name must match rc / insurance / pollution -
            // the upload route only processes fields it recognizes
            body.append(key, file);

            const res = await fetch("/api/upload/admin", {
                method: "POST",
                body,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data?.message || "Upload failed");
            }

            update("documents", {
                ...form.documents,
                // uploadOnCloudinary's return value is stored as-is
                // (whatever shape matches FileSchema), we just tack
                // the original filename on for display purposes
                [key]: { ...data.documents[key], name: file.name },
            });
        } catch (err: any) {
            setError(err?.message || "Could not upload document");
        } finally {
            setUploadingDoc(null);
        }
    }

    function removeDoc(key: DocKey) {
        const next = { ...form.documents };
        delete next[key];
        update("documents", next);
    }

    async function handleSubmit() {
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/vehicle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleType: form.vehicleType,
                    brand: form.brand.trim(),
                    model: form.model.trim(),
                    vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
                    seatingCapacity: Number(form.seatingCapacity),
                    documents: form.documents,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data?.message || "Could not add vehicle");
            }

            setSuccess(true);
            onSuccess?.(data.vehicle);

            setTimeout(() => {
                resetForm();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    }

    function resetForm() {
        setForm(emptyForm);
        setStep(1);
        setSuccess(false);
        setError(null);
    }

    if (!open) return null;
    return (
        <div className="fixed font-sans inset-0 z-50 flex items-center justify-center bg-black/80">
            <div
                className="
                relative
                w-full
                max-w-2xl
                rounded-2xl
                bg-[#071427]
            "
            >
                <button
                    onClick={onClose}
                    className="
                        absolute
                        top-1
                        right-1
                        z-50
                        p-[1px]
                        rounded-full
                        bg-black/20
                        cursor-pointer
                        text-white
                        hover:bg-white/10
                        transition
                    "
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="overflow-hidden rounded-lg border border-[#D9CFB8] bg-[#FBFAF6] shadow-sm">
                    {/* header bar - official form letterhead feel */}
                    <div className="relative bg-[#0F2A4A] px-6 py-5">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px)",
                            }}
                        />
                        <div className="relative flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[11px] tracking-[0.2em] text-[#C89B3C] font-medium uppercase">
                                    YatraX &middot; Fleet Registry
                                </p>
                                <h2 className="mt-1 font-serif text-xl text-white tracking-wide">
                                    Vehicle Registration Form
                                </h2>
                            </div>
                            <div className="shrink-0 rounded border border-[#C89B3C]/40 bg-white/5 px-3 py-1.5 text-right">
                                <p className="text-[10px] uppercase tracking-wider text-[#C89B3C]">
                                    Form No.
                                </p>
                                <p className="font-mono text-sm text-white">{refNumber}</p>
                            </div>
                        </div>

                        {/* step indicator */}
                        <div className="relative mt-5 flex items-center gap-3">
                            <StepDot active={step >= 1} done={step > 1} label="1" />
                            <div className="h-px flex-1 bg-[#C89B3C]/30">
                                <motion.div
                                    className="h-px bg-[#C89B3C]"
                                    initial={false}
                                    animate={{ width: step > 1 ? "100%" : "0%" }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                            </div>
                            <StepDot active={step >= 2} done={success} label="2" />
                        </div>
                        <div className="relative mt-1.5 flex justify-between text-[11px] text-white/60">
                            <span>Vehicle Details</span>
                            <span>Documents</span>
                        </div>
                    </div>

                    {/* body */}
                    <div className="px-6 py-6 min-h-[360px]">
                        {success ? (
                            <SuccessState refNumber={refNumber} onAddAnother={resetForm} />
                        ) : (
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <StepOne form={form} update={update} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <StepTwo
                                            documents={form.documents}
                                            uploadingDoc={uploadingDoc}
                                            onUpload={handleDocUpload}
                                            onRemove={removeDoc}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 rounded border border-[#B3261E]/30 bg-[#B3261E]/5 px-3 py-2 text-sm text-[#B3261E]"
                            >
                                {error}
                            </motion.p>
                        )}
                    </div>

                    {/* footer */}
                    {!success && (
                        <div className="flex items-center justify-between border-t border-[#D9CFB8] bg-[#F3F0E8] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => (step === 2 ? setStep(1) : undefined)}
                                disabled={step === 1}
                                className="text-sm font-medium text-[#5B6472] disabled:opacity-0 hover:text-[#0F2A4A] transition-colors"
                            >
                                &larr; Back
                            </button>

                            {step === 1 ? (
                                <button
                                    type="button"
                                    disabled={!step1Valid}
                                    onClick={() => setStep(2)}
                                    className="rounded bg-[#0F2A4A] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#123057] disabled:cursor-not-allowed disabled:bg-[#0F2A4A]/30"
                                >
                                    Continue to Documents &rarr;
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    className="inline-flex items-center gap-2 rounded bg-[#0F2A4A] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#123057] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Registering&hellip;
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="h-4 w-4" />
                                            Submit Registration
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---------- step 1 ----------

function StepOne({
    form,
    update,
}: {
    form: FormState;
    update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
    return (
        <div className="space-y-5">
            <div>
                <Label>Vehicle Type</Label>
                <div className="grid grid-cols-4 gap-2">
                    {VEHICLE_TYPES.map(({ value, label, icon: Icon }) => {
                        const active = form.vehicleType === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => update("vehicleType", value)}
                                className={`flex flex-col items-center gap-1.5 rounded border px-2 py-3 text-xs font-medium transition-colors ${active
                                    ? "border-[#0F2A4A] bg-[#0F2A4A] text-white"
                                    : "border-[#D9CFB8] bg-white text-[#5B6472] hover:border-[#0F2A4A]/40"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Brand</Label>
                    <Input
                        placeholder="e.g. Tata"
                        value={form.brand}
                        onChange={(v) => update("brand", v)}
                    />
                </div>
                <div>
                    <Label>Model</Label>
                    <Input
                        placeholder="e.g. Starbus"
                        value={form.model}
                        onChange={(v) => update("model", v)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Vehicle Number</Label>
                    <Input
                        placeholder="e.g. UP70 AB 1234"
                        value={form.vehicleNumber}
                        onChange={(v) => update("vehicleNumber", v.toUpperCase())}
                        mono
                    />
                </div>
                <div>
                    <Label>Seating Capacity</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 40"
                        value={form.seatingCapacity}
                        onChange={(v) => update("seatingCapacity", v)}
                    />
                </div>
            </div>
        </div>
    );
}

// ---------- step 2 ----------

function StepTwo({
    documents,
    uploadingDoc,
    onUpload,
    onRemove,
}: {
    documents: FormState["documents"];
    uploadingDoc: DocKey | null;
    onUpload: (key: DocKey, file: File) => void;
    onRemove: (key: DocKey) => void;
}) {
    return (
        <div className="space-y-3">
            <p className="text-sm text-[#5B6472]">
                Upload supporting documents. These can also be added later from the
                vehicle's profile.
            </p>

            {DOC_FIELDS.map(({ key, label, hint }) => {
                const uploaded = documents[key];
                const isUploading = uploadingDoc === key;

                return (
                    <div
                        key={key}
                        className="flex items-center justify-between rounded border border-[#D9CFB8] bg-white px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded ${uploaded ? "bg-[#2F7A4C]/10" : "bg-[#0F2A4A]/5"
                                    }`}
                            >
                                {uploaded ? (
                                    <FileCheck2 className="h-4 w-4 text-[#2F7A4C]" />
                                ) : (
                                    <UploadCloud className="h-4 w-4 text-[#0F2A4A]/50" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#0F2A4A]">{label}</p>
                                <p className="text-xs text-[#5B6472]">
                                    {uploaded ? uploaded.name || "Uploaded" : hint}
                                </p>
                            </div>
                        </div>

                        {uploaded ? (
                            <button
                                type="button"
                                onClick={() => onRemove(key)}
                                className="flex h-7 w-7 items-center justify-center rounded text-[#5B6472] hover:bg-[#B3261E]/10 hover:text-[#B3261E]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        ) : (
                            <label className="cursor-pointer rounded border border-[#0F2A4A]/20 px-3 py-1.5 text-xs font-medium text-[#0F2A4A] hover:bg-[#0F2A4A]/5">
                                {isUploading ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Uploading
                                    </span>
                                ) : (
                                    "Choose file"
                                )}
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onUpload(key, file);
                                        e.target.value = "";
                                    }}
                                />
                            </label>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ---------- success ----------

function SuccessState({
    refNumber,
    onAddAnother,
}: {
    refNumber: string;
    onAddAnother: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2F7A4C] text-[#2F7A4C]">
                <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-[#0F2A4A]">
                Vehicle Registered
            </h3>
            <p className="mt-1 text-sm text-[#5B6472]">
                Reference {refNumber} has been added to the fleet as{" "}
                <span className="font-medium text-[#0F2A4A]">available</span>.
            </p>
            <button
                type="button"
                onClick={onAddAnother}
                className="mt-6 rounded border border-[#0F2A4A]/20 px-4 py-2 text-sm font-medium text-[#0F2A4A] hover:bg-[#0F2A4A]/5"
            >
                Register another vehicle
            </button>
        </motion.div>
    );
}

// ---------- small primitives ----------

function StepDot({
    active,
    done,
    label,
}: {
    active: boolean;
    done: boolean;
    label: string;
}) {
    return (
        <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition-colors ${done
                ? "border-[#C89B3C] bg-[#C89B3C] text-[#0F2A4A]"
                : active
                    ? "border-[#C89B3C] text-[#C89B3C]"
                    : "border-white/25 text-white/40"
                }`}
        >
            {done ? <Check className="h-3 w-3" /> : label}
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[#5B6472]">
            {children}
        </p>
    );
}

function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    mono = false,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    mono?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded border border-[#D9CFB8] bg-white px-3 py-2 text-sm text-[#0F2A4A] placeholder:text-[#5B6472]/50 outline-none transition-colors focus:border-[#0F2A4A] ${mono ? "font-mono tracking-wide" : ""
                }`}
        />
    );
}