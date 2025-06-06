import React, { useState, useEffect } from "react";
import { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Nav from "./components/nav";
import Products from "./components/Products";
import Wishlist from "./components/Wishlist";

const ThemeContext = createContext(null);

function App(){
  const [user, setID] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");
    
    if (token && savedUser) {
      setID(savedUser);
    }
  }, []);

  // Save current user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", user);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  return(
    <>
      <ThemeContext.Provider value={{user, setID}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home setID={setID} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/products" element={<Products setID={setID} />} />
            <Route path="/wishlist" element={<Wishlist setID={setID} />} />
            <Route path="*" element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: '2rem',
                color: '#666'
              }}>
                <h1>404 - Page Not Found</h1>
                <p style={{fontSize: '1rem', marginTop: '10px'}}>
                  The page you're looking for doesn't exist.
                </p>
                <a href="/" style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: '#4CAF50',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px'
                }}>
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </>
  )
}

export default App;