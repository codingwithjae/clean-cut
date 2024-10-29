import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useCloseModal from '../../hooks/useCloseModal';
import authService from '../../api/auth.api';
import Button from '../Atoms/Button';

export default function LoginForm() {
  const closeModal = useCloseModal();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async e => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter the credentials');
      return;
    }

    try {
      const response = await authService.Login({ email, password });
      const token = response?.data?.data?.token;

      if (response.status === 200) {
        localStorage.setItem('token', token);
        toast.success('Logged in successfully');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.log(error);

      toast.error('Invalid credentials');
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-xs">
        <div className="flex justify-between items-center border-b border-b-gray-400 pb-2">
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <Button variant="icon" icon="close" onClick={closeModal} ariaLabel="Close modal" />
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-center">
            <Button text="Submit" type="submit" variant="large" />
          </div>
        </form>
      </div>
    </section>
  );
}
