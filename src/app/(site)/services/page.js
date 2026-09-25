import React from 'react'
import ServicesPage from '@/components/services/services'
import {Suspense} from "react"; 

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ServicesPage/>
      </Suspense>
    </div>
  )
}

export default Page
