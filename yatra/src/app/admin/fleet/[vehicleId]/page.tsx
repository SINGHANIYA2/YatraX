import VehicleDetailsResponse from "../../../../../src/components/Vehicledetailspage";

export default async function Page({
    params,
}: {
    params: Promise<{ vehicleId: string }>;
}) {
    const { vehicleId } = await params;
    return <VehicleDetailsResponse vehicleId={vehicleId} />;
}