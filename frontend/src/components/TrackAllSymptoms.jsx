import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar,PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { UseUserContext } from "../context/UserContext.jsx";
import PieChartWithCustomizedLabel from'./PieChartOfAqi.jsx';
import {toast} from "react-toastify";
import RelatedDoctors from './RelatedDoctors.jsx';

function TrackAllSymptoms() {
  const [symptomsData, setSymptomsData] = useState([]);
  const [data, setData] = useState([]); // State to hold bar chart data
  const { uToken, backendUrl } = UseUserContext();
  const [showBarChart, setShowBarChart] = useState(true);

  const [GeminiData, setGeminiData] = useState({
    RiskLevel: "",
    PotentialConditions: [],
    DoctorSpecialization: "",
    ActionableRecommendations: {
      EmergencyCare: [],
      HomeCare: [],
    },
  });
  

  // Fetching data for LineChart, BarChart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/symptoms/track-weekly`, {
          headers: { uToken: uToken },
        });

        // console.log(data);

        if (data.success) {
          setSymptomsData(data.formattedData);
          // console.log(data.formattedData);
        } else {
          console.error('There was an error fetching the symptoms data!');
        }
      } catch (error) {
        console.error('There was an error fetching the symptoms data!', error);
      }
    };

    fetchData();
  }, [uToken, backendUrl]);

  useEffect(() => {
    const TodeySymtom = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/analyse-symptom`, {
          headers: { uToken: uToken },
        });

        // Log the barChartData for validation
        console.log( "AI data-",data.GeminiData);
        setGeminiData(data.GeminiData);

        if (data.success) {
          // Set the barChartData here
          setData(data);   

        } else {
          console.log('Error fetching bar chart data!');
        }
      } catch (error) {
        console.log('Error fetching symptoms data!', error);
      }
    };
    TodeySymtom();
  }, [uToken, backendUrl]);

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel) {
      case "Mild":
        return "bg-green-100 border-green-500 text-green-700";
      case "Moderate":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "Severe":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  const pieData = [
    { name: 'Heart Rate', value: data.heartRate || 99, fill: '#82ca9d' },
    { name: 'Oxygen Level', value: data.oxygenLevel || 83, fill: '#8884d8' },
  ];

    // Colors for the PieChart
  const COLORS = ['#82ca9d', '#8884d8'];

  return (
    <>
      
  <div className="health-assessment">

  <div
  className={`
    p-4 rounded-lg 
    ${data.oxygenStatus === "Safe" ? "bg-green-100" : ""}
    ${data.oxygenStatus === "Moderate" ? "bg-orange-100" : ""}
    ${data.oxygenStatus === "Risky" ? "bg-red-100" : ""}
  `}
>
  <h3 className="font-medium text-2xl">Vital Signs</h3>
  <ul className="list-none flex space-x-6">
    <li><strong>Heart Rate:</strong> {data.heartRate} bpm</li>
    <li><strong>Oxygen Level:</strong> {data.oxygenLevel}%</li>
    <li>
      <strong>Oxygen Status:</strong>
      <span
        className={`
          font-bold px-2 py-1 rounded-md 
          ${data.oxygenStatus === "Safe" ? "text-green-700 bg-green-200" : ""}
          ${data.oxygenStatus === "Moderate" ? "text-orange-700 bg-orange-200" : ""}
          ${data.oxygenStatus === "Risky" ? "text-red-700 bg-red-200" : ""}
        `}
      >
        {data.oxygenStatus}
      </span>
    </li>
  </ul>
  </div>


      {/* Header */}
  <div className={`p-6 sm:p-8 mt-5 rounded-lg shadow-xl w-full max-w-4xl mx-auto border ${getRiskStyles(GeminiData.RiskLevel)}`}>
  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
    Risk Level: {GeminiData.RiskLevel}
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <p className="text-lg sm:text-xl font-semibold">Potential Conditions</p>
      <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mt-2">
        {GeminiData.PotentialConditions.map((condition, index) => (
          <li key={index}>{condition}</li>
        ))}
      </ul>
    </div>
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <p className="text-lg sm:text-xl font-semibold">Doctor Specialization</p>
      <p className="text-gray-700 mt-2">{GeminiData.DoctorSpecialization}</p>
    </div>
  </div>

  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <p className="text-lg sm:text-xl font-semibold text-red-600">Emergency Care Recommendations</p>
      <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mt-2">
        {GeminiData.ActionableRecommendations.EmergencyCare.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
    <div className="bg-green-100 p-4 sm:p-6 rounded-lg shadow-md">
      <p className="text-lg sm:text-xl font-semibold text-green-600">Home Care Recommendations</p>
      <ul className="list-disc pl-4 sm:pl-6 text-gray-700 mt-2">
        {GeminiData.ActionableRecommendations.HomeCare.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  </div>
</div>


</div>

      {/* LineChart */}
      <div>
        <h2 className='font-medium text-3xl text-neutral-800 mt-4'>Track All Previous Symptoms</h2>
        <ResponsiveContainer width="100%" height={400}>
          {showBarChart ? (
            <BarChart data={symptomsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="oxygenLevel" fill="#8884d8" />
              <Bar dataKey="heartRate" fill="#82ca9d" />
            </BarChart>
          ) : (
            <LineChart data={symptomsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="oxygenLevel" stroke="#8884d8" />
              <Line type="monotone" dataKey="heartRate" stroke="#82ca9d" />
            </LineChart>
          )}
        </ResponsiveContainer>
        <button 
          className="mt-4 p-2 bg-blue-600 text-white rounded-md"
          onClick={() => setShowBarChart(!showBarChart)}
        >
          {showBarChart ? 'Show Line Chart' : 'Show Bar Chart'}
        </button>
      </div>
      <RelatedDoctors docId={98765} speciality={GeminiData.DoctorSpecialization}></RelatedDoctors>
    </>
  );
}

export default TrackAllSymptoms;
