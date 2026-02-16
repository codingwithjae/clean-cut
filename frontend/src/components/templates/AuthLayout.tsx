import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/atoms/Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const buildWordItems = (text: string) => {
  const seen = new Map<string, number>();
  return text.split(' ').map((word) => {
    const count = (seen.get(word) ?? 0) + 1;
    seen.set(word, count);
    return {
      id: `${word}-${count}`,
      word,
    };
  });
};

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const quoteWords = buildWordItems(
    "The shortest path to your audience isn't just a link, it's a bridge built on trust and speed.",
  );

  return (
    <div className="min-h-screen bg-midnight-light relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyber-blue/10 via-transparent to-transparent" />
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] relative">
        {}
        <Link
          to="/"
          className="absolute top-6 right-6 z-50 p-2 text-text-secondary hover:text-white transition-colors bg-midnight-light/50 rounded-lg border border-code-gray/30 lg:border-none lg:bg-transparent"
          title="Back to home"
        >
          <FaTimes className="h-5 w-5" />
        </Link>

        {}
        <div className="hidden lg:flex flex-col relative border-r border-code-gray/30 p-12 overflow-hidden">
          <div className="z-10">
            <Logo />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg z-10">
            <blockquote className="space-y-6">
              <motion.p
                className="text-3xl font-display font-medium leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.07,
                    },
                  },
                }}
              >
                <motion.span
                  aria-hidden="true"
                  className="inline-block mr-2"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                  }}
                >
                  "
                </motion.span>
                {quoteWords.map(({ id, word }) => (
                  <motion.span
                    key={id}
                    className="inline-block mr-2"
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  aria-hidden="true"
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
                  }}
                >
                  "
                </motion.span>
              </motion.p>
              <motion.footer
                className="text-text-secondary font-mono text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7 }}
              >
                — Built for developers, marketers and content creators
              </motion.footer>
            </blockquote>
          </div>
        </div>

        {}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="w-full max-w-md rounded-2xl border border-code-gray/40 bg-midnight-light p-6 sm:p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-8">
            <div className="lg:hidden">
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
    </div>
  );
};
