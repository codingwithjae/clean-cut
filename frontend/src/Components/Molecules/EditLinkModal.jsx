import Button from '../Atoms/Button';

export default function EditLinkModal({ link, shortId, onClose, onSave, onShortIdChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-auto relative">
        <div className="absolute right-4 top-4">
          <Button 
            variant="icon" 
            icon="close" 
            onClick={onClose} 
            ariaLabel="Close modal"
          />
        </div>
        
        <div className="px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-medium text-white">Edit Short ID</h3>
          <p className="text-sm text-gray-400 mt-1">Enter a new custom short ID for this link.</p>
        </div>
        <div className="p-6">
          <div>
            <label htmlFor="short-id" className="block text-sm font-medium text-white mb-1">
              Short ID
            </label>
            <input
              id="short-id"
              type="text"
              className="w-full px-3 py-2 border border-gray-600 rounded-md text-black text-sm text-white"
              value={shortId}
              onChange={e => onShortIdChange(e.target.value)}
              placeholder="Enter custom short ID"
              autoFocus
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button 
              text="Save Changes"
              onClick={onSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
