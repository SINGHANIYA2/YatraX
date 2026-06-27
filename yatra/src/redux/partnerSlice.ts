import { IPartner } from "@/models/partner.models"
import {createSlice} from "@reduxjs/toolkit"


interface IpartnerState{
    partnerData: IPartner |null
}

const initialState : IpartnerState = {
    partnerData : null,
}

export const partnerSlice = createSlice({
    name:'partner',
    initialState,
    reducers:{
        setPartnerData:(state , action) => {
            state.partnerData = action.payload
        }
    }
})


export const {setPartnerData} = partnerSlice.actions

export default partnerSlice.reducer