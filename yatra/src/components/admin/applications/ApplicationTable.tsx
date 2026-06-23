'use client'

import {
    Eye,
    Check,
    X
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
            bg-[#071427]
            border
            border-blue-500/10
            "
        >
            <table className="w-full">

                <thead>
                    <tr
                        className="
                        text-slate-400
                        border-b
                        border-slate-800
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
                            border-slate-800
                            "
                        >
                            <td className="p-5">
                                <p className="text-white">
                                    {app.name}
                                </p>

                                <p className="text-slate-500 text-sm">
                                    {app.phone}
                                </p>
                            </td>

                            <td className="text-slate-300">
                                {app.city}
                            </td>

                            <td className="text-slate-300">
                                {app.experience} Years
                            </td>

                            <td>
                                <span
                                    className="
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    bg-slate-800
                                    text-white
                                    "
                                >
                                    {app.status}
                                </span>
                            </td>

                            <td className="text-slate-300">
                                {app.appliedAt}
                            </td>

                            <td className='px-[3.3%]'>
                                <div className="flex justify-between items-center">

                                    <Eye
                                        size={18}
                                        onClick={() => onView(app)}
                                        className="
                                        cursor-pointer
                                        text-slate-400
                                        hover:text-blue-400
                                        "
                                    />


                                    <button
                                        onClick={() => onApprove(app)}
                                        className="
                                        px-3 py-1.5 rounded-lg
                                        bg-green-500/15
                                        text-green-400
                                        "
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => onReject(app)}
                                        className="
                                        px-3 py-1.5 rounded-lg
                                        bg-red-500/15
                                        text-red-400
                                        "
                                    >
                                        Reject
                                    </button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}