import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Protected route for admin-only pages
 * Redirects non-admin users to home page
 */
const AdminProtectedRoute = ({ children }) => {
    const { status, isAdmin } = useSelector(state => state.auth);

    if (!status) {
        // Not logged in - redirect to login
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Logged in but not admin - redirect to home
        return <Navigate to="/" replace />;
    }

    // User is logged in AND is admin
    return children;
};

export default AdminProtectedRoute;
