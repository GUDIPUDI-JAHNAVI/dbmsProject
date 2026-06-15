import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apibaseurl, callApi, setAuth } from '../lib';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    callApi(
      'POST',
      `${apibaseurl}/authservice/signin`,
      { username: email.trim().toLowerCase(), password },
      (res) => {
        const token = res.jwt || res.data?.token;
        if (res.code !== 200 || !token) {
          alert(res.message || 'Invalid credentials');
          return;
        }
        const user = res.data?.user || { email: email.trim().toLowerCase() };
        setAuth(token, user);
        navigate('/search');
      }
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Email</label>
          </div>
          <div className="auth-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>
          <button className="auth-btn">Sign In</button>
          <p className="auth-footer">
            Don&apos;t have an account?{' '}
            <span onClick={() => navigate('/signup')}>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
