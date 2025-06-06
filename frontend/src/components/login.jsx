import "./login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "../path";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/login`, data);
      if (res.status === 200) {
        const { token, msg } = res.data; 
        if (token) {
          console.log("Token received:", token);
          localStorage.setItem("token", token);
          toast.success(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            }); 
          setData({ email: "", password: "" });
          setTimeout(() => navigate("/"), 3000);
        } 
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      alert(error)
    }
  };

  return (
    <>
      
      <ToastContainer />
      <div className="form-container">
        <h2>Login</h2>
        <form className="login-form" id="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              value={data.email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              value={data.password}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
          
        </form>
        <span>
          Don't have an account?{" "}
          <Link to={"/register"}>
            <span className="click">Click here</span>
          </Link>
          
        </span>
      </div>
    </>
  );
}

export default Login;
