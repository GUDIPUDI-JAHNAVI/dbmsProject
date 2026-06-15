import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { isAuth } from './lib';

const RequireAuth = ({ children }) => (isAuth() ? children : <Navigate to="/login" replace />);

const GuestOnly = ({ children }) => (isAuth() ? <Navigate to="/search" replace /> : children);

const App = () => {
  useLocation();

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isAuth() ? <Navigate to="/search" replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={(
            <GuestOnly>
              <SignInPage />
            </GuestOnly>
          )}
        />
        <Route
          path="/signup"
          element={(
            <GuestOnly>
              <SignUpPage />
            </GuestOnly>
          )}
        />
        <Route
          path="/search"
          element={(
            <RequireAuth>
              <SearchPage />
            </RequireAuth>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
