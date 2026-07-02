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

export default function ApplicationsPage() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [applications, setApplications] =
        useState<any[]>([])

    const [loading, setLoading] = useState(true)

    const [selectedApplication, setSelectedApplication] =
        useState<any>(null)

    async function fetchApplications() {

        try {

            const res =
                await axios.get(
                    "/api/partner/application"
                );

            setApplications(
                res.data.applications
            );

        } catch (error) {
            console.log(error);
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
            data = data.filter(
                app => app.status === status
            );
        }

        if (search.trim()) {
            data = data.filter(
                app =>
                    app.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||

                    app.phone
                        .toLowerCase()
                        .includes(search.toLowerCase())
            );
        }

        return data;

    }, [applications, search, status]);


    const [showDetails, setShowDetails] =
        useState(false)

    const [showReject, setShowReject] =
        useState(false)

    function handleView(application: any) {
        setSelectedApplication(application)
        setShowDetails(true)
    }

    async function handleApprove(application: any) {

        try {

            await axios.patch(
                `/api/partner/application/${application._id}`,
                {
                    status: "approved"
                }
            );

            alert("Application Approved");

        } catch (error) {
            console.log(error);
        }
    }

    async function confirmReject(reason: string) {
        try {

            await axios.patch(
                `/api/partner/application/${selectedApplication._id}`,
                {
                    status: "rejected",
                    reason,
                }
            );

            alert("Application Rejected");

        } catch (error) {
            console.log(error);
        }
    }

    function handleReject(application: any) {
        setSelectedApplication(application)
        setShowDetails(false)
        setShowReject(true)
    }

    if (loading) {
        return (
            <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-background
            text-foreground
        ">
                Loading Applications...
            </div>
        )
    }
    return (
        <div className="bg-background min-h-screen">

            <div className="w-full fixed top-0 z-40">
                <ApplicationTopBar />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="px-6 pt-6 mt-[100px]"
            >

                <ApplicationStats />

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
            </motion.div>
            {
                showDetails &&
                selectedApplication && (
                    <ApplicationDetailsModal
                        application={selectedApplication}
                        onClose={() => setShowDetails(false)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )
            }
            {
                showReject && (
                    <RejectModal
                        onClose={() => setShowReject(false)}
                        onSubmit={async (reason) => {

                            await confirmReject(reason);

                            await fetchApplications();

                            setShowReject(false);

                            setSelectedApplication(null);

                        }}
                    />
                )
            }

        </div>
    );
}