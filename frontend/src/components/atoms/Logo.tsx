import { FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="Go to home page"
      className="flex items-center gap-2 group cursor-pointer inline-flex"
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyber-blue/10 border border-cyber-blue/50 group-hover:bg-cyber-blue/20 transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
        <FaLink
          aria-hidden="true"
          className="w-4 h-4 text-cyber-blue transform -rotate-45 group-hover:rotate-0 transition-transform duration-300"
        />
      </div>
      <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-cyber-blue transition-colors duration-300">
        Clean Cut
      </span>
    </Link>
  );
};
