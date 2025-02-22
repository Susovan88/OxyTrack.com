// import React, { useState, useEffect } from 'react';
// import { assets } from '../assets/assets_frontend/assets.js';
// import { UseUserContext } from '../context/UserContext';
// import { toast } from "react-toastify";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function MyProfile() {
//   const [isEdit, setIsEdit] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [userImg, setUserImg] = useState(null);
//   const [userData, setUserData] = useState(null);
  // const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", email: "" });

//   const navigate = useNavigate();
//   const { uToken, backendUrl } = UseUserContext();

//   const handleSaveBtn = async () => {
//     try {
//       let formData = new FormData();
//       formData.append("name", userData.name);
//       formData.append("phone", userData.phone);
//       formData.append("dob", userData.dob);
//       formData.append("gender", userData.gender);
//       formData.append("address[line1]", userData.address.line1);
//       formData.append("address[line2]", userData.address.line2);
      // formData.append("emergencyContact[name]", emergencyContact.name);
      // formData.append("emergencyContact[phone]", emergencyContact.phone);
      // formData.append("emergencyContact[email]", emergencyContact.email);
      
//       if (userImg) {
//         formData.append("image", userImg);
//       }

//       const { data } = await axios.put(`${backendUrl}/api/user/profile`, formData, { headers: { uToken } });
//       if (data.success) {
//         toast.success("Profile updated successfully!");
//         setUserData(data.user);
//         setIsEdit(false);
//         setEmergencyContact({ name: "", phone: "", email: "" });
//       } else {
//         toast.error(data.message || "Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         if (!uToken) {
//           toast.error("No token found! Please log in again.");
//           navigate('/login');
//         } else {
//           const { data } = await axios.get(`${backendUrl}/api/user/profile`, { headers: { uToken } });
//           if (!data.success) {
//             toast.error("User not found. Please log in again.");
//             navigate('/login');
//           } else {
//             setUserData(data.user);
//             setLoading(false);
//           }
//         }
//       } catch (err) {
//         toast.error(err.message);
//       }
//     };
//     getUserData();
//   }, [uToken, backendUrl, navigate]);

//   return loading ? (
//     <>Loading....</>
//   ) : (
//     <div className='max-w-lg flex flex-col gap-2 text-sm'>
//       {!isEdit ? (
//         <img src={userData.image} className='w-36 rounded' alt='Profile' />
//       ) : (
//         <div className='flex items-center gap-4 mb-8 text-gray-500'>
//           <label htmlFor="doc-img">
//             <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={userImg ? URL.createObjectURL(userImg) : assets.upload_icon} alt='Upload' />
//           </label>
//           <input onChange={(e) => setUserImg(e.target.files[0])} type="file" id="doc-img" hidden />
//           <p>Upload picture</p>
//         </div>
//       )}
//       {isEdit ? (
//         <input className='bg-gray-100 text-3xl font-medium max-w-60 mt-4' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
//       ) : (
//         <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
//       )}
//       <hr className='bg-zinc-400 h-[1px] border-none' />
//       <div>
//         <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
//         <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
//           <p className='font-medium'>Email:</p>
//           <p className='text-blue-500'>{userData.email}</p>
//           <p className='font-medium'>Phone:</p>
//           {isEdit ? (
//             <input className='bg-gray-100 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
//           ) : (
//             <p className='text-blue-400'>{userData.phone}</p>
//           )}
//           <p className='font-medium'>Address:</p>
//           {!isEdit ? (
//             <p className='text-gray-500'>{userData.address.line1}<br />{userData.address.line2}</p>
//           ) : (
//             <p>
//               <input className='bg-gray-100' type="text" value={userData.address.line1} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} /><br />
//               <input className='bg-gray-100' type="text" value={userData.address.line2} onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
//             </p>
//           )}
//         </div>
//       </div>
//       {isEdit && (
//         <div>
//           <p className='text-neutral-500 underline mt-3'>EMERGENCY CONTACT</p>
//           <input className='bg-gray-100 max-w-52' type="text" placeholder='Name' value={emergencyContact.name} onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))} />
//           <input className='bg-gray-100 max-w-52' type="text" placeholder='Phone' value={emergencyContact.phone} onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))} />
//           <input className='bg-gray-100 max-w-52' type="text" placeholder='Email' value={emergencyContact.email} onChange={(e) => setEmergencyContact(prev => ({ ...prev, email: e.target.value }))} />
//         </div>
//       )}
//       <div className='mt-10'>
//         {isEdit ? (
//           <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition' onClick={handleSaveBtn}>Save Information</button>
//         ) : (
//           <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition' onClick={() => setIsEdit(true)}>Edit</button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MyProfile;








import React, { useReducer } from 'react'
import { assets } from '../assets/assets_frontend/assets.js';
import { useState,useEffect } from 'react';
import { UseUserContext } from '../context/UserContext';
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";

function MyProfile() {
  const [isEdit,setIsEdit]=useState(false);
  const [loading, setLoading] = useState(true);
  const [userImg,setUserImg]=useState(null);
  const [emergencyContact, setEmergencyContact] = useState({ name: "", phone: "", email: "" });

  const [userData,setUserdata]=useState(null);

  const navigate=useNavigate();

  const {uToken,setUToken,backendUrl,}=UseUserContext();

  const handleSaveBtn=async()=>{
    console.log(userImg);
    try {

      let formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append("address[line1]", userData.address.line1);
      formData.append("address[line2]", userData.address.line2);
      formData.append("emergencyContact[name]", emergencyContact.name);
      formData.append("emergencyContact[phone]", emergencyContact.phone);
      formData.append("emergencyContact[email]", emergencyContact.email);
      
      if (userImg) {
        formData.append("image", userImg);
      }

      const {data}=await axios.put(backendUrl+`/api/user/profile`,formData,{headers:{uToken:uToken}});
      if (data.success) {
        toast.success("Profile updated successfully!");
        setUserdata(data.user);
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    const getUserData=async()=>{
      try{
        if(!uToken){
          toast.error("Not Token found! Please Log in again.");
          navigate('/login');
        }
        else{
          const {data}=await axios.get(backendUrl+`/api/user/profile`,{headers:{uToken:uToken}});
          if(!data.success){
            toast.error("User Not Found. Please Log In Again...");
            navigate('/login');
          }
          else{
            console.log(data.user);
            setUserdata(data.user);
            setLoading(false);
          }
        }
      }catch(err){
        toast.error(err.message);
      }
    }
    getUserData();
  },[uToken, backendUrl,navigate]);

  return loading? (<>Loding....</>): (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {!isEdit?
      <img src={userData.image} className='w-36 rounded' />
       : <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
          <img className='w-16 bg-gray-100 rounded-full cursor-pointer ' src={userImg? URL.createObjectURL(userImg) : assets.upload_icon} alt="" />
          </label>
          <input onChange={(e)=>setUserImg(e.target.files[0])} type="file" id="doc-img" hidden/>
          <p>Uploade Docter<br/> picture</p>
      </div>
      }
      {
        isEdit
        ? <input className='bg-gray-100 text-3xl font-medium max-w-60 mt-4' type="text" onChange={(e)=>setUserdata(prev=>({...prev,name:e.target.value}))} value={userData.name} /> 
        : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none'/>
      <div>
        <p className='text-neutral-500 underline mt-3 '>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit
            ? <input className='bg-gray-100 max-w-52 ' type="text" onChange={(e)=>setUserdata(prev=>({...prev,phone:e.target.value}))} value={userData.phone} /> 
            : <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
            !isEdit 
            ? <p className='text-gray-500'>
              {userData.address.line1}
            <br />
              {userData.address.line2}
            </p>
            : <p>
              <input className='bg-gray-100' type="text" value={userData.address.line1} onChange={(e)=>setUserdata((prev)=> ({...prev,address:{...prev.address,line1:e.target.value}}))}/>
              <br />
              <input className='bg-gray-100 ' type="text" value={userData.address.line2} onChange={(e)=>setUserdata((prev)=> ({...prev,address:{...prev.address,line2:e.target.value}}))} />
              </p>
          }
        </div>
      </div>
      <div>
      <p className='text-neutral-500 underline mt-3'>BASIC INFORMATIONS:</p>
      <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
        <p className='font-medium'>Gender:</p>
        {isEdit ? (
          <select className='max-w-20 bg-gray-100'
            value={userData.gender}
            onChange={(e) =>
              setUserdata((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Not Selected">Not Selected</option>
          </select>
        ) : (
          <p className='text-gray-500'>{userData.gender}</p>
        )}
        <p className='font-medium'>Birthday:</p>
        {isEdit ? (
          <input className='max-w-28 bg-gray-100'
            type="date"
            value={userData.dob}
            onChange={(e) =>
              setUserdata((prev) => ({ ...prev, dob: e.target.value }))
            }
          />
        ) : (
          <p className='text-gray-500'>{userData.dob}</p>
        )}
      </div>
    </div>
      {isEdit && (
        <div>
          <p className='text-neutral-500 underline mt-3'>EMERGENCY CONTACT</p>
          <input className='bg-gray-100 max-w-52' type="text" placeholder='Name' value={emergencyContact.name} onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))} />
          <input className='bg-gray-100 max-w-52' type="text" placeholder='Phone' value={emergencyContact.phone} onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))} />
          <input className='bg-gray-100 max-w-52' type="text" placeholder='Email' value={emergencyContact.email} onChange={(e) => setEmergencyContact(prev => ({ ...prev, email: e.target.value }))} />
        </div>
      )}
    <div className='mt-10'>
      {
        isEdit
        ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition' onClick={() =>{ setIsEdit(!isEdit); handleSaveBtn();}}>Save Information</button>
        : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition' onClick={() => setIsEdit(!isEdit)}>Edit</button>
      }
    </div>
    </div>
  )
}

export default MyProfile;
