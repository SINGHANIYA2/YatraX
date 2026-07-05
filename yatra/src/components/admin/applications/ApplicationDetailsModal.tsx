'use client'

import { X, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

interface Props {
    application: any
    onClose: () => void
    onReject: (application: any) => void
    onApprove: (application: any) => void
}

export default function ApplicationDetailsModal({
    application,
    onClose,
    onReject,
    onApprove
}: Props) {

    if (!application) return null

    return (
        <div
            className="
            font-sans
            fixed inset-0 z-[100]
            flex items-end sm:items-center justify-center
            bg-black/70
            p-0 sm:p-4
            "
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="
                w-full sm:w-[90vw] sm:max-w-[860px]
                max-h-[92vh]
                overflow-y-auto
                rounded-t-3xl sm:rounded-3xl
                bg-card
                border
                border-primary/10
                p-5 sm:p-6
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            Application Details
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Review applicant information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                        p-2
                        rounded-lg
                        hover:bg-secondary
                        text-muted-foreground
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Personal */}
                <Section title="Personal Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Info label="Name" value={application.name} />
                        <Info label="Phone" value={application.phone} />
                        <Info label="Email" value={application.email} />
                        <Info label="City" value={application.city} />
                    </div>
                </Section>

                {/* Driver */}
                <Section title="Driver Details">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Info label="Experience" value={`${application.experience} Years`} />
                        <Info label="Driving License" value={application.dlNumber} />
                        <Info label="Gender" value={application.gender} />
                        <Info label="Status" value={application.status} />
                        <Info label="Emergency Contact" value={application.emergencyContact} />
                        <Info label="Address" value={application.address} />
                        {application.aadharNumber && (
                            <Info label="Aadhar Number" value={application.aadharNumber} />
                        )}
                        {application.state && (
                            <Info label="State" value={application.state} />
                        )}
                    </div>
                </Section>

                {/* Bank Details */}
                {application.bankDetails && (
                    <Section title="Bank Details">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Info label="Account Holder" value={application.bankDetails.accountHolder} />
                            <Info label="Bank Name" value={application.bankDetails.bankName} />
                            <Info label="Account Number" value={application.bankDetails.accountNumber} />
                            <Info label="IFSC Code" value={application.bankDetails.ifsc} />
                            {application.bankDetails.upiId && (
                                <Info label="UPI ID" value={application.bankDetails.upiId} />
                            )}
                        </div>
                    </Section>
                )}

                {/* Profile Photo */}
                <Section title="Profile Photo">
                    {application.profilePhoto?.url ? (
                        <img
                            src={application.profilePhoto.url}
                            alt="Profile"
                            className="
                            w-28 h-28 sm:w-36 sm:h-36
                            rounded-xl
                            object-cover
                            border
                            border-border
                            "
                        />
                    ) : (
                        <p className="text-muted-foreground text-sm">No photo uploaded</p>
                    )}
                </Section>

                {/* Documents */}
                <Section title="Documents">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <DocumentCard
                            title="Aadhar Front"
                            url={application.documents?.aadharFront?.url}
                        />
                        <DocumentCard
                            title="Aadhar Back"
                            url={application.documents?.aadharBack?.url}
                        />
                        <DocumentCard
                            title="Driving License"
                            url={application.documents?.drivingLicense?.url}
                        />
                    </div>
                </Section>

                {/* Rejection reason if rejected */}
                {application.status === 'rejected' && application.rejectionReason && (
                    <Section title="Rejection Reason">
                        <p className="text-destructive text-sm bg-destructive/10 rounded-xl p-3">
                            {application.rejectionReason}
                        </p>
                    </Section>
                )}

                {/* Actions — only for pending */}
                {application.status === 'pending' && (
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
                        <motion.button
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onReject(application)}
                            className="
                            w-full sm:w-auto
                            px-5 py-2.5
                            cursor-pointer
                            rounded-xl
                            bg-destructive/15
                            border border-destructive/20
                            text-destructive
                            font-medium
                            hover:bg-destructive/25
                            transition-colors
                            "
                        >
                            Reject
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onApprove(application)}
                            className="
                            w-full sm:w-auto
                            px-5 py-2.5
                            cursor-pointer
                            rounded-xl
                            bg-success/15
                            border border-success/20
                            text-success
                            font-medium
                            hover:bg-success/25
                            transition-colors
                            "
                        >
                            Approve
                        </motion.button>
                    </div>
                )}

            </motion.div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">
                {title}
            </h3>
            {children}
        </div>
    )
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-background p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-foreground mt-1 text-sm sm:text-base break-words">{value || '—'}</p>
        </div>
    )
}

function DocumentCard({ title, url }: { title: string; url?: string }) {
    return (
        <div className="rounded-xl bg-background p-3 sm:p-4">
            <p className="text-foreground text-sm mb-2 font-medium">{title}</p>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    flex items-center gap-1.5
                    text-primary text-sm
                    hover:underline
                    "
                >
                    <ExternalLink size={13} />
                    View Document
                </a>
            ) : (
                <p className="text-muted-foreground text-xs">Not uploaded</p>
            )}
        </div>
    )
}
