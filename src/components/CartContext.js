import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    });

    const token = localStorage.getItem('authToken');

    const fetchCart = async () => {
        if (!token) return;
        try {
            const response = await axios.get('http://magento2.localhost.com/rest/V1/carts/mine', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data || { items: [] });
            localStorage.setItem('cart', JSON.stringify(response.data || { items: [] }));
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    };

    const addToCart = (sku, qty) => {
        if (!token) {
            // Nếu không có token, thêm sản phẩm vào giỏ hàng trong localStorage
            const newItem = { sku, qty };
            setCart((prevCart) => {
                const updatedItems = [...prevCart.items, newItem];
                localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
                return { items: updatedItems };
            });
            return;
        }

        // Nếu có token, gọi API để thêm vào giỏ hàng
        axios.post(
            'http://magento2.localhost.com/rest/V1/carts/mine/items',
            {
                cartItem: { sku, qty, quote_id: cart.id },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(() => {
                fetchCart();
            })
            .catch((error) => {
                console.error('Lỗi khi thêm vào giỏ hàng:', error);
            });
    };

    const removeFromCart = (itemId) => {
        if (!token) {
            // Nếu không có token, xóa sản phẩm khỏi giỏ hàng trong localStorage
            setCart((prevCart) => {
                const updatedItems = prevCart.items.filter(item => item.sku !== itemId);
                localStorage.setItem('cart', JSON.stringify({ items: updatedItems }));
                return { items: updatedItems };
            });
            return;
        }

        // Nếu có token, gọi API để xóa sản phẩm khỏi giỏ hàng
        axios.delete(`http://magento2.localhost.com/rest/V1/carts/mine/items/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                fetchCart();
            })
            .catch((error) => {
                console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cart');
        setCart({ items: [] });
    };

    const getTotalItemsInCart = () => {
        return cart && cart.items ? cart.items.reduce((total, item) => total + item.qty, 0) : 0;
    };

    useEffect(() => {
        if (token) fetchCart();
    }, [token]);

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart, logout, addToCart, getTotalItemsInCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
