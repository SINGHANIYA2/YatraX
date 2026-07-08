import { IUser } from "../models/user.models"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface IuserState {
    userData: IUser | null
}

const initialState: IuserState = {
    userData: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<IUser | null>) => {
            // cast to any to avoid Immer/DOM-derived type incompatibilities
            state.userData = action.payload as any
        }
    }
})


export const { setUserData } = userSlice.actions

export default userSlice.reducer