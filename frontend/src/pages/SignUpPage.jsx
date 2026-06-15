import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apibaseurl, callApi } from '../lib';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert('Please accept terms');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    callApi(
      'POST',
      `${apibaseurl}/authservice/signup`,
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      },
      (res) => {
        if (res.code !== 200) {
          alert(res.message || 'Registration failed');
          return;
        }
        alert('Account created successfully');
        navigate('/login');
      }
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-row">
            <div className="auth-field">
              <input name="firstName" value={form.firstName} onChange={handleChange} required placeholder=" " />
              <label>First Name</label>
            </div>
            <div className="auth-field">
              <input name="lastName" value={form.lastName} onChange={handleChange} required placeholder=" " />
              <label>Last Name</label>
            </div>
          </div>
          <div className="auth-field">
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder=" " />
            <label>Email Address</label>
          </div>
          <div className="auth-field">
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder=" " />
            <label>Password</label>
          </div>
          <div className="auth-field">
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder=" " />
            <label>Confirm Password</label>
          </div>
          <label className="terms">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            I agree to the <span>Terms</span> and <span>Privacy Policy</span>
          </label>
          <button type="submit" className="auth-btn">Create Account</button>
          <p className="auth-footer">
            Already have an account? <span onClick={() => navigate('/login')}>Sign in</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
