'use client'
import {useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

function SearchMap() {
  const params = useSearchParams()
  const [source,setSource] = useState(params.get("source") || "")
  const [destination ,setDestination] = useState(params.get("destination") || "")
  const srcLat = Number(params.get("srcLat"))
  const destLat = Number(params.get("destLat"))
  const srcLong = Number(params.get("srcLong"))
  const destLong = Number(params.get("destLong"))


  return (
    <div>

    </div>
  )
}

export default SearchMap