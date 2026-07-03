import DriverDetailsPage from "../../../../components/admin/drivers/Driverdetailspage";

export default async function Page({
    params,
}: {
    params: Promise<{ partnerId: string }>;
}) {
    const { partnerId } = await params;
    console.log("Rendering DriverDetailsPage for partnerId:", partnerId);
    return <DriverDetailsPage partnerId={partnerId} />;
}