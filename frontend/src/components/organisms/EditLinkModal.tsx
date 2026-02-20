import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLink, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/api/client';
import { type Link, LinkService } from '@/api/link';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { type UpdateLinkFormData, updateLinkSchema } from '@/schemas/url.schema';
import { normalizeHttpUrl } from '@/shared/utils/url';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  link: Link | null;
}

export const EditLinkModal = ({ isOpen, onClose, onUpdated, link }: EditLinkModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateLinkFormData>({
    resolver: zodResolver(updateLinkSchema),
  });

  useEffect(() => {
    if (link) {
      reset({
        originalUrl: link.originalUrl,
        shortId: link.shortId,
      });
    }
  }, [link, reset]);

  const onSubmit = async (data: UpdateLinkFormData) => {
    if (!link) return;

    const normalizedUrl = normalizeHttpUrl(data.originalUrl ?? '');

    if (!normalizedUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    const currentNormalizedUrl = normalizeHttpUrl(link.originalUrl) ?? link.originalUrl;
    const trimmedShortId = data.shortId?.trim();

    const urlChanged = normalizedUrl !== currentNormalizedUrl;
    const shortIdChanged = Boolean(trimmedShortId) && trimmedShortId !== link.shortId;

    if (!urlChanged && !shortIdChanged) {
      toast.info('No changes to save');
      return;
    }

    setIsLoading(true);
    try {
      const payload: { originalUrl?: string; newShortId?: string } = {
        ...(urlChanged ? { originalUrl: normalizedUrl } : {}),
        ...(shortIdChanged ? { newShortId: trimmedShortId as string } : {}),
      };

      await LinkService.update(link.shortId, payload);
      toast.success('Link updated successfully!');
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update link'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-link-title"
        className="w-full max-w-md bg-midnight border border-code-gray rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-code-gray/50 bg-midnight-light">
          <h3 id="edit-link-title" className="font-display font-semibold text-white">
            Edit Link
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit link modal"
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
            label="Short ID"
            placeholder="acme1"
            error={errors.shortId?.message}
            {...register('shortId')}
          />

          <p className="-mt-4 ml-1 text-xs text-text-secondary">
            3-5 characters. Leave unchanged to keep current.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Update Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
