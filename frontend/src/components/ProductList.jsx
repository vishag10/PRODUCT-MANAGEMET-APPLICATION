import React from "react";
import { Link } from "react-router-dom";
import "./products.css";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    description: "Latest iPhone with A17 Pro chip and titanium design",
    category: "Smartphones"
  },
  {
    id: 2,
    name: "MacBook Air M2",
    price: 1199,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
    description: "Lightweight laptop with M2 chip and all-day battery life",
    category: "Laptops"
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: 899,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    description: "Flagship Android phone with AI-powered features",
    category: "Smartphones"
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 349,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    description: "Industry-leading noise canceling wireless headphones",
    category: "Audio"
  },
  {
    id: 5,
    name: "iPad Pro 12.9",
    price: 1099,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
    description: "Powerful tablet with M2 chip and Liquid Retina display",
    category: "Tablets"
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    description: "Ultra-portable laptop with InfinityEdge display",
    category: "Laptops"
  },
  {
    id: 7,
    name: "Apple Watch Series 9",
    price: 399,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop",
    description: "Advanced smartwatch with health monitoring features",
    category: "Wearables"
  },
  {
    id: 8,
    name: "Nintendo Switch OLED",
    price: 349,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop",
    description: "Hybrid gaming console with vibrant OLED screen",
    category: "Gaming"
  },
  {
    id: 9,
    name: "AirPods Pro 2",
    price: 249,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop",
    description: "Premium wireless earbuds with active noise cancellation",
    category: "Audio"
  },
  {
    id: 10,
    name: "Surface Pro 9",
    price: 1299,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    description: "Versatile 2-in-1 laptop tablet with touchscreen",
    category: "Tablets"
  }
];

const ProductList = ({
  addToWishlist,
  removeFromWishlist,
  wishlist,
  showTitle = false,
  selectedCategory = "All"
}) => {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="products-section">
      {showTitle && <h2 className="section-title">Featured Products</h2>}

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-category">{product.category}</div>
              </div>
            </Link>

            <div className="product-info">
              <Link to={`/product/${product.id}`}>
                <h3 className="product-name">{product.name}</h3>
              </Link>
              <p className="product-description">{product.description}</p>
              <div className="product-price">${product.price}</div>

              <div className="product-actions">
                <button
                  className={`wishlist-btn ${
                    isInWishlist(product.id) ? "in-wishlist" : ""
                  }`}
                  onClick={() => handleWishlistToggle(product)}
                >
                  {isInWishlist(product.id) ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
                </button>
                <button className="buy-btn">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <h3>No products found in this category</h3>
          <p>Try selecting a different category or browse all products.</p>
        </div>
      )}
    </div>
  );
};

export { products };
export default ProductList;
