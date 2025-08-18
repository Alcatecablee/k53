import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    const scrollToTop = () => {
      // Use smooth scrolling if supported, otherwise instant
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    };

    // Small delay to ensure the new page has rendered
    const timer = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Scroll to top when using browser back/forward buttons
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
} 