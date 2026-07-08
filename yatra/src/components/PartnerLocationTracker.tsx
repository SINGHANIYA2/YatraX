'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSocket } from '@/lib/socket';

export default function PartnerLocationTracker() {
    const { data: session, status } = useSession();

    const { partnerData } = useSelector((state: RootState) => state.partner);

    useEffect(() => {
        if (status !== 'authenticated' ||session?.user?.role !== 'partner' || !partnerData?.assignedVehicleId) {
            return;
        }

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('identity', {
            partnerId: partnerData._id,
            vehicleId: partnerData.assignedVehicleId,
        });

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                socket.emit("partner:location", {
                    vehicleId: partnerData.assignedVehicleId,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed ?? 0,
                    heading: position.coords.heading ?? 0,
                });
            },
            (error) => {
                // console.error("Code:", error.code);
                // console.error("Message:", error.message);
                
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(
                watchId
            );
        };
    }, [
        status,
        session,
        partnerData,
    ]);

    return null;
}