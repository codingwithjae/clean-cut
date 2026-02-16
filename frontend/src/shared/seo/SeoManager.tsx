import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type RouteSeo = {
  title: string;
  description: string;
  noindex?: boolean;
  canonicalPath?: string;
};

const DEFAULT_TITLE = 'Clean Cut | URL Shortener';
const DEFAULT_DESCRIPTION =
  'Clean Cut is a fast URL shortener with a developer-friendly API, custom short links, and dashboard analytics.';

const routeSeoConfig: Record<string, RouteSeo> = {
  '/': {
    title: 'Clean Cut | Fast URL Shortener for Developers and Creators',
    description:
      'Shorten, manage, and share links in seconds. Use Clean Cut from the web dashboard or integrate with our API.',
  },
  '/features': {
    title: 'Clean Cut | Fast URL Shortener for Developers and Creators',
    description:
      'Shorten, manage, and share links in seconds. Use Clean Cut from the web dashboard or integrate with our API.',
    canonicalPath: '/',
  },
  '/developers': {
    title: 'Clean Cut API Docs | URL Shortener API',
    description:
      'Integrate Clean Cut in minutes. Authenticate with API keys and create short links programmatically.',
  },
  '/login': {
    title: 'Sign In | Clean Cut',
    description: 'Sign in to your Clean Cut account.',
    noindex: true,
  },
  '/register': {
    title: 'Create Account | Clean Cut',
    description: 'Create your Clean Cut account and start shortening links.',
    noindex: true,
  },
  '/verify-email': {
    title: 'Verify Email | Clean Cut',
    description: 'Verify your email to complete account setup.',
    noindex: true,
  },
  '/auth/callback': {
    title: 'Authentication | Clean Cut',
    description: 'Completing authentication.',
    noindex: true,
  },
  '/dashboard': {
    title: 'Dashboard | Clean Cut',
    description: 'Manage your links and analytics.',
    noindex: true,
  },
  '/dashboard/links': {
    title: 'My Links | Clean Cut',
    description: 'Manage your shortened links.',
    noindex: true,
  },
  '/dashboard/api': {
    title: 'API Keys | Clean Cut',
    description: 'Manage API keys for Clean Cut integrations.',
    noindex: true,
  },
  '/dashboard/account': {
    title: 'Account Settings | Clean Cut',
    description: 'Manage your account security and password.',
    noindex: true,
  },
};

const setOrCreateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  const selector = `meta[${attr}="${name}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

const setOrCreateCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
};

export const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const seo = routeSeoConfig[location.pathname] || {
      title: 'Page Not Found | Clean Cut',
      description: 'The page you are looking for could not be found.',
      noindex: true,
    };

    const title = seo.title || DEFAULT_TITLE;
    const description = seo.description || DEFAULT_DESCRIPTION;
    const canonicalPath = seo.canonicalPath || location.pathname;
    const canonicalUrl = new URL(canonicalPath, window.location.origin).toString();

    document.title = title;

    setOrCreateMeta('description', description);
    setOrCreateMeta('robots', seo.noindex ? 'noindex, nofollow' : 'index, follow');
    setOrCreateMeta('og:type', 'website', 'property');
    setOrCreateMeta('og:title', title, 'property');
    setOrCreateMeta('og:description', description, 'property');
    setOrCreateMeta('og:url', canonicalUrl, 'property');
    setOrCreateMeta('twitter:card', 'summary_large_image');
    setOrCreateMeta('twitter:title', title);
    setOrCreateMeta('twitter:description', description);
    setOrCreateCanonical(canonicalUrl);
  }, [location.pathname]);

  return null;
};
