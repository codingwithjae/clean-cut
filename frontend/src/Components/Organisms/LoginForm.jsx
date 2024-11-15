import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useCloseModal from '../../hooks/handleModal';
import authService from '../../api/auth.api';
import Button from '../Atoms/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleModal = useCloseModal();
  const navigate = useNavigate();

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
    <section className="fixed bg-black/55 inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-[350px] h-[420px] flex flex-col justify-center">
        <div className="flex justify-between items-center border-b border-b-gray-400 pb-2">
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <Button variant="icon" icon="close" onClick={handleModal} ariaLabel="Close modal" />
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
            <Button text="Login" type="Submit" variant="large" />
          </div>
        </form>
      </div>
    </section>
  );
}
