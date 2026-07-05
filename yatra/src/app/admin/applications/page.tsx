'use client'

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";

import ApplicationTopBar from "@/components/admin/applications/ApplicationTopBar";
import ApplicationStats from "@/components/admin/applications/ApplicationStats";
import ApplicationFilters from "@/components/admin/applications/ApplicationFilters";
import ApplicationTable from "@/components/admin/applications/ApplicationTable";
import ApplicationDetailsModal from "@/components/admin/applications/ApplicationDetailsModal"
import RejectModal from "@/components/admin/applications/RejectModal"
import LoadingState from "@/components/ui/LoadingState"
import { error } from "console";

export default function ApplicationsPage() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [error, setError] = useState<string | null>(null);

    const [applications, setApplications] =
        useState<any[]>([])

    const [loading, setLoading] = useState(true)

    const [selectedApplication, setSelectedApplication] =
        useState<any>(null)

    async function fetchApplications() {
        try {
            setLoading(true)
            const res = await axios.get("/api/admin/applications");
            setApplications(res.data.applications);
        } catch (error) {
            console.log(error);
            setError("Failed to load applications.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApplications = useMemo(() => {

        let data = applications;

        if (status !== "All") {
            data = data.filter(app => app.status === status);
        }

        if (search.trim()) {
            data = data.filter(
                app =>
                    app.name?.toLowerCase().includes(search.toLowerCase()) ||
                    app.phone?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return data;

    }, [applications, search, status]);


    const [showDetails, setShowDetails] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    function handleView(application: any) {
        setSelectedApplication(application)
        setShowDetails(true)
    }

    async function handleApprove(application: any) {
        if (actionLoading) return
        setActionLoading(true)
        try {
            await axios.patch(
                `/api/admin/applications/${application._id}`,
                { status: "approved" }
            );

            // Close modal and refresh
            setShowDetails(false)
            setSelectedApplication(null)
            await fetchApplications();

        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to approve application"
            alert(msg)
            console.log(error);
        } finally {
            setActionLoading(false)
        }
    }

    async function confirmReject(reason: string) {
        if (!reason.trim()) {
            alert("Please provide a rejection reason")
            return
        }
        if (actionLoading) return
        setActionLoading(true)
        try {
            await axios.patch(
                `/api/admin/applications/${selectedApplication._id}`,
                { status: "rejected", reason }
            );
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Failed to reject application"
            alert(msg)
            console.log(error);
        } finally {
            setActionLoading(false)
        }
    }

    function handleReject(application: any) {
        setSelectedApplication(application)
        setShowDetails(false)
        setShowReject(true)
    }

    return (
        <div className="bg-background min-h-screen">

            {/* TopBar — fixed on desktop, sticky inside admin layout on mobile */}
            <div className="hidden md:block w-full fixed top-0 z-40">
                <ApplicationTopBar />
            </div>

            {/* Mobile TopBar — shown only when NOT inside the md layout topbar */}
            <div className="md:hidden">
                <ApplicationTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-4 sm:px-6 pt-4 md:pt-6 md:mt-[72px] pb-8"
            >

                {loading ? (
                    <LoadingState label="Loading Applications..." />
                ) : error ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-card p-8 text-center text-sm text-destructive">
                        {error}
                        <button
                            onClick={fetchApplications}
                            className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <ApplicationStats applications={applications} />

                        <ApplicationFilters
                            search={search}
                            setSearch={setSearch}
                            status={status}
                            setStatus={setStatus}
                        />

                        <ApplicationTable
                            data={filteredApplications}
                            onView={handleView}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    </>
                )}

            </motion.div>

            {showDetails && selectedApplication && (
                <ApplicationDetailsModal
                    application={selectedApplication}
                    onClose={() => {
                        setShowDetails(false)
                        setSelectedApplication(null)
                    }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}

            {showReject && (
                <RejectModal
                    onClose={() => setShowReject(false)}
                    onSubmit={async (reason) => {
                        await confirmReject(reason);
                        await fetchApplications();
                        setShowReject(false);
                        setSelectedApplication(null);
                    }}
                />
            )}

        </div>
    );
}
