import React from "react";
import "./home.css"
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "../path";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function Home({setID}){ 
  
  const navigate = useNavigate();  
  let [user, setUser] = useState(null);
  
  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token); 
  
    if (!token) {
       navigate("/login")
    }
  
    try {
      const res = await axios.get(`${apiPath()}/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 200) {
        console.log("User Data:", res.data);
        setUser(res.data.username);
        setID(res.data.username);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);

      if (error.response && error.response.data.msg === "Login time expired please login again") {
        toast.error("Session expired! Please login again.");
        localStorage.removeItem("token"); 
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };


 useEffect(() => {
  getUser();
}, []);

  return (
    <>
      <ToastContainer />
     
    </>
  );
}

export default Home;
