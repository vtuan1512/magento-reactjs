import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useCart} from "./CartContext";
import {toast, ToastContainer} from "react-toastify";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const notifyAdd = () => toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
    const fetchProductDetails = async () => {
        const query = `
            {
                products(filter: { sku: { eq: "${id}" } }) {
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
                        description {
                            html
                        }
                        media_gallery {
                            url
                            label
                        }
                    }
                }
            }
        `;

        try {
            const response = await axios.post('http://magento2.localhost.com/graphql', {
                query,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const fetchedProduct = response.data.data?.products?.items[0];
            setProduct(fetchedProduct);
            return fetchedProduct?.id;
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchFaqDetails = async (productId) => {
        const query = `
            {
                faqDetails(product_id: "${productId}") {
                    question
                    author
                    answer
                    creation_time
                }
            }
        `;

        try {
            const response = await axios.post('http://magento2.localhost.com/graphql', {
                query,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const fetchedFaqs = response.data.data?.faqDetails || [];
            setFaqs(fetchedFaqs);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const productId = await fetchProductDetails();
            if (productId) {
                fetchFaqDetails(productId);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const { addToCart } = useCart();
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="product-details container mt-5">
            {product ? (
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            {product.media_gallery && product.media_gallery.length > 0 ? (
                                product.media_gallery.map((media) => (
                                    <img
                                        key={media.url}
                                        src={media.url}
                                        alt={media.label}
                                        className="img-fluid mb-3"
                                    />
                                ))
                            ) : (
                                <p>No images available</p>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h1 className="fw-bold">{product.name}</h1>
                        <p className="text-muted">SKU: {product.sku}</p>
                        <p className="h4 text-success">Price: {product.price.regularPrice.amount.value} {product.price.regularPrice.amount.currency}</p>
                        <div className="mt-4" dangerouslySetInnerHTML={{__html: product.description.html}}/>

                        <h1 className="fw-bold mt-4 text-center">FAQs</h1>
                        {faqs.length > 0 ? (
                            <ul className="list-unstyled">
                                {faqs.map((faq, index) => (
                                    <li key={index} className="mb-3">
                                        <p><strong>Question:</strong> {faq.question}</p>
                                        <p><strong>Author:</strong> {faq.author}</p>
                                        <p><strong>Answer:</strong> {faq.answer}</p>
                                        <p><small>Created on: {new Date(faq.creation_time).toLocaleDateString()}</small>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No FAQs available for this product.</p>
                        )}
                        <div className="mt-auto">
                            <button className="btn btn-success w-100 mb-2" onClick={() => {
                                addToCart(product.sku, 1);
                                notifyAdd();
                            }}>
                                Add to Cart
                            </button>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No product found
                </div>
            )}
            <ToastContainer/>
        </div>
    );
};

export default ProductDetails;
