import Button from '../Atoms/Button';
import ShortenForm from './ShortenForm';

export default function DashboardModal({ onClose, onCreateLink }) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55">
      <div className="bg-gray-800 rounded-lg w-auto mx-auto shadow-xl relative">
        <div className="absolute right-4 top-4 z-10">
          <Button variant="icon" icon="close" onClick={onClose} ariaLabel="Close modal" />
        </div>

        <div className="p-8 flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Create New Link</h3>
          <ShortenForm onSuccess={handleSuccess} onCreateLink={onCreateLink} />
        </div>
      </div>
    </section>
  );
}
