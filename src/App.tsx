import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import BoardPage from './pages/BoardPage';

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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  // This function is called when user submits login form
  const handleLogin = (email: string, password: string) => {
    // TODO: Later, we'll call an API here to verify credentials
    // For now, we'll just simulate a successful login
    console.log('Login attempt:', { email, password });
    
    // Simulate login success
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  // This function is called when user clicks logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  // Conditional rendering: Show LoginPage if not logged in, otherwise show BoardPage
  return (
    <div className="App">
      {isLoggedIn ? (
        <BoardPage userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
