"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';

const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Replace these with your actual credentials
    const validName = 'praveen@adminapnasadhan';
    const validPassword = '$2b$10$qb8jZGWZh4JE1SVc50tlOONSltEigNujHdsehxA9xUQAteOHOe6hy';
    if (name === validName) {
      // Compare the hashed password
      const isPasswordValid = await bcrypt.compare(password, validPassword);
      if (isPasswordValid) {
        // Set the auth cookie
        Cookies.set('auth', 'true', { expires: 1 }); // Expires in 1 day
        router.push('/management/secure-gateway/4f3d5b6e-12c8-11e9-ab14-d663bd873d93');
      } else {
        alert('Invalid credentials');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form onSubmit={handleSubmit} className="text-gray-800 dark:text-white bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-cente mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 