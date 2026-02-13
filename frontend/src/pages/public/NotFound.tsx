import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Logo } from '@/components/atoms/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Link to="/" className="inline-block mb-10">
          <Logo />
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-blue/20 to-electric-purple/20 border border-white/10 flex items-center justify-center">
            <FaExclamationTriangle className="text-3xl text-cyber-blue" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-text-secondary mb-2">Page not found</p>
        <p className="text-sm text-text-secondary/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
