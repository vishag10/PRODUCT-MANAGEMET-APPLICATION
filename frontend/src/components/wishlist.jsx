import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Nav from "./nav";
import "./wishlist.css";

function Wishlist({ setID }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user info
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

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Product removed from wishlist!");
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
    toast.success("Wishlist cleared!");
  };

  const getTotalValue = () => {
    return wishlist.reduce((total, item) => total + item.price, 0);
  };

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} />
      
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Your favorite electronic products</p>
          
          {wishlist.length > 0 && (
            <div className="wishlist-stats">
              <span className="item-count">{wishlist.length} items</span>
              <span className="total-value">Total Value: ${getTotalValue()}</span>
              <button className="clear-btn" onClick={clearWishlist}>
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">💔</div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to see them here</p>
            <Link to="/products" className="browse-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(product => (
              <div key={product.id} className="wishlist-item">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">${product.price}</div>
                  
                  <div className="product-actions">
                    <button className="buy-btn">Buy Now</button>
                    <button className="move-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <div className="wishlist-actions">
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
            <button className="buy-all-btn">
              Buy All Items (${getTotalValue()})
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;