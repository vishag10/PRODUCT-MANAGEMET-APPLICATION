import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Nav({ user, setID, wishlistCount = 0 }) {
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("wishlist");
    setID(null);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">Electronics Store</Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/wishlist" className="nav-link wishlist-link">
              <span className="wishlist-icon">❤️</span>
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="wishlist-badge">{wishlistCount}</span>
              )}
            </Link>
          </div>

          <div className="navbar-user" id="nav">
            <div className="photo">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" />
            </div>
            <span className="username">{user ? `Hello, ${user}` : "Loading..."}</span>
            {user ? (
              <Link to="/login" className="logout-button" onClick={logOut}>
                Logout
              </Link>
            ) : (
              <Link to="/login" className="logout-button">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;