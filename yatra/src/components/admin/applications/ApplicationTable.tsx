'use client'

import {
    Eye
} from 'lucide-react'

interface Props {
    data: any[]
    onView: (app: any) => void
    onApprove: (app: any) => void
    onReject: (app: any) => void
}

export default function ApplicationTable({
    data,
    onView,
    onApprove,
    onReject
}: Props) {
    return (
        <div
            className="
            mt-6
            rounded-3xl
            bg-card
            border
            border-primary/10
            "
        >
            <table className="w-full">

                <thead>
                    <tr
                        className="
                        text-muted-foreground
                        border-b
                        border-border
                        "
                    >
                        <th className="p-5 text-left">
                            Applicant
                        </th>

                        <th className="text-left">
                            City
                        </th>

                        <th className="text-left">
                            Experience
                        </th>

                        <th className="text-left">
                            Status
                        </th>

                        <th className=" text-left">
                            Applied
                        </th>

                        <th className="pl-[10%] text-left">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(app => (
                        <tr
                            key={app.id}
                            className="
                            border-b
                            border-border
                            "
                        >
                            <td className="p-5">
                                <p className="text-foreground">
                                    {app.name}
                                </p>

                                <p className="text-muted-foreground text-sm">
                                    {app.phone}
                                </p>
                            </td>

                            <td className="text-muted-foreground">
                                {app.city}
                            </td>

                            <td className="text-muted-foreground">
                                {app.experience} Years
                            </td>

                            <td>
                                <span
                                    className="
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    bg-secondary
                                    text-foreground
                                    "
                                >
                                    {app.status}
                                </span>
                            </td>

                            <td className="text-muted-foreground">
                                {app.appliedAt}
                            </td>

                            <td className='px-[3.3%]'>
                                <div className="flex justify-between items-center">

                                    <Eye
                                        size={18}
                                        onClick={() => onView(app)}
                                        className="
                                        cursor-pointer
                                        text-muted-foreground
                                        hover:text-primary
                                        "/>

                                    {app.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => onApprove(app)}
                                                className="
                                        px-3 py-1.5 rounded-lg
                                        bg-success/15
                                        text-success
                                        "
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => onReject(app)}
                                                className={`px-3 py-1.5 rounded-lg
                                        bg-destructive/15
                                        text-destructive`}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {app.status === "approved" && (
                                        <span className="text-success">
                                            Approved
                                        </span>
                                    )}

                                    {app.status === "rejected" && (
                                        <span className="text-destructive">
                                            Rejected
                                        </span>
                                    )}

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}