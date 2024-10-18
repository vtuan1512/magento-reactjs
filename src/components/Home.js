import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleShopNow = () => {
        navigate('/products');
    };
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to Our eCommerce Store!</h1>
                <p>Discover the latest trends and amazing deals today.</p>
                <button className="shop-now-btn" onClick={handleShopNow}>
                    Shop Now
                </button>
            </div>

            <div className="features">
                <div className="feature-item">
                <img src="/assets/images/contact.png" alt="Free Shipping" />
                    <h3>Free Shipping</h3>
                    <p>Enjoy free shipping on all orders above $50!</p>
                </div>
                <div className="feature-item">
                    <img src="/assets/images/contact.png" alt="24/7 Support" />
                    <h3>24/7 Customer Support</h3>
                    <p>We're here to help anytime you need us.</p>
                </div>
                <div className="feature-item">
                    <img src="/assets/images/contact.png" alt="Secure Payment" />
                    <h3>Secure Payment</h3>
                    <p>Your payments are safe and encrypted.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
