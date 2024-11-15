import { useState } from 'react';
import { toast } from 'react-toastify';
import Input from '../Atoms/Input';
import Button from '../Atoms/Button';
// import {handleUrl} from '../../hooks/useShortenValidations';

export default function ShortenForm({ onSuccess, onCreateLink }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (onCreateLink) {
        await onCreateLink(url);
        toast.success('Link created successfully');
      }
      
      setUrl('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <div
        className="
          flex 
          flex-col 
          items-center 
          gap-4 
          justify-center 
          md:flex-row
        "
      >
        <Input 
          placeholder="Enter a link to be shortened" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          text={isLoading ? "Processing..." : "Shorten link"} 
          variant="normal" 
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
