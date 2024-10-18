import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Cart.css';

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const [products, setProducts] = useState([]);

    // Fetch dữ liệu sản phẩm từ GraphQL
    const fetchProducts = async () => {
        const url = 'http://magento2.localhost.com/graphql';
        const query = `
            {
                products(filter: {}) {
                    items {
                        id
                        name
                        sku
                        price {
                            regularPrice {
                                amount {
                                    value
                                    currency
                                }
                            }
                        }
                        image {
                            url
                        }
                    }
                }
            }
        `;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Nếu cần token
                },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            setProducts(data.data.products.items);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Có lỗi xảy ra khi lấy dữ liệu sản phẩm.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); // Chỉ fetch một lần khi component mount

    if (!cart || !cart.items || cart.items.length === 0) {
        return <h1 className="text-center mb-4">Your Cart is Empty</h1>;
    }

    const handleRemoveFromCart = async (itemId) => {
        try {
            await removeFromCart(itemId);
            toast.success('Sản phẩm đã được xóa khỏi giỏ hàng thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng.');
        }
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            const product = products.find((prod) => prod.sku === item.sku);
            return total + (product ? product.price.regularPrice.amount.value * (item.qty || 1) : 0);
        }, 0);
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Shipping Cart</h1>
            <div className="cart-table">
                {/*<div className="cart-header">*/}
                {/*    <span>Product Image</span>*/}
                {/*    <span>Product Name</span>*/}
                {/*    <span>Price</span>*/}
                {/*    <span>Quantity</span>*/}
                {/*    <span>Action</span>*/}
                {/*</div>*/}
                <div className="cart-items">
                    {cart.items.map((item) => {
                        const product = products.find((prod) => prod.sku === item.sku);
                        return (
                            <div className="cart-item" key={item.sku}>
                                <div className="item-image">
                                    <img src={product && product.image ? product.image.url : "default-image-url.jpg"}
                                         alt={product ? product.name : 'N/A'}
                                    />
                                </div>
                                <div className="item-name">{product ? product.name : 'N/A'}</div>
                                <div className="item-price">{product ? product.price.regularPrice.amount.value : '0'} USD</div>
                                <div className="item-quantity">{item.qty}</div>
                                <div className="item-action">
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveFromCart(item.item_id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="cart-footer">
                    <div className="total-price">Total: {calculateTotal()} USD</div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Cart;
