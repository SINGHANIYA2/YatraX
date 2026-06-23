import Image from "next/image";
import { Icon } from "lucide-react";

type VehicleProps = {
    vehicle: {
        id: number;
        name: string;
        type: string;
        image: string;
        from: string;
        to: string;
        icon: any
        departureTime: string;
        arrivalTime: string;
        availableSeats: number;
        price: number;
    };
};



function VehicleCard({ vehicle }: VehicleProps) {
    const Icon = vehicle.icon
    return (
        <div className="bg-[#07142C] rounded-xl p-4 flex gap-5 pr-[23px] border shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/10">

            <Icon
                size={50}
                className="text-blue-400"
            />

            <div className="flex-1">
                <h3 className="font-semibold text-lg">
                    {vehicle.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                    {vehicle.type}
                </p>
            </div>

            {/* travel details */}
            <div className="flex flex-col gap-[15px]">
                <div className="flex justify-between gap-[110px]">
                    <span>{vehicle.departureTime}</span>
                    <span>{vehicle.arrivalTime}</span>
                </div>

                <div className="text-sm text-gray-400 flex justify-between py-3">
                    {vehicle.from}
                    <span className="">
                        {vehicle.to}
                    </span>
                </div>

                <div className="flex justify-between">
                    <p className="text-[15px] text-gray-400">{vehicle.availableSeats} Seats Available</p>
                    <span
                        className="text-green-400 
                        font-bold text-right"
                    >
                        ₹{vehicle.price}
                    </span>
                </div>
            </div>

        </div>
    );
}

export default VehicleCard;