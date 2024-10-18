import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const Header = ({ user, onLogout }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { logout, getTotalItemsInCart } = useCart();

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const handleLogout = () => {
        logout();
        onLogout();
        setDropdownOpen(false);
        // localStorage.removeItem('authToken');
        // localStorage.removeItem("cart");
        // localStorage.removeItem("cartId");
        // setCartItems([]);
    };
    return (
        <header className="bg-light shadow-sm">
            <nav className="navbar navbar-expand-lg navbar-light container">
                <Link className="navbar-brand" to="/">E-Commerce</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/blog">Blog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center">
                        {user ? (
                            <div className="dropdown">
                                <button className="btn btn-outline-secondary dropdown-toggle" onClick={toggleDropdown}>
                                    Xin chào, {user.firstname } {user.lastname}
                                </button>
                                {isDropdownOpen && (
                                    <ul className="dropdown-menu dropdown-menu-end show">
                                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/history">History</Link></li>
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <Link className="btn btn-outline-primary me-3" to="/login">Login</Link>
                        )}
                        <Link className="btn btn-outline-dark position-relative" to="/cart">
                            🛒
                            {getTotalItemsInCart() > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {getTotalItemsInCart()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
