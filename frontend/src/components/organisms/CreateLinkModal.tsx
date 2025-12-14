import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLink, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LinkService } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { type CreateLinkFormData, createLinkSchema } from '@/schemas/url.schema';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateLinkModal = ({ isOpen, onClose, onCreated }: CreateLinkModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        originalUrl: data.originalUrl,
        shortId: data.shortId || undefined,
      };
      await LinkService.create(payload);
      toast.success('Link created successfully!');
      reset();
      onCreated();
      onClose();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-midnight border border-code-gray rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-code-gray/50 bg-midnight-light">
          <h3 className="font-display font-semibold text-white">Create New Link</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Input
            label="Destination URL"
            placeholder="https://example.com/my-long-url"
            icon={<FaLink className="h-4 w-4" />}
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />

          <Input
            label="Custom Short ID (Optional)"
            placeholder="my-custom-link"
            error={errors.shortId?.message}
            {...register('shortId')}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
