'use client';

import { useState, useEffect } from 'react';

export function useAutoHideHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at top, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Only add scroll listener on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mediaQuery.matches) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      setIsVisible(true); // Always visible on desktop
    }

    const handleResize = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        if (!window.addEventListener.toString().includes('scroll')) {
          window.addEventListener('scroll', handleScroll, { passive: true });
        }
      } else {
        window.removeEventListener('scroll', handleScroll);
        setIsVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [lastScrollY]);

  return isVisible;
}
