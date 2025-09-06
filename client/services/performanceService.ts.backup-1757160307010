import { logger } from './loggingService';
import { AnalyticsEvent } from '@/types';

// Performance metrics interface
export interface PerformanceMetrics {
  // Page load metrics
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  
  // Resource loading metrics
  resourceLoadTimes: Record<string, number>;
  totalResourceSize: number;
  resourceCount: number;
  
  // Memory usage
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  
  // Network metrics
  networkRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  
  // Custom metrics
  customMetrics: Record<string, number>;
  
  // Timestamp
  timestamp: string;
}

// Performance observer types
export interface PerformanceObserverConfig {
  observeNavigation: boolean;
  observeResources: boolean;
  observePaint: boolean;
  observeLayout: boolean;
  observeFirstInput: boolean;
  observeLargestContentfulPaint: boolean;
}

// Performance event types
export type PerformanceEventType = 
  | 'page_load'
  | 'resource_load'
  | 'paint'
  | 'layout_shift'
  | 'first_input'
  | 'largest_contentful_paint'
  | 'memory_usage'
  | 'custom_metric';

export interface PerformanceEvent {
  type: PerformanceEventType;
  name: string;
  value: number;
  timestamp: string;
  metadata: Record<string, unknown> | undefined;
}

class PerformanceService {
  private observers: PerformanceObserver[] = [];
  private metrics: PerformanceMetrics;
  private events: PerformanceEvent[] = [];
  private customMetrics: Map<string, number> = new Map();
  private isInitialized = false;
  private memoryObserver: NodeJS.Timeout | null = null;

  constructor() {
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      pageLoadTime: 0,
      domContentLoaded: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      resourceLoadTimes: {},
      totalResourceSize: 0,
      resourceCount: 0,
      networkRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      customMetrics: {},
      timestamp: new Date().toISOString()
    };
  }

  public initialize(config: Partial<PerformanceObserverConfig> = {}): void {
    if (this.isInitialized) return;

    const defaultConfig: PerformanceObserverConfig = {
      observeNavigation: true,
      observeResources: true,
      observePaint: true,
      observeLayout: true,
      observeFirstInput: true,
      observeLargestContentfulPaint: true
    };

    const finalConfig = { ...defaultConfig, ...config };

    try {
      if (finalConfig.observeNavigation) {
        this.observeNavigation();
      }

      if (finalConfig.observeResources) {
        this.observeResources();
      }

      if (finalConfig.observePaint) {
        this.observePaint();
      }

      if (finalConfig.observeLayout) {
        this.observeLayoutShift();
      }

      if (finalConfig.observeFirstInput) {
        this.observeFirstInput();
      }

      if (finalConfig.observeLargestContentfulPaint) {
        this.observeLargestContentfulPaint();
      }

      this.startMemoryMonitoring();
      this.isInitialized = true;

      logger.info('Performance monitoring initialized', {
        action: 'performance_init',
        config: finalConfig
      });
    } catch (error) {
      logger.error('Failed to initialize performance monitoring', {
        action: 'performance_init_error'
      }, error);
    }
  }

  private observeNavigation(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
            this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
            
            this.addEvent('page_load', 'page_load_time', this.metrics.pageLoadTime);
            this.addEvent('page_load', 'dom_content_loaded', this.metrics.domContentLoaded);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe navigation performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private observeResources(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
            
            this.metrics.resourceLoadTimes[resourceEntry.name] = loadTime;
            this.metrics.resourceCount++;
            this.metrics.totalResourceSize += resourceEntry.transferSize || 0;
            
            this.addEvent('resource_load', resourceEntry.name, loadTime, {
              size: resourceEntry.transferSize,
              type: resourceEntry.initiatorType
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe resource performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private observePaint(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming;
            if (paintEntry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = paintEntry.startTime;
              this.addEvent('paint', 'first_contentful_paint', paintEntry.startTime);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe paint performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private observeLayoutShift(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift') {
            const layoutEntry = entry as any;
            this.metrics.cumulativeLayoutShift += layoutEntry.value;
            this.addEvent('layout_shift', 'cumulative_layout_shift', layoutEntry.value);
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe layout shift performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private observeFirstInput(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const inputEntry = entry as any;
            this.metrics.firstInputDelay = inputEntry.processingStart - inputEntry.startTime;
            this.addEvent('first_input', 'first_input_delay', this.metrics.firstInputDelay);
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe first input performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private observeLargestContentfulPaint(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcpEntry = entry as any;
            this.metrics.largestContentfulPaint = lcpEntry.startTime;
            this.addEvent('largest_contentful_paint', 'lcp', lcpEntry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      logger.warn('Failed to observe LCP performance', {
        action: 'performance_observer_error'
      }, error);
    }
  }

  private startMemoryMonitoring(): void {
    if (!('memory' in performance)) return;

    this.memoryObserver = setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };

        this.addEvent('memory_usage', 'memory_usage', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        });
      }
    }, 30000); // Check every 30 seconds
  }

  private addEvent(
    type: PerformanceEventType,
    name: string,
    value: number,
    metadata?: Record<string, unknown>
  ): void {
    const event: PerformanceEvent = {
      type,
      name,
      value,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.events.push(event);
    logger.logPerformance(name, value, { action: 'performance_event', event_type: type });
  }

  // Public methods
  public addCustomMetric(name: string, value: number): void {
    this.customMetrics.set(name, value);
    this.metrics.customMetrics[name] = value;
    this.addEvent('custom_metric', name, value);
  }

  public measureOperation<T>(name: string, operation: () => T | Promise<T>): T | Promise<T> {
    const start = performance.now();
    
    try {
      const result = operation();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          this.addCustomMetric(name, duration);
        });
      } else {
        const duration = performance.now() - start;
        this.addCustomMetric(name, duration);
        return result;
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.addCustomMetric(name, duration);
      throw error;
    }
  }

  public async measureAsyncOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - start;
      this.addCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.addCustomMetric(name, duration);
      throw error;
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getEvents(): PerformanceEvent[] {
    return [...this.events];
  }

  public getCustomMetrics(): Record<string, number> {
    return { ...this.metrics.customMetrics };
  }

  public generateAnalyticsEvent(): AnalyticsEvent {
    return {
      id: `perf_${Date.now()}`,
      event_type: 'performance_metrics',
      properties: {
        metrics: this.metrics,
        events: this.events.slice(-10), // Last 10 events
        custom_metrics: this.metrics.customMetrics
      },
      timestamp: new Date().toISOString()
    };
  }

  public reset(): void {
    this.metrics = this.initializeMetrics();
    this.events = [];
    this.customMetrics.clear();
  }

  public destroy(): void {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        logger.warn('Error disconnecting performance observer', {
          action: 'performance_cleanup_error'
        }, error);
      }
    });

    if (this.memoryObserver) {
      clearInterval(this.memoryObserver);
      this.memoryObserver = null;
    }

    this.observers = [];
    this.isInitialized = false;

    logger.info('Performance monitoring destroyed', {
      action: 'performance_destroy'
    });
  }
}

// Create singleton instance
export const performanceService = new PerformanceService();

// Export convenience functions
export const measureOperation = <T>(name: string, operation: () => T | Promise<T>) =>
  performanceService.measureOperation(name, operation);

export const measureAsyncOperation = <T>(name: string, operation: () => Promise<T>) =>
  performanceService.measureAsyncOperation(name, operation);

export const addCustomMetric = (name: string, value: number) =>
  performanceService.addCustomMetric(name, value);

export const getPerformanceMetrics = () => performanceService.getMetrics();

export const getPerformanceEvents = () => performanceService.getEvents();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  performanceService.initialize();
} 