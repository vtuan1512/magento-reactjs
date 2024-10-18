import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Blog from './components/Blog';
import Products from './components/Products';
import Login from './components/Login';
import Cart from './components/Cart';
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BlogDetails from "./components/BlogDetails";
import ProductDetails from "./components/ProductDetails";
import {CartProvider} from "./components/CartContext";
import Contact from "./components/Contact";
import About from "./components/About";
const App = () => {
    const [user, setUser] = useState(null);

    const handleLogin = (userInfo) => {
        setUser(userInfo);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <CartProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Header user={user} onLogout={handleLogout} />

                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:id" element={<BlogDetails />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/login" element={<Login onLogin={handleLogin} />} />
                            <Route path="/cart" element={<Cart />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
};

export default App;
