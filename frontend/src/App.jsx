import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/Home";
import Dashboard from "./Pages/dashboard";
import Profile from "./Pages/Profile";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";
import "./App.css";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [], user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          user={user} 
          onShowAuthModal={() => setShowAuth(true)}
          onLogout={handleLogout}
        />
        
        {showAuth && (
          <AuthModal 
            onClose={() => setShowAuth(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute user={user} allowedRoles={['admin']}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} />
                </ProtectedRoute>
              } 
            />

            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
