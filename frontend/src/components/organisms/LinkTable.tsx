import { useState } from 'react';
import { FaCopy, FaEdit, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import type { Link } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';

interface LinkTableProps {
  links: Link[];
  isLoading: boolean;
  onDelete: (link: Link) => void;
  onEdit: (link: Link) => void;
  emptyMessage?: string;
}

export const LinkTable = ({ links, isLoading, onDelete, onEdit, emptyMessage }: LinkTableProps) => {
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const copyToClipboard = async (shortId: string) => {
    const url = `${import.meta.env.VITE_BASE_URL}/${shortId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyingId(shortId);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopyingId(null), 2000);
    } catch (_error) {
      toast.error('Failed to copy');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10 text-text-secondary">Loading links...</div>;
  }

  if (links.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-text-secondary mb-4">
          {emptyMessage || "You haven't created any links yet."}
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-code-gray">
      <table className="w-full text-left text-sm">
        <thead className="bg-midnight-light text-text-secondary uppercase text-xs font-mono">
          <tr>
            <th className="px-6 py-4 font-medium">Short Link</th>
            <th className="px-6 py-4 font-medium">Original URL</th>
            <th className="px-6 py-4 font-medium text-center">Clicks</th>
            <th className="px-6 py-4 font-medium text-center">Date</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-code-gray/50 bg-midnight/50">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-medium text-cyber-blue font-mono">
                <div className="flex items-center gap-2">
                  <span>/{link.shortId}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(link.shortId)}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white"
                    title="Copy"
                    aria-label={`Copy short link ${link.shortId}`}
                  >
                    {copyingId === link.shortId ? (
                      <span className="text-neon-green text-xs">Copied!</span>
                    ) : (
                      <FaCopy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </td>
              <td
                className="px-6 py-4 text-text-primary max-w-xs truncate"
                title={link.originalUrl}
              >
                {link.originalUrl}
              </td>
              <td className="px-6 py-4 text-center text-text-secondary font-mono">{link.clicks}</td>
              <td className="px-6 py-4 text-center text-text-secondary">
                {new Date(link.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(link.originalUrl, '_blank', 'noopener,noreferrer')}
                    title="Visit"
                    aria-label={`Open destination URL for ${link.shortId}`}
                  >
                    <FaExternalLinkAlt className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-cyber-blue hover:text-white hover:bg-cyber-blue/10"
                    onClick={() => onEdit(link)}
                    title="Edit"
                    aria-label={`Edit link ${link.shortId}`}
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => onDelete(link)}
                    title="Delete"
                    aria-label={`Delete link ${link.shortId}`}
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
