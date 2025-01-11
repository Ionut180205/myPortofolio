import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then((data) => {
        if (data.is_admin) {
          navigate('/Admin');
        } else {
          navigate('/UserDashboard');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorModal(true);
      });
  };

  return (
    <div className="bg-black text-white text-center py-16 h-screen relative">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-4 left-4 bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent transform transition-transform duration-300 hover:scale-105 px-4 py-2 rounded-full">
        <span className="text-2xl mr-2">{"<"}</span> 
        <span className="text-base">Return Home</span>
      </Link>

      <h1 className="text-4xl font-bold mb-8">Admin Login</h1>
      
      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-1/4 px-6 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-1/4 px-6 py-2 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Login Button */}
        <button
          type="submit"
          className="w-20 bg-gradient-to-r from-green-400 to-blue-500 text-white transform transition-transform duration-300 hover:scale-105 px-4 py-2 rounded-full"
        >
          Login
        </button>
      </form>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-xl font-bold mb-4 text-red-500">Login Error</h3>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
