'use client'

import { Eye } from 'lucide-react'

interface Props {
    data: any[]
    onView: (app: any) => void
}

function StatusBadge({ status }: { status: string }) {
    const colorMap: Record<string, string> = {
        pending: 'bg-warning/15 text-warning',
        approved: 'bg-success/15 text-success',
        rejected: 'bg-destructive/15 text-destructive',
        under_review: 'bg-primary/15 text-primary',
    }
    return (
        <span
            className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${colorMap[status] ?? 'bg-secondary text-foreground'}
            `}
        >
            {status}
        </span>
    )
}

/* ── Desktop table row ── */
function DesktopRow({
    app,
    onView,
}: {
    app: any
    onView: (a: any) => void
}) {
    return (
        <tr className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
            <td className="p-5">
                <p className="text-foreground font-medium truncate">{app.name}</p>
                <p className="text-muted-foreground text-sm truncate">{app.phone}</p>
            </td>

            <td className="py-5 pr-4 text-muted-foreground truncate">{app.city}</td>

            <td className="py-5 pr-4 text-muted-foreground truncate">{app.experience} Yrs</td>

            <td className="py-5 pr-4">
                <StatusBadge status={app.status} />
            </td>

            <td className="py-5 pr-4 text-muted-foreground text-sm truncate">
                {app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
            </td>

            <td className="py-5">
                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <button
                        onClick={() => onView(app)}
                        title="View details"
                        className="flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary flex-shrink-0 text-xs font-medium"
                    >
                        <Eye size={14} />
                        View
                    </button>
                </div>
            </td>
        </tr>
    )
}

function MobileCard({
    app,
    onView,
}: {
    app: any
    onView: (a: any) => void
}) {
    return (
        <div className="p-4 border-b border-border last:border-0">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-foreground font-medium">{app.name}</p>
                    <p className="text-muted-foreground text-sm">{app.phone}</p>
                </div>
                <StatusBadge status={app.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                <span>📍 {app.city || '—'}</span>
                <span>🚗 {app.experience} Yrs exp</span>
                <span className="col-span-2">
                    📅 {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => onView(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-medium"
                >
                    <Eye size={14} />
                    View
                </button>
            </div>
        </div>
    )
}

export default function ApplicationTable({
    data,
    onView,
}: Props) {

    if (data.length === 0) {
        return (
            <div className="mt-6 rounded-3xl bg-card border border-primary/10 p-12 text-center text-muted-foreground">
                No applications found.
            </div>
        )
    }

    return (
        <div className="mt-6 font-sans rounded-3xl bg-card border border-primary/10 overflow-hidden">

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-fixed">
                    <colgroup>
                        <col className="w-[24%]" />
                        <col className="w-[12%]" />
                        <col className="w-[13%]" />
                        <col className="w-[13%]" />
                        <col className="w-[14%]" />
                        <col className="w-[24%]" />
                    </colgroup>
                    <thead>
                        <tr className="text-muted-foreground border-b border-border text-sm">
                            <th className="p-5 text-left font-medium">Applicant</th>
                            <th className="py-5 pr-4 text-left font-medium">City</th>
                            <th className="py-5 pr-4 text-left font-medium">Experience</th>
                            <th className="py-5 pr-4 text-left font-medium">Status</th>
                            <th className="py-5 pr-4 text-left font-medium">Applied</th>
                            <th className="py-5 pr-5 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(app => (
                            <DesktopRow
                                key={app._id}
                                app={app}
                                onView={onView}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                {data.map(app => (
                    <MobileCard
                        key={app._id}
                        app={app}
                        onView={onView}
                    />
                ))}
            </div>

        </div>
    )
}
