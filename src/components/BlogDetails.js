import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/BlogDetails.css';

const BlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            const query = `
                {
                    blogDetails(blog_id: ${id}) {
                        title
                        full_content
                        post_image
                        author
                        published_at
                    }
                }
            `;

            try {
                const response = await axios.post(
                    'http://magento2.localhost.com/graphql',
                    { query },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                setBlog(response.data.data.blogDetails);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center text-danger mt-5">Error: {error}</div>;

    return (
        <div className="container mt-5">
            {blog ? (
                <div className="card mb-5 ">
                    {blog.post_image && (
                        <img
                            src={`http://magento2.localhost.com/media/tmp/imageUploader/images/${blog.post_image}`}
                            className="card-img-top blog-details-image mt-4"
                            alt={blog.title}
                        />
                    )}
                    <div className="card-body">
                        <h1 className="card-title text-center">{blog.title}</h1>
                        <p className="text-muted text-center mb-4">
                            Author: {blog.author} | Published on: {new Date(blog.published_at).toLocaleDateString()}
                        </p>
                        <div className="blog-content">{blog.full_content}</div>
                    </div>
                </div>
            ) : (
                <div className="text-center">Blog not found</div>
            )}
        </div>
    );
};

export default BlogDetails;
