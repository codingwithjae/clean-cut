import type { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaArrowRight, FaBolt, FaCheck, FaCode, FaCopy, FaMagic } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LinkService } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    if (!originalUrl) {
      toast.error('Please enter a URL');
      return;
    }

    if (!urlPattern.test(originalUrl)) {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await LinkService.createPublic(originalUrl);
      setShortenedUrl(result.shortUrl);
      toast.success('Link shortened successfully!');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Failed to shorten link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortenedUrl) return;
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-midnight text-white selection:bg-cyber-blue selection:text-midnight">
      { }
      <header className="fixed w-full z-50 backdrop-blur-md bg-midnight/80 border-b border-code-gray/30">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              to="/developers"
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors hidden sm:block"
            >
              Developers
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">
                  Go to Dashboard
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <Button size="sm" className="hidden sm:inline-flex">
                    Get Started
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        { }
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-20 left-20 w-72 h-72 bg-cyber-blue rounded-full blur-[100px] mix-blend-screen"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute bottom-20 right-20 w-72 h-72 bg-neon-purple rounded-full blur-[100px] mix-blend-screen"
            />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto px-6 text-center relative z-10"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <FaBolt className="h-3 w-3 text-yellow-400" />
              <span className="text-xs font-medium text-cyber-blue tracking-wide uppercase">
                Fast, free & open source
              </span>
            </motion.div>

            <motion.h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              {'Simple Links,'.split('').map((char, i) => (
                <motion.span
                  key={`char1-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  {char}
                </motion.span>
              ))}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-white to-cyber-blue animate-shiny">
                {'Total Reach.'.split('').map((char, i) => (
                  <motion.span
                    key={`char2-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The professional link shortener for everyone. Whether you're a developer or a creator,
              manage your brand with speed and precision.
            </motion.p>

            <motion.div variants={fadeInUp} className="max-w-xl mx-auto mb-10 w-full">
              <form onSubmit={handleShorten} noValidate className="relative flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMagic className="text-cyber-blue h-5 w-5" />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste your long link here..."
                    className="w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                  />
                  <div className="absolute right-2 top-2 bottom-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-full px-6 rounded-lg bg-cyber-blue hover:bg-cyber-blue-hover text-white font-medium transition-colors"
                    >
                      {isLoading ? 'Shortening...' : 'Shorten'}
                    </Button>
                  </div>
                </div>
              </form>

              <AnimatePresence>
                {shortenedUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-neon-green/30 flex items-center justify-between overflow-hidden"
                  >
                    <div className="truncate mr-4 text-neon-green font-mono">{shortenedUrl}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="text-white hover:bg-white/10"
                    >
                      {copied ? (
                        <FaCheck className="h-4 w-4 text-neon-green" />
                      ) : (
                        <FaCopy className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'}
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/developers" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <FaCode className="mr-2 h-4 w-4" />
                  API Documentation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        { }
        <section className="py-24 bg-midnight-light/50 border-t border-code-gray/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-blue/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-cyber-blue/10 rounded-lg flex items-center justify-center mb-6 text-cyber-blue group-hover:scale-110 transition-transform">
                  <FaBolt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Instant Results</h3>
                <p className="text-text-secondary leading-relaxed">
                  Paste, click, and share. Our API ensures your links are ready in milliseconds.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-neon-purple/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-neon-purple/10 rounded-lg flex items-center justify-center mb-6 text-neon-purple group-hover:scale-110 transition-transform">
                  <FaMagic className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Simple & Clean</h3>
                <p className="text-text-secondary leading-relaxed">
                  No clutter, no confusion. Just a beautiful interface designed for maximum
                  efficiency.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-neon-green/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-neon-green/10 rounded-lg flex items-center justify-center mb-6 text-neon-green group-hover:scale-110 transition-transform">
                  <FaCode className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Built for Power</h3>
                <p className="text-text-secondary leading-relaxed">
                  Need more? Use our robust API to integrate link shortening directly into your
                  workflows.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      { }
      <footer className="py-12 border-t border-code-gray/30 bg-midnight">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-white">
              Clean Cut<span className="text-cyber-blue">.</span>
            </span>
          </div>
          <div className="text-sm text-text-secondary">
            © 2026 Clean Cut, made with ❤️ by <a href="https://github.com/codingwithjae" target="_blank" rel="noopener noreferrer" className="text-cyber-blue hover:underline">Johander Campos</a>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/codingwithjae/link-shortener" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-cyber-blue transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
