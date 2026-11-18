import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    // If a title is provided, append the portal name. Otherwise, just use the portal name.
    document.title = title ? `${title} | Digital Police Portal` : 'Digital Police Portal';
    
    // Optional: Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Digital Police Portal';
    };
  }, [title]);
}