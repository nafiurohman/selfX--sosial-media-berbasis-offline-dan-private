// URL detection and formatting utilities

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export function detectUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

export function linkifyText(text: string): string {
  return text.replace(URL_REGEX, (url) => {
    const cleanUrl = url.replace(/[.,;!?]$/, ''); // Remove trailing punctuation
    const domain = extractDomain(cleanUrl);
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="url-link" data-domain="${domain}"><svg class="url-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>${cleanUrl}</a>`;
  });
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
