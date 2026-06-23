"use client"
import React, { useState } from 'react'
import Footer from './Footer'
import HeroSection from './HeroSection'
// import AuthModal from './AuthModal'




function PublicHome() {
  const [authOpen, setAuthOpen] = useState(true)
  return (
    <>
      <HeroSection />
      {/* <HowItWork/> */}

      <Footer />
    </>
  )
}

export default PublicHome
