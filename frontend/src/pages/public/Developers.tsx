import { useState } from 'react';
import { FaArrowLeft, FaCheck, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-midnight-light border border-code-gray/50">
      <div className="absolute right-2 top-2">
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
          aria-label={copied ? 'Code copied' : 'Copy code snippet'}
        >
          {copied ? (
            <FaCheck className="h-4 w-4 text-neon-green" />
          ) : (
            <FaCopy className="h-4 w-4" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const DevelopersPage = () => {
  return (
    <div className="min-h-screen bg-midnight text-white">
      <header className="border-b border-code-gray/30 bg-midnight/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-text-secondary hover:text-white transition-colors group"
          >
            <FaArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <span className="font-display font-bold text-lg">
            Clean Cut <span className="text-cyber-blue">API</span>
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">API Documentation</h1>
          <p className="text-lg text-text-secondary">
            Integrate Clean Cut's powerful link shortening capabilities directly into your
            applications.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-cyber-blue">01.</span> Authentication
            </h2>
            <p className="text-text-secondary mb-4">
              All API requests require an API key to be included in the header. You can generate
              your API key in the dashboard.
            </p>
            <CodeBlock code={`Authorization: Bearer sk_live_51MzQ2...`} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-cyber-blue">02.</span> Create a Link
            </h2>
            <p className="text-text-secondary mb-4">
              Send a POST request to create a new shortened link.
            </p>
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-neon-green/10 text-neon-green text-xs font-bold rounded">
                POST
              </span>
              <span className="ml-2 font-mono text-sm text-gray-300">
                https://api.cleancut.com/v1/links
              </span>
            </div>
            <CodeBlock
              code={`curl -X POST https://api.cleancut.com/v1/links \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "shortId": "custom-alias" 
  }'`}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DevelopersPage;
