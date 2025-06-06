import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Nav from "./nav";
import "./wishlist.css";

function Wishlist({ setID }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name, price

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

    // Load wishlist with enhanced error handling
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Ensure all items have timestamps
        const enhancedWishlist = parsedWishlist.map(item => ({
          ...item,
          addedAt: item.addedAt || new Date().toISOString(),
          wishlistId: item.wishlistId || `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));
        setWishlist(enhancedWishlist);
        
        // Save back the enhanced version if it was modified
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

  const removeFromWishlist = (productId) => {
    const productToRemove = wishlist.find(item => item.id === productId);
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    
    toast.success("Product removed from wishlist!", {
      position: "top-right",
      autoClose: 3000,
    });

    // Log the removal with detailed timestamp info
    if (productToRemove) {
      const timeInWishlist = new Date() - new Date(productToRemove.addedAt);
      const daysInWishlist = Math.floor(timeInWishlist / (1000 * 60 * 60 * 24));
      const hoursInWishlist = Math.floor((timeInWishlist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      console.log(`Product removed from wishlist:`, {
        product: productToRemove.name,
        addedAt: new Date(productToRemove.addedAt).toLocaleString(),
        removedAt: new Date().toLocaleString(),
        timeInWishlist: `${daysInWishlist} days, ${hoursInWishlist} hours`
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

      // Log detailed clearing information
      console.log(`Wishlist cleared at ${new Date().toLocaleString()}:`);
      clearedItems.forEach(item => {
        const timeInWishlist = new Date() - new Date(item.addedAt);
        const daysInWishlist = Math.floor(timeInWishlist / (1000 * 60 * 60 * 24));
        console.log(`- ${item.name}: Added ${new Date(item.addedAt).toLocaleString()}, was in wishlist for ${daysInWishlist} days`);
      });
    }
  };

  const getTotalValue = () => {
    return wishlist.reduce((total, item) => total + (item.price || 0), 0);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const addedTime = new Date(timestamp);
    const diffMs = now - addedTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getSortedWishlist = () => {
    const sorted = [...wishlist];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted;
    }
  };

  const getWishlistStats = () => {
    if (wishlist.length === 0) return null;

    const sortedByDate = [...wishlist].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    const oldestItem = sortedByDate[0];
    const newestItem = sortedByDate[sortedByDate.length - 1];
    
    return {
      oldestItem,
      newestItem,
      averagePrice: wishlist.reduce((sum, item) => sum + (item.price || 0), 0) / wishlist.length
    };
  };

  const stats = getWishlistStats();
  const sortedWishlist = getSortedWishlist();

  return (
    <>
      <ToastContainer />
      <Nav user={user} setID={setID} wishlistCount={wishlist.length} />
      
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Your favorite electronic products with timestamps</p>
          
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
          <>
            <div className="wishlist-controls">
              <div className="sort-controls">
                <label htmlFor="sortBy">Sort by: </label>
                <select 
                  id="sortBy" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price">Price (High to Low)</option>
                </select>
              </div>
              
              {stats && (
                <div className="wishlist-insights">
                  <p><strong>Oldest item:</strong> {stats.oldestItem.name} (added {formatTimeAgo(stats.oldestItem.addedAt)})</p>
                  <p><strong>Newest item:</strong> {stats.newestItem.name} (added {formatTimeAgo(stats.newestItem.addedAt)})</p>
                  <p><strong>Average price:</strong> ${stats.averagePrice.toFixed(2)}</p>
                </div>
              )}
            </div>

            <div className="wishlist-grid">
              {sortedWishlist.map(product => (
                <div key={product.wishlistId || product.id} className="wishlist-item">
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
                    <div className="product-meta">
                      <div className="product-category">{product.category}</div>
                      <div className="added-time">
                        Added {formatTimeAgo(product.addedAt)}
                      </div>
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">${product.price}</div>
                    <div className="product-timestamp">
                      <small>Added on: {new Date(product.addedAt).toLocaleString()}</small>
                    </div>
                    
                    <div className="product-actions">
                      <button className="buy-btn">Buy Now</button>
                      <button className="move-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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