import React from 'react'
import Headers from '../components/Header'
import SpecialityMeanu from '../components/SpecialityMeanu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

function Home() {
  return (
    <div>
        <div className="emergency-alert mt-6 p-4 bg-red-100 border-l-4 border-red-600 rounded-md mb-9">
          <h3 className="font-medium text-xl text-red-600">Emergency Alert</h3>
          <p className="text-sm text-red-700 mt-2">
            Your oxygen level is risky. Please take immediate action and alert emergency services.
          </p>
          <div className="mt-4 flex space-x-4">
            <button className="p-2 bg-red-600 text-white rounded-md">Send Alert</button>
          </div>
        </div>
      <Headers/>
      <SpecialityMeanu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home