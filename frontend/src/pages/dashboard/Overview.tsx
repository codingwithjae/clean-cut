import { useCallback, useEffect, useState } from 'react';
import { FaChartBar, FaCopy, FaLink, FaMousePointer } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { type Link, LinkService } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { StatsCard } from '@/components/molecules/StatsCard';
import { CreateLinkModal } from '@/components/organisms/CreateLinkModal';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

const DashboardOverview = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await LinkService.getAll();
      setLinks(data);
    } catch (_error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalClicks = links.reduce((acc, link) => acc + link.clicks, 0);
  const avgClicks = links.length > 0 ? (totalClicks / links.length).toFixed(1) : '0';

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-white">Overview</h1>
          <Button onClick={() => setIsModalOpen(true)} className="whitespace-nowrap px-6">
            <FaLink className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Links"
            value={isLoading ? '...' : links.length.toString()}
            icon={FaLink}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Total Clicks"
            value={isLoading ? '...' : totalClicks.toLocaleString()}
            icon={FaMousePointer}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Avg. Clicks/Link"
            value={isLoading ? '...' : avgClicks}
            icon={FaChartBar}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        <Card className="p-0 flex flex-col border border-code-gray/30 bg-midnight-light/50 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-sm font-display font-semibold text-white mb-4 uppercase tracking-wider opacity-60">
              Top Performing Links
            </h3>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary py-20">
              Loading statistics...
            </div>
          ) : links.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <FaLink className="h-10 w-10 text-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary">No data available yet</p>
              <p className="text-xs text-text-secondary/50">Shorten a link to see it perform!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-text-secondary uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Link</th>
                    <th className="px-6 py-3 font-medium">Destination</th>
                    <th className="px-6 py-3 font-medium text-center">Clicks</th>
                    <th className="px-6 py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-code-gray/20">
                  {links
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5)
                    .map((link) => (
                      <tr key={link.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-mono text-cyber-blue font-medium">
                          <div className="flex items-center gap-2">
                            <span>/{link.shortId}</span>
                            <button
                              onClick={() => copyToClipboard(link.shortId)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white"
                              title="Copy"
                            >
                              {copyingId === link.shortId ? (
                                <span className="text-neon-green text-[10px]">Copied!</span>
                              ) : (
                                <FaCopy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary max-w-xs truncate">
                          {link.originalUrl}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${link.clicks > 0
                              ? 'bg-cyber-blue/20 text-cyber-blue'
                              : 'bg-code-gray/20 text-text-secondary'
                              }`}
                          >
                            {link.clicks}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-text-secondary text-xs">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchStats}
      />
    </DashboardLayout>
  );
};

export default DashboardOverview;
