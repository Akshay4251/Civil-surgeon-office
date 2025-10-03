// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseclient'; // Make sure this path is correct
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for authentication state changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // If we are still checking for a session, show a loading indicator
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If there is no session, redirect to the login page
  if (!session) {
    return <Navigate to="/login" />;
  }

  // If there is a session, render the component that was passed in (the AdminPanel)
  return children;
};

export default ProtectedRoute;