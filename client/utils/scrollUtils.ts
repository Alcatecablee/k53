/**
 * Scroll utility functions for consistent scroll behavior across the app
 */

/**
 * Scrolls to the top of the page with smooth animation
 */
export const scrollToTop = (): void => {
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

/**
 * Scrolls to a specific element by ID
 */
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

/**
 * Scrolls to a specific element by selector
 */
export const scrollToSelector = (selector: string): void => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

/**
 * Gets the current scroll position
 */
export const getScrollPosition = (): { x: number; y: number } => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Checks if the page is scrolled to the top
 */
export const isScrolledToTop = (): boolean => {
  return window.pageYOffset === 0;
};

/**
 * Checks if the page is scrolled to the bottom
 */
export const isScrolledToBottom = (): boolean => {
  return window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight;
}; 