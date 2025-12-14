import type { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/atoms/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
      {}
      <Link
        to="/"
        className="absolute top-6 right-6 z-50 p-2 text-text-secondary hover:text-white transition-colors bg-midnight-light/50 rounded-lg border border-code-gray/30 lg:border-none lg:bg-transparent"
        title="Back to home"
      >
        <FaTimes className="h-5 w-5" />
      </Link>

      {}
      <div className="hidden lg:flex flex-col relative bg-midnight-light border-r border-code-gray/30 p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyber-blue/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl opacity-30" />

        <div className="z-10">
          <Logo />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-lg z-10">
          <blockquote className="space-y-6">
            <p className="text-3xl font-display font-medium leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
              "The shortest path to your audience isn't just a link, it's a bridge built on trust
              and speed."
            </p>
            <footer className="text-text-secondary font-mono text-sm">
              — Built for Developers
            </footer>
          </blockquote>
        </div>
      </div>

      {}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-midnight">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-display tracking-tight text-white">{title}</h1>
            <p className="text-text-secondary">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
