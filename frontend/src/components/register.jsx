import "./register.css";
import axios from "axios";
import apiPath from "../path";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Register() {
  const [data, setData] = useState({ username: "", email: "", password: "", cpassword: "", profile: "" });
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/adduser`, data);
      console.log(data);

      if (res.status === 201) {
        setCount(count + 1);
        alert(res.data.msg);
        setData({ username: "", email: "", password: "", cpassword: "", profile: "" }); 
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      

      <div className="form-container">
        <h2>Register</h2>
        <form className="registration-form" id="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) => setData((pre) => ({ ...pre, [e.target.name]: e.target.value }))}
              value={data.username}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setData((pre) => ({ ...pre, [e.target.name]: e.target.value }))}
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
              onChange={(e) => setData((pre) => ({ ...pre, [e.target.name]: e.target.value }))}
              value={data.password}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="cpassword"
              onChange={(e) => setData((pre) => ({ ...pre, [e.target.name]: e.target.value }))}
              value={data.cpassword}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        <span>
          Already have an account?{" "}
          <a href="../pages/login.html" className="click">Click here</a>
          <a href="../index.html" className="btna">Home</a>
        </span>
      </div>
    </>
  );
}

export default Register;
