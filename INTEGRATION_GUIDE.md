# Integration Guide for Phase 3 & 4 Implementation

This guide provides step-by-step instructions for integrating the new TypeScript improvements and services into your existing codebase.

## Overview

The implementation includes:
- **Type Safety**: Strict TypeScript configuration with comprehensive type definitions
- **Logging Service**: Structured logging with remote capabilities
- **Performance Monitoring**: Real-time performance metrics tracking
- **Error Handling**: Centralized error management with recovery strategies
- **Accessibility Service**: WCAG compliance and accessibility features

## Step 1: Fix TypeScript Errors

### Automatic Fix Script

Run the provided script to fix common TypeScript errors:

```bash
node fix-typescript-errors.js
```

### Manual Fixes

For remaining errors, apply these patterns:

#### 1. Fix Missing Return Statements

```typescript
// Before
export const getUsers: RequestHandler = async (req, res) => {
  try {
    // ... code ...
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
};

// After
export const getUsers: RequestHandler = async (req, res) => {
  try {
    // ... code ...
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
};
```

#### 2. Fix Implicit Any Types

```typescript
// Before
const categories = questions.map(q => q.category);

// After
const categories = questions.map((q: any) => q.category);
```

#### 3. Fix Unused Variables

```typescript
// Before
const { reason, durationDays } = req.body;

// After
const { reason: _reason, durationDays: _durationDays } = req.body;
```

#### 4. Fix Unused Parameters

```typescript
// Before
export const getStats: RequestHandler = async (req, res) => {

// After
export const getStats: RequestHandler = async (_req, res) => {
```

## Step 2: Integrate Logging Service

### Replace Console Calls

```typescript
// Before
import { logger } from '@/services/loggingService';

// Replace console.log
console.log('User logged in', user);
// After
logger.info('User logged in', { user_id: user.id }, user);

// Replace console.error
console.error('API error', error);
// After
logger.error('API error', { action: 'api_call' }, null, error);

// Replace console.warn
console.warn('Deprecated feature used');
// After
logger.warn('Deprecated feature used', { action: 'deprecated_feature' });
```

### Performance Logging

```typescript
import { measureAsyncOperation } from '@/services/performanceService';

// Wrap async operations
const fetchData = measureAsyncOperation('fetch_user_data', async () => {
  const response = await fetch('/api/user');
  return response.json();
});
```

## Step 3: Integrate Error Handling Service

### Replace Try-Catch Blocks

```typescript
// Before
try {
  const data = await apiCall();
  return data;
} catch (error) {
  console.error('API call failed', error);
  throw error;
}

// After
import { handleError, handleApiError } from '@/services/errorHandlingService';

try {
  const data = await apiCall();
  return data;
} catch (error) {
  handleApiError(error, { action: 'api_call' });
  throw error;
}
```

### Component Error Boundaries

```typescript
import { handleErrorBoundary } from '@/services/errorHandlingService';

class MyErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleErrorBoundary(error, errorInfo, { component: 'MyComponent' });
  }
}
```

## Step 4: Integrate Performance Monitoring

### Track Custom Metrics

```typescript
import { addCustomMetric } from '@/services/performanceService';

// Track custom metrics
addCustomMetric('user_registration_time', 1500);
addCustomMetric('payment_processing_time', 800);
```

### Monitor Component Performance

```typescript
import { measureOperation } from '@/services/performanceService';

const MyComponent = () => {
  const handleClick = measureOperation('button_click', () => {
    // Button click logic
  });

  return <button onClick={handleClick}>Click me</button>;
};
```

## Step 5: Integrate Accessibility Service

### Update Components

```typescript
import { accessibilityService } from '@/services/accessibilityService';

// In your component
useEffect(() => {
  // Check for accessibility violations
  const violations = accessibilityService.getViolations();
  if (violations.length > 0) {
    console.warn('Accessibility violations found:', violations);
  }
}, []);

// Announce to screen readers
accessibilityService.announceToScreenReader('New message received');
```

### Add Accessibility Features

```typescript
// Enable high contrast mode
accessibilityService.updatePreferences({
  features: { high_contrast: true }
});

// Enable large text
accessibilityService.updatePreferences({
  font_size: 'large'
});
```

## Step 6: Update Existing Components

### Example: Update Auth Component

```typescript
// Before
import { useState } from 'react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginUser(credentials);
      console.log('Login successful', result);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
};

// After
import { useState } from 'react';
import { logger } from '@/services/loggingService';
import { handleApiError } from '@/services/errorHandlingService';
import { measureAsyncOperation } from '@/services/performanceService';
import { accessibilityService } from '@/services/accessibilityService';

export const Auth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = measureAsyncOperation('user_login', async () => {
    try {
      setLoading(true);
      const result = await loginUser(credentials);
      
      logger.info('User login successful', { 
        user_id: result.user.id,
        action: 'login' 
      });
      
      accessibilityService.announceToScreenReader('Login successful');
      
      return result;
    } catch (error) {
      handleApiError(error, { action: 'login' });
      throw error;
    } finally {
      setLoading(false);
    }
  });

  return (
    <button 
      onClick={handleLogin}
      aria-label="Login to your account"
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  );
};
```

## Step 7: Environment Configuration

### Add Environment Variables

```bash
# .env.local
VITE_LOGGING_ENDPOINT=https://your-logging-service.com/api/logs
VITE_PERFORMANCE_ENABLED=true
VITE_ACCESSIBILITY_ENABLED=true
```

### Update Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __PERFORMANCE_ENABLED__: JSON.stringify(process.env.VITE_PERFORMANCE_ENABLED === 'true'),
    __ACCESSIBILITY_ENABLED__: JSON.stringify(process.env.VITE_ACCESSIBILITY_ENABLED === 'true'),
  },
  // ... rest of config
});
```

## Step 8: Testing

### Test Logging Service

```typescript
// Test logging levels
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
logger.critical('Critical error');
```

### Test Performance Monitoring

```typescript
// Test performance metrics
const metrics = getPerformanceMetrics();
console.log('Performance metrics:', metrics);

const events = getPerformanceEvents();
console.log('Performance events:', events);
```

### Test Error Handling

```typescript
// Test error handling
handleError(new Error('Test error'), { 
  action: 'test',
  component: 'TestComponent' 
});
```

### Test Accessibility

```typescript
// Test accessibility features
const report = generateAccessibilityReport();
console.log('Accessibility report:', report);
```

## Step 9: Monitoring and Maintenance

### Regular Checks

1. **TypeScript Compilation**: Run `npx tsc --noEmit` regularly
2. **Performance Metrics**: Monitor performance trends
3. **Error Logs**: Review error logs for patterns
4. **Accessibility**: Run accessibility audits

### Performance Optimization

```typescript
// Monitor bundle size
import { performanceService } from '@/services/performanceService';

// Track bundle loading time
window.addEventListener('load', () => {
  const loadTime = performance.now();
  performanceService.addCustomMetric('bundle_load_time', loadTime);
});
```

### Error Recovery

```typescript
// Implement automatic recovery
import { errorHandlingService } from '@/services/errorHandlingService';

// Set up automatic retry for network errors
errorHandlingService.updatePreferences({
  retry: true,
  max_retries: 3,
  retry_delay: 1000
});
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Use the fix script and manual fixes
2. **Service Initialization**: Ensure services are initialized before use
3. **Performance Impact**: Monitor performance impact of new services
4. **Memory Leaks**: Check for memory leaks in long-running services

### Debug Mode

```typescript
// Enable debug mode for development
if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
  performanceService.enableDebugMode();
  errorHandlingService.enableDebugMode();
}
```

## Conclusion

This integration guide provides a comprehensive approach to implementing the new services and TypeScript improvements. Follow the steps systematically to ensure a smooth transition and maintain code quality.

For additional support, refer to the individual service documentation and TypeScript configuration files. 