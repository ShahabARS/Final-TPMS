import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * LoginPage Component
 * 
 * This is a React component - think of it like a function that returns HTML.
 * In React, we use JSX (JavaScript XML) which looks like HTML but is actually JavaScript.
 * 
 * Key React concepts you'll see:
 * - useState: This is a "hook" that lets us store data that can change (like form inputs)
 * - onChange: Event handler that runs when user types in an input
 * - onSubmit: Event handler that runs when form is submitted
 */
interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
}

function LoginPage({ onLogin, isLoading = false, error }: LoginPageProps) {
  // useState creates a "state variable" - when it changes, React re-renders the component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevents page refresh (default form behavior)
    
    // Call onLogin from parent (App) which will talk to the API
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          TPMS Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
