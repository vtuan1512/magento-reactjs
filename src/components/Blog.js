import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Blog.css'; // File CSS tùy chỉnh
import 'bootstrap/dist/css/bootstrap.min.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const query = `
                {
                    allBlogDetails {
                        post_id
                        title
                        full_content
                        post_image
                        short_content
                        author
                    }
                }
            `;

            try {
                const response = await axios.post(
                    'http://magento2.localhost.com/graphql',
                    { query },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                setBlogs(response.data.data.allBlogDetails);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center text-danger mt-5">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog.post_id} className="col">
                            <div className="card h-100 shadow-sm">
                                {blog.post_image && (
                                    <img
                                        src={`http://magento2.localhost.com/media/tmp/imageUploader/images/${blog.post_image}`}
                                        className="card-img-top"
                                        alt={blog.title}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{blog.title}</h5>
                                    <p className="card-text">{blog.short_content}</p>
                                    <p className="card-text mt-auto">
                                        <small className="text-muted">Author: {blog.author}</small>
                                    </p>
                                    <Link
                                        to={`/blog/${blog.post_id}`}
                                        className="btn btn-primary mt-3"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">No blog found</div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
