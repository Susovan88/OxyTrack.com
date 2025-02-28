import React from 'react'
import Headers from '../components/Header'
import SpecialityMeanu from '../components/SpecialityMeanu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

function Home() {
  return (
    <div>
          {/* <div className="mt-4 mb-4 flex space-x-4">
            <button className="p-2 bg-red-600 text-white rounded-md">Send Alert</button>
          </div> */}
      <Headers/>
      <SpecialityMeanu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home