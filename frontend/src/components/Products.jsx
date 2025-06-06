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
   
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

  
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(savedUser);
      setID(savedUser);
    }

    
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
       
        const enhancedWishlist = parsedWishlist.map(item => ({
          ...item,
          addedAt: item.addedAt || new Date().toISOString(),
          wishlistId: item.wishlistId || `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
        setWishlist(enhancedWishlist);
        
     
        if (JSON.stringify(parsedWishlist) !== JSON.stringify(enhancedWishlist)) {
          localStorage.setItem("wishlist", JSON.stringify(enhancedWishlist));
        }
      } catch (error) {
        console.error("Error parsing wishlist:", error);
        setWishlist([]);
        localStorage.removeItem("wishlist");
      }
    }
  }, [navigate, setID]);

 
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
        wishlistId: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedFrom: 'products_page' 
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

      
      console.log(`Product added to wishlist from Products page at ${new Date().toLocaleString()}:`, {
        product: enhancedProduct.name,
        price: enhancedProduct.price,
        category: enhancedProduct.category,
        addedAt: enhancedProduct.addedAt,
        wishlistId: enhancedProduct.wishlistId
      });
    } else {
      const existingItem = wishlist.find(item => item.id === product.id);
      toast.info(`${product.name} is already in your wishlist!`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      
      if (existingItem) {
        console.log(`Duplicate add attempt for product already in wishlist since ${new Date(existingItem.addedAt).toLocaleString()}:`, product.name);
      }
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
      const timeInWishlist = new Date() - new Date(productToRemove.addedAt);
      const daysInWishlist = Math.floor(timeInWishlist / (1000 * 60 * 60 * 24));
      const hoursInWishlist = Math.floor((timeInWishlist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesInWishlist = Math.floor((timeInWishlist % (1000 * 60 * 60)) / (1000 * 60));
      
      console.log(`Product removed from wishlist from Products page:`, {
        product: productToRemove.name,
        addedAt: new Date(productToRemove.addedAt).toLocaleString(),
        removedAt: new Date().toLocaleString(),
        timeInWishlist: `${daysInWishlist} days, ${hoursInWishlist} hours, ${minutesInWishlist} minutes`,
        addedFrom: productToRemove.addedFrom || 'unknown'
      });
    }
  };

  
  const getCategoryStats = () => {
    const categoryCount = {};
    wishlist.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    return categoryCount;
  };


  const getRecentActivity = () => {
    const recent = [...wishlist]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, 3);
    return recent;
  };

  const categories = ["All", "Smartphones", "Laptops", "Audio", "Tablets", "Wearables", "Gaming"];
  const categoryStats = getCategoryStats();
  const recentActivity = getRecentActivity();

 
  useEffect(() => {
    if (wishlist.length > 0) {
      console.log("Wishlist category breakdown:", categoryStats);
      console.log("Recent wishlist activity:", recentActivity.map(item => ({
        name: item.name,
        addedAt: new Date(item.addedAt).toLocaleString(),
        category: item.category
      })));
    }
  }, [wishlist]);

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} wishlistCount={wishlist.length} />
      
      <div className="products-page">
        <div className="products-header">
          <h1>Electronic Products</h1>
          <p>Browse our collection of premium electronic devices</p>
          
          {wishlist.length > 0 && (
            <div className="wishlist-summary">
              <p>You have {wishlist.length} items in your wishlist</p>
              {recentActivity.length > 0 && (
                <div className="recent-additions">
                  <small>Recently added: {recentActivity[0].name}</small>
                </div>
              )}
            </div>
          )}
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
                {categoryStats[category] && (
                  <span className="category-wishlist-count">
                    ({categoryStats[category]} in wishlist)
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {Object.keys(categoryStats).length > 0 && (
            <div className="category-summary">
              <small>
                Wishlist breakdown: {Object.entries(categoryStats)
                  .map(([cat, count]) => `${cat}: ${count}`)
                  .join(', ')}
              </small>
            </div>
          )}
        </div>

        <ProductList 
          addToWishlist={addToWishlist} 
          removeFromWishlist={removeFromWishlist}
          wishlist={wishlist}
          selectedCategory={selectedCategory}
        />
      </div>
    </>
  );
}

export default Products;