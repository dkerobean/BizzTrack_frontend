import React, { useState } from 'react';
import { FiFacebook, FiGithub, FiTwitter } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginForm = ({ registerPath, resetPath }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Handle successful login
            toast.success('Login successful!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.email);

            // If remember me is checked, store the email
            if (formData.rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            }

            // Navigate to dashboard or home page
            navigate('/dashboards/analytics');

        } catch (error) {
            toast.error(error.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your account</h4>
            {/* <p className="fs-12 fw-medium text-muted">Thank you for get back <strong>Nelel</strong> web applications, let's access our the best recommendation for you.</p> */}
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email or Username"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                className="custom-control-input"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div>
                        <Link to={resetPath} className="fs-11 text-primary">Forget password?</Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            {/* Rest of your social login and signup link code remains the same */}
            <div className="w-100 mt-5 text-center mx-auto">
                <div className="mb-4 border-bottom position-relative">
                    <span className="small py-1 px-3 text-uppercase text-muted bg-white position-absolute translate-middle">or</span>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Facebook">
                        <FiFacebook size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Twitter">
                        <FiTwitter size={16} />
                    </a>
                    <a href="#" className="btn btn-light-brand flex-fill" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Login with Github">
                        <FiGithub size={16} className='text' />
                    </a>
                </div>
            </div>
            <div className="mt-5 text-muted">
                <span> Don't have an account?</span>
                <Link to={registerPath} className="fw-bold"> Create an Account</Link>
            </div>
        </>
    );
};

export default LoginForm;