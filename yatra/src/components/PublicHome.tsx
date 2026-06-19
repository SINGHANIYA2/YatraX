"use client"
import React, { useState } from 'react'
import HeroSection from './HomeSection'

import AuthModal from './AuthModal'
import Footer from './Footer'
import HomeSection from './HomeSection'

function PublicHome() {
    const [authOpen,setAuthOpen]=useState(true)
  return (
    <>

      <HomeSection onAuthRequired={()=>setAuthOpen(true)}/>

      <Footer/>
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/>
      
    </>
  )
}

export default PublicHome
