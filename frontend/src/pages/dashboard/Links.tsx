import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { type Link, LinkService } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { CreateLinkModal } from '@/components/organisms/CreateLinkModal';
import { EditLinkModal } from '@/components/organisms/EditLinkModal';
import { LinkTable } from '@/components/organisms/LinkTable';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

const LINKS_PER_PAGE = 8;

const LinksPage = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLinks = useCallback(async () => {
    try {
      const data = await LinkService.getAll();
      setLinks(data);
    } catch (_error) {
      toast.error('Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    const query = searchQuery.toLowerCase();
    return links.filter(
      (link) =>
        link.shortId.toLowerCase().includes(query) ||
        link.originalUrl.toLowerCase().includes(query),
    );
  }, [links, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / LINKS_PER_PAGE));
  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * LINKS_PER_PAGE;
    return filteredLinks.slice(start, start + LINKS_PER_PAGE);
  }, [filteredLinks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDeleteClick = (link: Link) => {
    setSelectedLink(link);
    setIsConfirmModalOpen(true);
  };

  const handleEditClick = (link: Link) => {
    setSelectedLink(link);
    setIsEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLink) return;
    setIsActionLoading(true);
    try {
      await LinkService.delete(selectedLink.shortId);
      setLinks((prev) => prev.filter((l) => l.shortId !== selectedLink.shortId));
      toast.success('Link deleted');
      setIsConfirmModalOpen(false);
    } catch (_error) {
      toast.error('Failed to delete link');
    } finally {
      setIsActionLoading(false);
      setSelectedLink(null);
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold text-white">My Links</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap px-6">
            <FaPlus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        </header>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search by slug or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-midnight-light border border-code-gray/50 rounded-xl text-white placeholder-text-secondary text-sm focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all"
          />
        </div>

        <LinkTable
          links={paginatedLinks}
          isLoading={isLoading}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
          emptyMessage={searchQuery ? 'No links match your search.' : undefined}
        />

        {filteredLinks.length > LINKS_PER_PAGE && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-text-secondary">
              Showing {(currentPage - 1) * LINKS_PER_PAGE + 1}–{Math.min(currentPage * LINKS_PER_PAGE, filteredLinks.length)} of {filteredLinks.length} links
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <FaChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-sm text-text-secondary font-mono px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <FaChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </section>

      <CreateLinkModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={fetchLinks}
      />

      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLink(null);
        }}
        onUpdated={fetchLinks}
        link={selectedLink}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedLink(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Link"
        message={`Are you sure you want to delete the link /${selectedLink?.shortId}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isActionLoading}
      />
    </DashboardLayout>
  );
};

export default LinksPage;
