'use client';
import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [pathname]);

  useEffect(() => {
    const handlePopState = () => {
      const scrollTimer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      
      return () => {
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
      };
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}

export default ScrollToTop;
