import { type ComponentType, type ReactNode, useState } from 'react';
import { FaBars, FaKey, FaLink, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/context/AuthContext';

type NavItemProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
};

const DashboardNavItem = ({ icon: Icon, label, path, isActive, onClick }: NavItemProps) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={['nav-link-base group', isActive ? 'nav-link-active' : 'nav-link-inactive'].join(
        ' ',
      )}
    >
      <Icon
        className={
          isActive
            ? 'h-5 w-5 text-cyber-blue'
            : 'h-5 w-5 text-text-secondary group-hover:text-white'
        }
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: MdDashboard },
    { label: 'My Links', path: '/dashboard/links', icon: FaLink },
    { label: 'API Keys', path: '/dashboard/api', icon: FaKey },
  ];

  return (
    <div className="min-h-screen bg-midnight">
      {}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-code-gray/30 bg-midnight-light hidden md:flex flex-col">
        <div className="p-6 border-b border-code-gray/30">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <DashboardNavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
              />
            );
          })}
        </nav>

        <div className="p-4 border-t border-code-gray/30">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyber-blue to-neon-purple flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-code-gray/30 bg-midnight-light">
        <Logo />
        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </Button>
      </header>

      {}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-midnight-light border-b border-code-gray/30 z-50 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <DashboardNavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            );
          })}
          <div className="pt-4 border-t border-code-gray/30 mt-2">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyber-blue to-neon-purple flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {}
      <main className="md:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl">{children}</div>
      </main>
    </div>
  );
};
