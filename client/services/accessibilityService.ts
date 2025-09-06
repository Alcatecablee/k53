import {  logger  } from './loggingService';

// Accessibility features interface
export interface AccessibilityFeatures {
  high_contrast: boolean;
  large_text: boolean;
  screen_reader: boolean;
  reduced_motion: boolean;
  keyboard_navigation: boolean;
  focus_indicators: boolean;
  color_blind_friendly: boolean;
  dyslexia_friendly: boolean;
}

// Accessibility preferences
export interface AccessibilityPreferences {
  features: AccessibilityFeatures;
  font_size: 'small' | 'medium' | 'large' | 'extra_large';
  line_spacing: 'tight' | 'normal' | 'loose';
  color_scheme: 'default' | 'high_contrast' | 'dark' | 'light';
  animation_speed: 'normal' | 'slow' | 'reduced';
  sound_enabled: boolean;
  voice_commands: boolean;
}

// Accessibility violation
export interface AccessibilityViolation {
  type: 'error' | 'warning' | 'info';
  element: string;
  issue: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcag_criterion?: string;
  suggestion: string;
  timestamp: string;
}

// Keyboard navigation state
export interface KeyboardNavigationState {
  is_enabled: boolean;
  current_focus: string | null;
  focus_history: string[];
  tab_index: number;
}

class AccessibilityService {
  private preferences: AccessibilityPreferences;
  private violations: AccessibilityViolation[] = [];
  private keyboardState: KeyboardNavigationState;
  private isInitialized = false;
  private observers: MutationObserver[] = [];
  private focusTraps: Set<HTMLElement> = new Set();

  constructor() {
    this.preferences = this.getDefaultPreferences();
    this.keyboardState = this.getDefaultKeyboardState();
  }

  private getDefaultPreferences(): AccessibilityPreferences {
    return {
      features: {
        high_contrast: false,
        large_text: false,
        screen_reader: false,
        reduced_motion: false,
        keyboard_navigation: true,
        focus_indicators: true,
        color_blind_friendly: false,
        dyslexia_friendly: false
      },
      font_size: 'medium',
      line_spacing: 'normal',
      color_scheme: 'default',
      animation_speed: 'normal',
      sound_enabled: true,
      voice_commands: false
    };
  }

  private getDefaultKeyboardState(): KeyboardNavigationState {
    return {
      is_enabled: true,
      current_focus: null,
      focus_history: [],
      tab_index: 0
    };
  }

  public initialize(): void {
    if (this.isInitialized) return;

    this.loadPreferences();
    this.setupEventListeners();
    this.applyAccessibilityFeatures();
    this.startMonitoring();

    this.isInitialized = true;

    logger.info('Accessibility service initialized', {
      action: 'accessibility_init',
      preferences: this.preferences
    });
  }

  private loadPreferences(): void {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem('accessibility_preferences') : null;
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      logger.warn('Failed to load accessibility preferences', {
        action: 'accessibility_load_error'
      }, error);
    }
  }

  private savePreferences(): void {
    try {
      typeof window !== "undefined" ? localStorage.setItem('accessibility_preferences', JSON.stringify(this.preferences)) : null);
    } catch (error) {
      logger.warn('Failed to save accessibility preferences', {
        action: 'accessibility_save_error'
      }, error);
    }
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Focus management
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Screen reader announcements
    document.addEventListener('aria-live', this.handleAriaLive.bind(this));

    // Reduced motion preference
    const mediaQuery = typeof window !== "undefined" ? window.matchMedia('(prefers-reduced-motion: reduce)') : null');
    mediaQuery.addEventListener('change', this.handleReducedMotionChange.bind(this));

    // High contrast preference
    const highContrastQuery = typeof window !== "undefined" ? window.matchMedia('(prefers-contrast: high)') : null');
    highContrastQuery.addEventListener('change', this.handleHighContrastChange.bind(this));
  }

  private applyAccessibilityFeatures(): void {
    const { features, font_size, line_spacing, color_scheme, animation_speed } = this.preferences;

    // Apply CSS custom properties
    const root = typeof document !== "undefined" ? document.documentElement : null;

    // Font size
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      extra_large: '1.25rem'
    };
    root.style.setProperty('--accessibility-font-size', fontSizeMap[font_size]);

    // Line spacing
    const lineSpacingMap = {
      tight: '1.2',
      normal: '1.5',
      loose: '2.0'
    };
    root.style.setProperty('--accessibility-line-spacing', lineSpacingMap[line_spacing]);

    // Color scheme
    if (color_scheme !== 'default') {
      root.setAttribute('data-color-scheme', color_scheme);
    }

    // Animation speed
    if (animation_speed === 'reduced' || features.reduced_motion) {
      root.style.setProperty('--accessibility-reduced-motion', '1');
    }

    // High contrast
    if (features.high_contrast) {
      root.setAttribute('data-high-contrast', 'true');
    }

    // Focus indicators
    if (features.focus_indicators) {
      root.setAttribute('data-focus-visible', 'true');
    }

    // Color blind friendly
    if (features.color_blind_friendly) {
      root.setAttribute('data-color-blind-friendly', 'true');
    }

    // Dyslexia friendly
    if (features.dyslexia_friendly) {
      root.setAttribute('data-dyslexia-friendly', 'true');
    }
  }

  private startMonitoring(): void {
    // Monitor DOM changes for accessibility issues
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkElementAccessibility(node as Element);
            }
          });
        }
      });
    });

    observer.observe(typeof document !== "undefined" ? document.body : null, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  private checkElementAccessibility(element: Element): void {
    // Check for missing alt text on images
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      if (!img.alt && !img.getAttribute('aria-label')) {
        this.addViolation({
          type: 'error',
          element: img.tagName,
          issue: 'Missing alt text for image',
          impact: 'serious',
          wcag_criterion: '1.1.1',
          suggestion: 'Add alt text describing the image content',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Check for proper heading structure
    if (/^H[1-6]$/.test(element.tagName)) {
      this.checkHeadingStructure(element as HTMLHeadingElement);
    }

    // Check for proper form labels
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
      this.checkFormLabel(element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement);
    }

    // Check for proper ARIA attributes
    this.checkAriaAttributes(element);
  }

  private checkHeadingStructure(heading: HTMLHeadingElement): void {
    const level = parseInt(heading.tagName.charAt(1));
    const previousHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).
    filter((h) => h.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING);

    if (previousHeadings.length > 0) {
      const lastHeading = previousHeadings[previousHeadings.length - 1] as HTMLHeadingElement;
      const lastLevel = parseInt(lastHeading.tagName.charAt(1));

      if (level > lastLevel + 1) {
        this.addViolation({
          type: 'warning',
          element: heading.tagName,
          issue: 'Skipped heading level',
          impact: 'moderate',
          wcag_criterion: '1.3.1',
          suggestion: `Use h${lastLevel + 1} instead of h${level}`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  private checkFormLabel(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
    const id = element.id;
    const hasLabel = id && typeof document !== "undefined" ? document.querySelector(`label[for="${id}"]`) : null;
    const hasAriaLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel) {
      this.addViolation({
        type: 'error',
        element: element.tagName,
        issue: 'Form control missing label',
        impact: 'serious',
        wcag_criterion: '3.3.2',
        suggestion: 'Add a label or aria-label attribute',
        timestamp: new Date().toISOString()
      });
    }
  }

  private checkAriaAttributes(element: Element): void {
    const ariaAttributes = ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden'];
    const hasAria = ariaAttributes.some((attr) => element.hasAttribute(attr));

    if (hasAria) {
      // Check for valid ARIA values
      const ariaLabel = element.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.trim() === '') {
        this.addViolation({
          type: 'error',
          element: element.tagName,
          issue: 'Empty aria-label attribute',
          impact: 'moderate',
          wcag_criterion: '4.1.2',
          suggestion: 'Provide meaningful aria-label text or remove the attribute',
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  private addViolation(violation: AccessibilityViolation): void {
    this.violations.push(violation);

    logger.warn('Accessibility violation detected', {
      action: 'accessibility_violation',
      violation
    }, violation);
  }

  // Event handlers
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.preferences.features.keyboard_navigation) return;

    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event);
        break;
      case 'Escape':
        this.handleEscapeKey(event);
        break;
      case 'Enter':
      case ' ':
        this.handleActivationKey(event);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowKeys(event);
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (event.shiftKey) {
      // Tab backwards
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
      focusableElements[previousIndex]?.focus();
    } else {
      // Tab forwards
      const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
      focusableElements[nextIndex]?.focus();
    }

    event.preventDefault();
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    // Close modals, dropdowns, etc.
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.getAttribute('data-close-on-escape') === 'true') {
      activeElement.click();
    }
  }

  private handleActivationKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && target.getAttribute('role') === 'button') {
      event.preventDefault();
      target.click();
    }
  }

  private handleArrowKeys(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const role = target.getAttribute('role');

    if (role === 'listbox' || role === 'combobox') {
      // Handle list navigation
      this.handleListNavigation(event);
    } else if (role === 'slider') {
      // Handle slider navigation
      this.handleSliderNavigation(event);
    }
  }

  private handleListNavigation(event: KeyboardEvent): void {
    const list = event.target as HTMLElement;
    const items = Array.from(list.querySelectorAll('[role="option"]')) as HTMLElement[];
    const currentIndex = items.findIndex((item) => item === document.activeElement);

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus();
      event.preventDefault();
    }
  }

  private handleSliderNavigation(event: KeyboardEvent): void {
    const slider = event.target as HTMLInputElement;
    const step = parseFloat(slider.step) || 1;
    const currentValue = parseFloat(slider.value) || 0;

    let newValue = currentValue;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(currentValue + step, parseFloat(slider.max) || 100);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(currentValue - step, parseFloat(slider.min) || 0);
        break;
    }

    if (newValue !== currentValue) {
      slider.value = newValue.toString();
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      event.preventDefault();
    }
  }

  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    this.keyboardState.current_focus = target.id || target.className || target.tagName;
    this.keyboardState.focus_history.push(this.keyboardState.current_focus);

    // Keep only last 10 focus history items
    if (this.keyboardState.focus_history.length > 10) {
      this.keyboardState.focus_history.shift();
    }

    // Add focus indicator
    if (this.preferences.features.focus_indicators) {
      target.setAttribute('data-focused', 'true');
    }
  }

  private handleFocusOut(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    target.removeAttribute('data-focused');
  }

  private handleAriaLive(event: Event): void {
    // Handle live region announcements
    const target = event.target as HTMLElement;
    const message = target.textContent || target.getAttribute('aria-label');

    if (message && this.preferences.features.screen_reader) {
      this.announceToScreenReader(message);
    }
  }

  private handleReducedMotionChange(event: MediaQueryListEvent): void {
    this.preferences.features.reduced_motion = event.matches;
    this.applyAccessibilityFeatures();
    this.savePreferences();
  }

  private handleHighContrastChange(event: MediaQueryListEvent): void {
    this.preferences.features.high_contrast = event.matches;
    this.applyAccessibilityFeatures();
    this.savePreferences();
  }

  // Public methods
  public updatePreferences(newPreferences: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.applyAccessibilityFeatures();
    this.savePreferences();

    logger.info('Accessibility preferences updated', {
      action: 'accessibility_preferences_update',
      preferences: this.preferences
    });
  }

  public getPreferences(): AccessibilityPreferences {
    return { ...this.preferences };
  }

  public getViolations(): AccessibilityViolation[] {
    return [...this.violations];
  }

  public clearViolations(): void {
    this.violations = [];
  }

  public getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="option"]'];


    return Array.from(document.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[];
  }

  public createFocusTrap(container: HTMLElement): void {
    this.focusTraps.add(container);

    const focusableElements = this.getFocusableElements().filter((el) =>
    container.contains(el)
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  public removeFocusTrap(container: HTMLElement): void {
    this.focusTraps.delete(container);
  }

  public announceToScreenReader(message: string): void {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('screen-reader-announcements');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'screen-reader-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      typeof document !== "undefined" ? document.body : null.appendChild(liveRegion);
    }

    liveRegion.textContent = message;

    // Clear the message after a short delay
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 1000);
  }

  public generateAccessibilityReport(): {
    violations: AccessibilityViolation[];
    preferences: AccessibilityPreferences;
    keyboardState: KeyboardNavigationState;
    focusableElements: number;
    score: number;
  } {
    const focusableElements = this.getFocusableElements().length;
    const criticalViolations = this.violations.filter((v) => v.impact === 'critical').length;
    const seriousViolations = this.violations.filter((v) => v.impact === 'serious').length;

    // Calculate accessibility score (0-100)
    const totalViolations = this.violations.length;
    const score = Math.max(0, 100 - criticalViolations * 20 - seriousViolations * 10 - totalViolations * 2);

    return {
      violations: this.violations,
      preferences: this.preferences,
      keyboardState: this.keyboardState,
      focusableElements,
      score
    };
  }

  public destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.focusTraps.clear();
    this.isInitialized = false;

    logger.info('Accessibility service destroyed', {
      action: 'accessibility_destroy'
    });
  }
}

// Create singleton instance
export const accessibilityService = new AccessibilityService();

// Export convenience functions
export const updateAccessibilityPreferences = (preferences: Partial<AccessibilityPreferences>) =>
accessibilityService.updatePreferences(preferences);

export const getAccessibilityPreferences = () => accessibilityService.getPreferences();

export const getAccessibilityViolations = () => accessibilityService.getViolations();

export const generateAccessibilityReport = () => accessibilityService.generateAccessibilityReport();

export const announceToScreenReader = (message: string) => accessibilityService.announceToScreenReader(message);

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  accessibilityService.initialize();
}
