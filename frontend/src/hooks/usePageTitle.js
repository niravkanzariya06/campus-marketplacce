import { useEffect } from 'react';

const BASE_TITLE = 'Campus Marketplace';

/**
 * Sets the document title for SEO. Restores the base title on unmount.
 * @param {string} title - Page-specific title segment
 */
export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = prev; };
  }, [title]);
}
