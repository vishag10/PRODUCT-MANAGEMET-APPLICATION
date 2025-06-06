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
import Nav from "./nav";
import ProductList from "./ProductList";

function Home({setID}){ 
  
  const navigate = useNavigate();  
  let [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
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

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
    if (!isAlreadyInWishlist) {
      setWishlist([...wishlist, product]);
      toast.success(`${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} is already in your wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    toast.success("Product removed from wishlist!");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} />
      
      <div className="main-content">
        <div className="hero-section">
          <h1>Welcome to Electronics Store</h1>
          <p>Discover amazing electronic products and manage your wishlist</p>
          
          <div className="action-buttons">
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
            <Link to="/wishlist" className="btn btn-secondary">
              View Wishlist ({wishlist.length})
            </Link>
          </div>
        </div>

        <ProductList 
          addToWishlist={addToWishlist} 
          wishlist={wishlist}
          showTitle={true}
        />
      </div>
    </>
  );
}

export default Home;