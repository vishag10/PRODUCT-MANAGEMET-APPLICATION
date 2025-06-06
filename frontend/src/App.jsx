import React, { useState } from "react";
import { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Nav from "./components/nav";

const ThemeContext = createContext(null);
function App(){
  const [user, setID] = useState(null);
      return(
        <>
      <ThemeContext.Provider value={{user, setID}}>
          <BrowserRouter>
          {
            user&&<Nav user={user} setID={setID}/>
          }
             <Routes>
          
            <Route path="/" element={<Home setID={setID} />} />
             <Route path="/login" element={<Login />}  />
             <Route path="/register" element={<Register/>}  />
             <Route path="*" element={<div>404 Not Found</div>} />
             </Routes>
          </BrowserRouter>
          </ThemeContext.Provider>
        </>
      )
    }

export default App;
