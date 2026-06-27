'use client'

import {
    Clock3,
    CheckCircle2,
    XCircle,
    FileText
} from 'lucide-react'

import ApplicationStatsCard from './ApplicationStatsCard'
import { applications } from './demo'

export default function ApplicationStats() {

    const pending =
        applications.filter(
            a => a.status === 'pending'
        ).length

    const approved =
        applications.filter(
            a => a.status === 'approved'
        ).length

    const rejected =
        applications.filter(
            a => a.status === 'rejected'
        ).length

    return (
        <div className="grid grid-cols-4 gap-6">

            <ApplicationStatsCard
                title="Total Applications"
                value={applications.length}
                icon={FileText}
                iconColor="text-blue-400"
            />

            <ApplicationStatsCard
                title="Pending"
                value={pending}
                icon={Clock3}
                iconColor="text-yellow-400"
            />

            <ApplicationStatsCard
                title="Approved"
                value={approved}
                icon={CheckCircle2}
                iconColor="text-green-400"
            />

            <ApplicationStatsCard
                title="Rejected"
                value={rejected}
                icon={XCircle}
                iconColor="text-red-400"
            />

        </div>
    )
}