import Button from '../Atoms/Button';
import { useCloseModal } from '../../hooks/useCloseModal';

export default function LoginForm() {
  const closeModal = useCloseModal();

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-xs">
        <div className="flex justify-between items-center border-b border-b-gray-400 pb-2">
          <h2 className="text-2xl font-semibold text-white">Login</h2>
          <Button variant="icon" icon="close" onClick={closeModal} ariaLabel="Close modal" />
        </div>

        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-center">
            <Button text="Login" variant="large" type="submit" />
          </div>
        </form>
      </div>
    </section>
  );
}
