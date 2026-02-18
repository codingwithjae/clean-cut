export const normalizeHttpUrl = (input: string): string | null => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return null;
  }

  const hasProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmedInput);
  const candidateUrl = hasProtocol ? trimmedInput : `https://${trimmedInput}`;

  try {
    const parsedUrl = new URL(candidateUrl);

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
};
