import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Nav from "./nav";
import ProductList from "./ProductList";
import "./products.css";

function Products({ setID }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user info from localStorage or make API call
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(savedUser);
      setID(savedUser);
    }

    // Load wishlist
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, [navigate, setID]);

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

  const categories = ["All", "Smartphones", "Laptops", "Audio", "Tablets", "Wearables", "Gaming"];

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} />
      
      <div className="products-page">
        <div className="products-header">
          <h1>Electronic Products</h1>
          <p>Browse our collection of premium electronic devices</p>
        </div>

        <div className="filters-section">
          <h3>Filter by Category:</h3>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <ProductList 
          addToWishlist={addToWishlist} 
          wishlist={wishlist}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}

export default Products;