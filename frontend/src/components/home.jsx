import React from "react";
import "./home.css";
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

function Home({ setID }) {
  const navigate = useNavigate();
  let [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);

    if (!token) {
      navigate("/login");
      return;
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
        localStorage.setItem("currentUser", res.data.username);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);

      if (error.response && error.response.data.msg === "Login time expired please login again") {
        toast.error("Session expired! Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);

        const enhancedWishlist = parsedWishlist.map(item => ({
          ...item,
          addedAt: item.addedAt || new Date().toISOString(), 
          id: item.id || Date.now() + Math.random() 
        }));
        setWishlist(enhancedWishlist);
       
        localStorage.setItem("wishlist", JSON.stringify(enhancedWishlist));
      } catch (error) {
        console.error("Error parsing wishlist:", error);
        setWishlist([]);
      }
    }
  }, []);


  useEffect(() => {
    if (wishlist.length >= 0) { 
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
    if (!isAlreadyInWishlist) {
      const enhancedProduct = {
        ...product,
        addedAt: new Date().toISOString(),
        wishlistId: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      const updatedWishlist = [...wishlist, enhancedProduct];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      toast.success(`${product.name} added to wishlist!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

  
      console.log(`Product added to wishlist at ${new Date().toLocaleString()}:`, enhancedProduct);
    } else {
      toast.info(`${product.name} is already in your wishlist!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    const productToRemove = wishlist.find(item => item.id === productId);
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    
    toast.success("Product removed from wishlist!", {
      position: "top-right",
      autoClose: 3000,
    });

   
    if (productToRemove) {
      console.log(`Product removed from wishlist at ${new Date().toLocaleString()}:`, {
        product: productToRemove.name,
        originallyAddedAt: productToRemove.addedAt,
        removedAt: new Date().toISOString()
      });
    }
  };


  const clearWishlist = () => {
    if (window.confirm(`Are you sure you want to clear all ${wishlist.length} items from your wishlist?`)) {
      const clearedItems = [...wishlist];
      setWishlist([]);
      localStorage.setItem("wishlist", JSON.stringify([]));
      
      toast.success("Wishlist cleared successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      
      console.log(`Wishlist cleared at ${new Date().toLocaleString()}. Removed ${clearedItems.length} items:`, clearedItems);
    }
  };

 
  const getWishlistStats = () => {
    if (wishlist.length === 0) return null;

    const sortedByDate = [...wishlist].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    const oldestItem = sortedByDate[0];
    const newestItem = sortedByDate[sortedByDate.length - 1];
    const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);

    return {
      totalItems: wishlist.length,
      totalValue,
      oldestItem: {
        name: oldestItem.name,
        addedAt: oldestItem.addedAt
      },
      newestItem: {
        name: newestItem.name,
        addedAt: newestItem.addedAt
      }
    };
  };

  useEffect(() => {
    getUser();
  }, []);

 
  useEffect(() => {
    const stats = getWishlistStats();
    if (stats) {
      console.log("Current Wishlist Statistics:", stats);
    }
  }, [wishlist]);

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} wishlistCount={wishlist.length} />
      
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
            {wishlist.length > 0 && (
              <button onClick={clearWishlist} className="btn btn-danger">
                Clear Wishlist
              </button>
            )}
          </div>
        </div>

        <ProductList 
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
          wishlist={wishlist}
          showTitle={true}
        />
      </div>
    </>
  );
}

export default Home;