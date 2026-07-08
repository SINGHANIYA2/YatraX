import { IVehicle } from "@/models/vehicle.models"
import { createSlice } from "@reduxjs/toolkit"

interface IVehicleState {
    vehicleData: IVehicle | null
}

const initialState: IVehicleState = {
    vehicleData: null,
}

export const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setVehicleData: (state, action) => {
            state.vehicleData = action.payload
        }
    }
})

export const { setVehicleData } = vehicleSlice.actions

export default vehicleSlice.reducer