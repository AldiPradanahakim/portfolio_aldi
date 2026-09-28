import { useEffect } from 'react';

/** Sets document.title for the current route; pass null while a route is still resolving. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
