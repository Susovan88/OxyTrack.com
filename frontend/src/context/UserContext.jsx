import { createContext,useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";


const UserContext=createContext();

const UserContextProvider=({children})=>{

    const storedToken = localStorage.getItem("uToken") || "";
    const [uToken, setUToken] = useState(storedToken);
    const [user,setUser]=useState({});
    const navigate=useNavigate();
    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const value={
        uToken,setUToken,backendUrl,user
    }

    useEffect(() => {
        if (uToken) {
          localStorage.setItem("uToken", uToken);
        } else {
          localStorage.removeItem("uToken");
        }
      }, [uToken]);


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
                setUser(data.user);
              }
            }
          }catch(err){
            toast.error(err.message);
          }
        }
        getUserData();
      },[uToken, backendUrl]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

const UseUserContext=()=>{
    return useContext(UserContext);
}

export default UserContextProvider;
export {UserContext,UseUserContext};