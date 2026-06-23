
import { setUserData } from "@/redux/userSlice"
import axios from "axios"
import { useEffect } from "react"
import React from 'react'
import { useDispatch } from "react-redux"

function useGetMe(enabled:boolean) {
    const dispatch = useDispatch()
    useEffect(() => {
        if(!enabled) return
        const getMe=async () =>{
            try{
                const {data} = await axios.get("/api/user/me")
                dispatch(setUserData(data))
            }catch(err){
                console.log(err)
            }
        }
        getMe()
    },[enabled])
}

export default useGetMe
