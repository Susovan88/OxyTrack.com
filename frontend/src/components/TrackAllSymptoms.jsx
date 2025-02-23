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
  const [showBarChart, setShowBarChart] = useState(false);

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
          setData(data);   // Assuming you have a state for barChartData
        } else {
          console.log('Error fetching bar chart data!');
        }
      } catch (error) {
        console.log('Error fetching symptoms data!', error);
      }
    };
    TodeySymtom();
  }, [uToken, backendUrl]);

  const pieData = [
    { name: 'Heart Rate', value: data.heartRate || 99, fill: '#82ca9d' },
    { name: 'Oxygen Level', value: data.oxygenLevel || 83, fill: '#8884d8' },
  ];

    // Colors for the PieChart
  const COLORS = ['#82ca9d', '#8884d8'];

  return (
    <>
      
      <div className="health-assessment">

      <h3 className="font-medium text-2xl">Vital Signs</h3>
      <ul className="list-none flex space-x-6">
      <li><strong>Heart Rate:</strong> {data.heartRate} bpm</li>
      <li><strong>Oxygen Level:</strong> {data.oxygenLevel}%</li>
      <li><strong>Oxygen Status:</strong> {data.oxygenStatus}</li>
      </ul>

      {/* Header */}
      <h2 className="font-medium text-3xl text-neutral-800 mt-4">Personalized Health Assessment</h2>

  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md pb-10">
    <h2 className={`text-2xl font-bold mb-4}`}>
      Risk Level: {GeminiData.RiskLevel}
    </h2>
    <p className="text-lg font-semibold">Potential Conditions:</p>
    <ul className="list-disc pl-6 text-gray-700">
      {GeminiData.PotentialConditions.map((condition, index) => (
        <li key={index}>{condition}</li>
      ))}
    </ul>
    <p className="mt-4 text-lg font-semibold">Doctor Specialization:</p>
    <p className="text-gray-700">{GeminiData.DoctorSpecialization}</p>
    <p className="mt-4 text-lg font-semibold text-red-600">Emergency Care Recommendations:</p>
    <ul className="list-disc pl-6 text-gray-700">
      {GeminiData.ActionableRecommendations.EmergencyCare.map((rec, index) => (
        <li key={index}>{rec}</li>
      ))}
    </ul>
    <p className="mt-4 text-lg font-semibold text-green-600">Home Care Recommendations:</p>
    <ul className="list-disc pl-6 text-gray-700">
      {GeminiData.ActionableRecommendations.HomeCare.map((rec, index) => (
        <li key={index}>{rec}</li>
      ))}
    </ul>
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
