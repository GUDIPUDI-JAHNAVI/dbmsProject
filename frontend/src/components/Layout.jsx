import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, isAuth } from '../lib';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const authed = isAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1 className="app-title">Multi-Category Search &amp; Filter</h1>
            <p className="app-subtitle">
              Search, filter, and explore items across books, electronics, and clothing.
            </p>
          </div>
          {authed && (
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>
      <main className="app-main" aria-live="polite">{children}</main>
      <footer className="app-footer">
        <p>React + Vite &middot; FastAPI Gateway &middot; Spring Boot</p>
      </footer>
    </div>
  );
};

export default Layout;
