import React, { useState } from 'react';
import { FiEye, FiHash, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RegisterForm = ({ path }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData(prev => ({
            ...prev,
            password,
            confirmPassword: password
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('email', data.email);
            toast.success('Registration successful! Please check your email for verification.');
            navigate('/authentication/verify');
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4 generate-pass">
                    <div className="input-group field">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {/* <div
                            className="input-group-text c-pointer gen-pass"
                            onClick={generatePassword}
                            title="Generate Password"
                        >
                            <FiHash size={16}/>
                        </div> */}
                        <div
                            className="input-group-text border-start bg-gray-2 c-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            title="Show/Hide Password"
                        >
                            {showPassword ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mt-4">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            className="custom-control-input"
                            id="termsCondition"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                        />
                        <label
                            className="custom-control-label c-pointer text-muted"
                            htmlFor="termsCondition"
                            style={{ fontWeight: '400 !important' }}
                        >
                            I agree to all the <a href="#">Terms &amp; Conditions</a> and <a href="#">Fees</a>.
                        </label>
                    </div>
                </div>
                <div className="mt-5">
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>Already have an account?</span>
                <Link to={path} className="fw-bold"> Login</Link>
            </div>
        </>
    );
};

export default RegisterForm;