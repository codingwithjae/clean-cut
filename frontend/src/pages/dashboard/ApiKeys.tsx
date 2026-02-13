import { useCallback, useEffect, useState } from 'react';
import { FaCopy, FaEye, FaEyeSlash, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthService } from '@/api/auth';
import { getApiErrorMessage } from '@/api/client';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DashboardLayout } from '@/components/templates/DashboardLayout';

const ApiKeysPage = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchApiKey = useCallback(async () => {
    try {
      const data = await AuthService.getApiKey();
      setApiKey(data.apiKey);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to fetch API Key'));
    }
  }, []);

  useEffect(() => {
    fetchApiKey();
  }, [fetchApiKey]);

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success('API Key copied!');
  };

  const confirmRegeneration = async () => {
    const isCreating = !apiKey;
    setIsActionLoading(true);
    try {
      const data = await AuthService.regenerateApiKey();
      setApiKey(data.apiKey);
      toast.success(isCreating ? 'API Key created!' : 'API Key regenerated!');
      setIsConfirmModalOpen(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, `Failed to ${isCreating ? 'create' : 'regenerate'} API Key`),
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  const isCreating = !apiKey;

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-display font-bold text-white">API Keys</h1>
          <p className="text-text-secondary">Manage your API keys for external access</p>
        </header>

        <Card className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-white mb-1">Standard API Key</h3>
            <p className="text-sm text-text-secondary mb-4">
              Use this key to authenticate requests from your applications. Keep it secret!
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-midnight-light border border-code-gray/50 rounded-lg px-4 py-3 font-mono text-sm text-text-primary flex items-center justify-between">
                <span>
                  {apiKey
                    ? isVisible
                      ? apiKey
                      : '••••••••••••••••••••••••'
                    : 'No API Key generated yet'}
                </span>
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-text-secondary hover:text-white transition-colors"
                    aria-label={isVisible ? 'Hide API key' : 'Show API key'}
                  >
                    {isVisible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {apiKey && (
                <Button variant="secondary" onClick={copyToClipboard}>
                  <FaCopy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              )}
            </div>
          </section>

          <section className="pt-6 border-t border-code-gray/30">
            <h4 className="text-sm font-medium text-white mb-2">
              {apiKey ? 'Danger Zone' : 'Get Started'}
            </h4>
            <div
              className={`flex items-center justify-between p-4 border rounded-lg ${
                apiKey ? 'border-red-500/20 bg-red-500/5' : 'border-cyber-blue/20 bg-cyber-blue/5'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${apiKey ? 'text-red-400' : 'text-cyber-blue'}`}>
                  {apiKey ? 'Regenerate API Key' : 'Create API Key'}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {apiKey
                    ? 'This will invalidate your current key immediately.'
                    : 'Get your first API key to start using the API.'}
                </p>
              </div>
              <Button
                variant={apiKey ? 'danger' : 'primary'}
                size="sm"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                <FaSync className="mr-2 h-4 w-4" />
                {apiKey ? 'Regenerate' : 'Create Key'}
              </Button>
            </div>
          </section>
        </Card>
      </section>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmRegeneration}
        title={isCreating ? 'Generate API Key' : 'Regenerate API Key'}
        message={
          isCreating
            ? 'Generate your first API Key? This will allow you to use our API.'
            : 'Are you sure? This will invalidate your current key immediately and any existing integrations will stop working.'
        }
        confirmText={isCreating ? 'Generate' : 'Regenerate'}
        isLoading={isActionLoading}
      />
    </DashboardLayout>
  );
};

export default ApiKeysPage;
