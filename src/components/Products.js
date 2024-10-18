import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Product.css';
import { useCart } from './CartContext';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const notifyAdd = () => toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
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

                const response = await axios.post(url, { query }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setProducts(response.data.data.products.items);
                setFilteredProducts(response.data.data.products.items);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilter(value);

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const { addToCart } = useCart();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching products: {error.message}</p>;

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Products</h1>
            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filter}
                    onChange={handleFilterChange}
                    style={{ borderRadius: '30px' }}
                />
            </div>

            <div className="row row-cols-1 row-cols-md-3 g-4">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="col">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={product.image.url}
                                alt={product.name}
                                className="card-img-top img-fluid"
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text text-muted mb-4">
                                    Price: {product.price.regularPrice.amount.value} {product.price.regularPrice.amount.currency}
                                </p>
                                <div className="mt-auto">
                                    <button className="btn btn-success w-100 mb-2" onClick={() => {
                                        addToCart(product.sku, 1);
                                        notifyAdd();
                                    }}>
                                        Add to Cart
                                    </button>
                                    <Link
                                        to={`/products/${product.sku}`}
                                        className="btn btn-primary w-100"
                                    >
                                        View more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Products;
