import { IAdmin } from "@/models/admin.models"

import {createSlice} from "@reduxjs/toolkit"


interface IadminState{
    adminData: IAdmin |null
}

const initialState : IadminState = {
    adminData : null,
}

export const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdminData:(state , action) => {
            state.adminData = action.payload
        }
    }
})


export const {setAdminData} = adminSlice.actions

export default adminSlice.reducer