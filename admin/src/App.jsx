// src/App.jsx (Admin side only)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Admin components
import AdminPanel from './components/admin/admin';
import LoginPage from './components/login';
import ProtectedRoute from './components/ProtectedRoutes';
import Header from './components/Header';
import Footer from './components/Footer';

function AppContent() {
  const [language, setLanguage] = useState('en');
  const location = useLocation();
  
  // Hide header and footer on login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - shown on all pages except login */}
      {!isLoginPage && <Header language={language} setLanguage={setLanguage} />}
      
      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          {/* --- ADMIN LOGIN --- */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- PROTECTED ADMIN PANEL --- */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {/* Footer - shown on all pages except login */}
      {!isLoginPage && <Footer language={language} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;