import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://magento2.localhost.com/rest/V1/integration/customer/token', {
                username: email,
                password: password,
            });
            const token = response.data;

            localStorage.setItem('authToken', token);

            const customerResponse = await axios.get('http://magento2.localhost.com/rest/V1/customers/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // const cartResponse = await axios.get('http://magento2.localhost.com/rest/V1/carts/mine', {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });
            //
            // localStorage.setItem('cartId', cartResponse.data.id);
            // localStorage.setItem('cartItems', JSON.stringify(cartResponse.data.items));

            onLogin(customerResponse.data);
            navigate('/');
        } catch (err) {
            setError('Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
