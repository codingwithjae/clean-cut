import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [links, setLinks] = useState([
    { id: 1, original: 'https://example.com', short: 'https://short.ly/1', clicks: 10 },
    { id: 2, original: 'https://google.com', short: 'https://short.ly/2', clicks: 25 },
  ]);

  const handleDelete = (id) => {
    setLinks(links.filter(link => link.id !== id));
    toast.success('Link deleted successfully!');
  };

  const handleEdit = (id) => {
    const newUrl = prompt('Enter the new URL:');
    if (newUrl) {
      setLinks(links.map(link => (link.id === id ? { ...link, original: newUrl } : link)));
      toast.success('Link updated successfully!');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-4">Original URL</th>
            <th className="p-4">Shortened URL</th>
            <th className="p-4">Clicks</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id} className="border-t">
              <td className="p-4">{link.original}</td>
              <td className="p-4">
                <a href={link.short} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {link.short}
                </a>
              </td>
              <td className="p-4">{link.clicks}</td>
              <td className="p-4 flex gap-2">
                <button
                  onClick={() => handleEdit(link.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}