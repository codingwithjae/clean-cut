export const logger = {
    info: (message: string) => {
        console.log(`[${new Date().toISOString()}] INFO: ${message}`);
    },
    error: (message: string, error?: unknown) => {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
    },
    warn: (message: string) => {
        console.warn(`[${new Date().toISOString()}] WARN: ${message}`);
    },
};
