import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar,PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { UseUserContext } from "../context/UserContext.jsx";
import PieChartWithCustomizedLabel from'./PieChartOfAqi.jsx';
import {toast} from "react-toastify";

function AqiDataRender() {

    const { uToken, backendUrl } = UseUserContext();
      const [coords, setCoords] = useState({ latitude: null, longitude: null });
      const [chartData, setChartData] = useState([]);
      const [aqi, setAqi] = useState(null);
      const [loc,setLoc]=useState("");

      // aqi ...
      useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              setCoords({ latitude, longitude });
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.log('Geolocation is not supported by this browser.');
        }
      }, []);
    
      useEffect(() => {
        const getAqiData = async () => {
          if (coords.latitude && coords.longitude) {
            try {
              const { data } = await axios.get(`${backendUrl}/api/aqi/${coords.latitude}/${coords.longitude}`);
              console.log('aqi data-', data);
              setChartData(data.chartData);
              setAqi(data.aqi);

              await getLocation();

            } catch (error) {
              console.log('Error fetching symptoms data!', error);
            }
          }
        };
        getAqiData();
      }, [coords]);

      const getLocation=async()=>{
        const url=import.meta.env.LOCATION_URL;
            try{
                const data = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
                const location=data.data;
                console.log("location- ",location.display_name);
                setLoc(location.display_name);
            }
            catch(err){
                console.log(err);
            }
      }

  return (
    <div className="aqi-container bg-white p-6 rounded-lg shadow-md">
  <h2 className="aqi-heading text-xl font-semibold mb-4 text-center">Current Air Quality Index (AQI)</h2>
  {aqi !== null && chartData.length > 0 ? (
    <div className="aqi-content grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="chart-container flex-1 max-w-md">
        <PieChartWithCustomizedLabel chartData={chartData} />
      </div>
      <div className="message-container flex-1 max-w-md text-center">
        <p className="text-xl mb-4">Your current location is {loc}</p>
        {/* Show message based on aqi value */}
        {aqi < 1 && <p className="text-green-600 font-semibold text-lg">Air Quality is Good!</p>}
        {aqi == 1 && <p className="text-yellow-500 font-semibold text-lg">Air Quality is Moderate.</p>}
        {aqi == 2 && <p className="text-orange-500 font-semibold text-lg">Air Quality is Unhealthy for Sensitive Groups.</p>}
        {aqi == 3 && <p className="text-red-500 font-semibold text-lg">Air Quality is Unhealthy.</p>}
        {aqi == 4 && <p className="text-pink-600 font-semibold text-lg">Air Quality is Very Unhealthy.</p>}
        {aqi == 5 && <p className="text-purple-700 font-semibold text-lg">Air Quality is Hazardous!</p>}


      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500">Loading AQI data...</p>
  )}
</div>
  )
}

export default AqiDataRender