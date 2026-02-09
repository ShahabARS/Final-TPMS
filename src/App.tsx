import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import BoardPage from './pages/BoardPage';
import { authApi, setToken, removeToken, type UserResponse } from './services/api';

/**
 * App Component - The Root Component
 * 
 * This is the main component that controls which page to show.
 * Think of it like a "router" - it decides: Login page or Board page?
 * 
 * React concepts:
 * - Conditional rendering: We use {isLoggedIn ? ... : ...} to show different components
 * - State management: We use useState to track if user is logged in
 * - Props: We pass functions and data to child components
 */
function App() {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // On first load, check if we already have a token and try to fetch current user
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await authApi.getMe();
        setCurrentUser(res.user);
        setUserEmail(res.user.email);
        setIsLoggedIn(true);
      } catch {
        // Token invalid/expired – clear it
        removeToken();
        setIsLoggedIn(false);
        setCurrentUser(null);
        setUserEmail('');
      }
    };

    void bootstrapAuth();
  }, []);

  // This function is called when user submits login form
  const handleLogin = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const res = await authApi.login({ email, password });

      // Save token so future requests are authenticated
      setToken(res.token);

      // Save user info in state
      setCurrentUser(res.user);
      setUserEmail(res.user.email);
      setIsLoggedIn(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Login failed. Please try again.';
      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // This function is called when user clicks logout
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentUser(null);
    setAuthError(null);
  };

  // Conditional rendering: Show LoginPage if not logged in, otherwise show BoardPage
  return (
    <div className="App">
      {isLoggedIn ? (
        <BoardPage userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} isLoading={isAuthLoading} error={authError} />
      )}
    </div>
  );
}

export default App;
