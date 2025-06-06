
import React from "react";
import { useParams } from "react-router-dom";
import { products } from "./ProductList"; 
import "./productDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-details">
        <div className="product-not-found">
          <h2>Product not found</h2>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
 
    alert(`Purchasing ${product.name} for $${product.price}`);
  };

  return (
    <div className="product-details">
      <div className="product-details-card">
        <div className="details-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="details-image"
          />
        </div>
        
        <div className="details-info">
          <h1 className="details-title">{product.name}</h1>
          
          <p className="details-description">
            {product.description || "Experience the perfect blend of technology and innovation with this premium product. Designed for modern users who demand excellence, this device delivers outstanding performance and reliability."}
          </p>
          
          <div className="details-category">
            Category: {product.category}
          </div>
          
          <div className="details-price">
            ${product.price}
          </div>
          
          <button 
            className="details-buy-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;