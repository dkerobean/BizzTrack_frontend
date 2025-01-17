import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OtpVerifyForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [maskedEmail, setMaskedEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
            // Mask the email: show first character and domain after @, rest asterisks
            const [username, domain] = storedEmail.split('@');
            const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
            setMaskedEmail(`${maskedUsername}@${domain}`);
        }
    }, []);

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is entered
            if (value && index < 4) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');

        if (code.length !== 5) {
            toast.error('Please enter a complete verification code');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code: parseInt(code)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Verification failed');
            }

            toast.success('Email verified successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="fs-13 fw-bold mb-2">
                Please enter the code to verify your email.
            </h4>
            <p className="fs-12 fw-medium text-muted">
                <span>A code has been sent to </span>
                <strong>{maskedEmail}</strong>
            </p>
            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <input type="hidden" name="email" value={email} />
                <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            className="m-2 text-center form-control rounded"
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            required
                        />
                    ))}
                </div>
                <div className="mt-5">
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Validate'}
                    </button>
                </div>
                <div className="mt-5 text-muted">
                    <span>Didn't get the code? </span>
                    <a href="#" className="text-primary">Resend(1/3)</a>
                </div>
            </form>
        </>
    );
};

export default OtpVerifyForm;