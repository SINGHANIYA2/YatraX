'use client'

import { X } from 'lucide-react'
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
            flex items-center justify-center
            bg-black/70
            backdrop-blur-sm
            "
        >
            <div
                className="
                w-[900px]
                max-h-[90vh]
                overflow-y-auto
                rounded-3xl
                bg-[#071427]
                border
                border-blue-500/10
                p-6
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Application Details
                        </h2>

                        <p className="text-slate-400 text-sm">
                            Review applicant information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                        p-2
                        rounded-lg
                        hover:bg-slate-800
                        text-slate-400
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Personal */}
                <div className="mb-6">

                    <h3
                        className="
                        text-lg
                        font-semibold
                        text-white
                        mb-4
                        "
                    >
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

                        <Info
                            label="Name"
                            value={application.name}
                        />

                        <Info
                            label="Phone"
                            value={application.phone}
                        />

                        <Info
                            label="Email"
                            value={application.email}
                        />

                        <Info
                            label="City"
                            value={application.city}
                        />

                    </div>

                </div>

                {/* Driver */}
                <div className="mb-6">

                    <h3
                        className="
                        text-lg
                        font-semibold
                        text-white
                        mb-4
                        "
                    >
                        Driver Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">

                        <Info
                            label="Experience"
                            value={`${application.experience} Years`}
                        />

                        <Info
                            label="Driving License"
                            value={application.dlNumber}
                        />

                        <Info
                            label="Gender"
                            value={application.gender}
                        />

                        <Info
                            label="Status"
                            value={application.status}
                        />

                        <Info
                            label="Emergency Contact"
                            value={application.emergencyContact}
                        />

                        <Info
                            label="Address"
                            value={application.address}
                        />

                    </div>

                </div>

                {/* profile photo */}
                <div className="mb-6">

                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-white
                            mb-4
                            "
                    >
                        Profile Photo
                    </h3>

                    <img
                        src={application.profilePhoto?.url}
                        alt="Profile"
                        className="
                            w-40
                            h-40
                            rounded-xl
                            object-cover
                            border
                            border-slate-700
                            "
                    />

                </div>

                {/* Documents */}

                <div className="mb-6">

                    <h3
                        className="
                        text-lg
                        font-semibold
                        text-white
                        mb-4
                        "
                    >
                        Documents
                    </h3>

                    <div className="grid grid-cols-3 gap-4">

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

                </div>

                {/* Actions */}

                <div className="flex justify-end gap-3">

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                        }}
                        onClick={() => onReject(application)}
                        className="
                            px-5
                            py-2.5
                            cursor-pointer
                            rounded-xl
                            bg-red-500/15
                            border
                            border-red-500/20
                            text-red-400
                            shadow-red-500/20
                            hover:shadow-lg
                        ">
                        Reject
                    </motion.button>

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                        }}
                        whileTap={{
                            scale: 0.95,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                        }}
                        onClick={() => onApprove(application)}
                        className="
                            px-5
                            py-2.5
                            cursor-pointer
                            rounded-xl
                            bg-green-500/15
                            border
                            border-green-500/20
                            text-green-400
                            shadow-green-500/20
                            hover:shadow-lg
                            "
                    >
                        Approve
                    </motion.button>

                </div>

            </div>
        </div>
    )
}

function Info({
    label,
    value
}: {
    label: string
    value: string
}) {
    return (
        <div
            className="
            rounded-xl
            bg-slate-900/50
            p-4
            "
        >
            <p className="text-xs text-slate-500">
                {label}
            </p>

            <p className="text-white mt-1">
                {value}
            </p>
        </div>
    )
}

function DocumentCard({
    title,
    url
}: {
    title: string
    url?: string
}) {
    return (
        <div
            className="
            rounded-xl
            bg-slate-900/50
            p-4
            "
        >
            <p className="text-white mb-3">
                {title}
            </p>

            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                text-blue-400
                text-sm
                hover:text-blue-300
                "
            >
                View Document
            </a>
        </div>
    )
}