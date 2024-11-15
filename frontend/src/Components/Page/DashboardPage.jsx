import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Dashboard from '../Organisms/Dashboard';
import EditLinkModal from '../Molecules/EditLinkModal';
import DashboardModal from '../Molecules/DashboardModal';

// Datos de ejemplo para mostrar en el dashboard
const initialLinks = [
  { id: 1, originalUrl: 'https://example.com', shortId: '1', clicks: 10 },
  { id: 2, originalUrl: 'https://google.com', shortId: '2', clicks: 25 }
];

export default function DashboardPage() {
  const [links, setLinks] = useState(initialLinks);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShortenFormOpen, setIsShortenFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [newShortId, setNewShortId] = useState('');

  const handleDelete = id => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Link deleted successfully');
  };

  const handleEditLink = link => {
    setEditingLink(link);
    setNewShortId(link.shortId);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setLinks(links.map(link => 
      link.id === editingLink.id 
        ? { ...link, shortId: newShortId } 
        : link
    ));
    setIsEditDialogOpen(false);
    toast.success('Link updated successfully');
  };
  
  const openShortenForm = () => {
    setIsShortenFormOpen(true);
  };

  const copyToClipboard = (shortId) => {
    const baseUrl = window.location.origin;
    const shortUrl = `${baseUrl}/${shortId}`;
    
    navigator.clipboard.writeText(shortUrl)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const addNewLink = (originalUrl, customShortId = null) => {
    const newId = links.length > 0 ? Math.max(...links.map(link => link.id)) + 1 : 1;
    const shortId = customShortId || Math.random().toString(36).substring(2, 8);
    
    const newLink = {
      id: newId,
      originalUrl,
      shortId,
      clicks: 0
    };
    
    setLinks([...links, newLink]);
    return newLink;
  };

  return (
    <>
      <Dashboard 
        links={links}
        onDelete={handleDelete}
        onEdit={handleEditLink}
        onCopy={copyToClipboard}
        onAddNew={openShortenForm}
      />
      
      {isShortenFormOpen && (
        <DashboardModal 
          onClose={() => setIsShortenFormOpen(false)} 
          onCreateLink={addNewLink}
        />
      )}
      
      {isEditDialogOpen && (
        <EditLinkModal 
          link={editingLink}
          shortId={newShortId}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEdit}
          onShortIdChange={setNewShortId}
        />
      )}
    </>
  );
}