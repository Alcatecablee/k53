# Integration Examples

This document provides practical examples of how to integrate the new services into your existing components.

## Example 1: Update Auth Component

### Before (Original)
```typescript
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
```

### After (With New Services)
```typescript
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

## Example 2: Update API Service

### Before (Original)
```typescript
export const fetchUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

### After (With New Services)
```typescript
import { logger } from '@/services/loggingService';
import { handleNetworkError } from '@/services/errorHandlingService';
import { measureAsyncOperation } from '@/services/performanceService';

export const fetchUserData = measureAsyncOperation('fetch_user_data', async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    
    logger.info('User data fetched successfully', {
      user_id: userId,
      action: 'fetch_user_data'
    });
    
    return data;
  } catch (error) {
    handleNetworkError(`/api/users/${userId}`, error, {
      action: 'fetch_user_data',
      user_id: userId
    });
    throw error;
  }
});
```

## Example 3: Update Component with Error Boundary

### Before (Original)
```typescript
import React from 'react';

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData()
      .then(setUser)
      .catch(error => {
        console.error('Failed to load user:', error);
        setError(error);
      });
  }, []);

  if (error) {
    return <div>Error loading user profile</div>;
  }

  return <div>{user?.name}</div>;
};
```

### After (With New Services)
```typescript
import React from 'react';
import { logger } from '@/services/loggingService';
import { handleError } from '@/services/errorHandlingService';
import { measureAsyncOperation } from '@/services/performanceService';
import { accessibilityService } from '@/services/accessibilityService';

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = measureAsyncOperation('load_user_profile', async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
        
        logger.info('User profile loaded', {
          user_id: userData.id,
          action: 'load_profile'
        });
        
        accessibilityService.announceToScreenReader('User profile loaded');
        
        return userData;
      } catch (error) {
        handleError(error, {
          action: 'load_user_profile',
          component: 'UserProfile'
        });
        setError(error);
        throw error;
      }
    });

    loadUser();
  }, []);

  if (error) {
    return (
      <div role="alert" aria-live="polite">
        Error loading user profile. Please try again.
      </div>
    );
  }

  return (
    <div aria-label={`Profile for ${user?.name}`}>
      {user?.name}
    </div>
  );
};
```

## Example 4: Update Form Component

### Before (Original)
```typescript
export const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await submitContactForm(data);
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### After (With New Services)
```typescript
import { logger } from '@/services/loggingService';
import { handleValidationError } from '@/services/errorHandlingService';
import { measureAsyncOperation } from '@/services/performanceService';
import { accessibilityService } from '@/services/accessibilityService';

export const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = measureAsyncOperation('contact_form_submission', async (data) => {
    try {
      setSubmitting(true);
      
      // Validate form data
      if (!data.email || !data.message) {
        handleValidationError('email', 'Email and message are required');
        return;
      }
      
      await submitContactForm(data);
      
      logger.info('Contact form submitted', {
        action: 'contact_form_submit',
        email: data.email
      });
      
      accessibilityService.announceToScreenReader('Contact form submitted successfully');
      
    } catch (error) {
      handleApiError(error, { action: 'contact_form_submit' });
      throw error;
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="Contact form"
      role="form"
    >
      {/* Form fields */}
    </form>
  );
};
```

## Example 5: Update Error Boundary

### Before (Original)
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

### After (With New Services)
```typescript
import { handleErrorBoundary } from '@/services/errorHandlingService';
import { logger } from '@/services/loggingService';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    handleErrorBoundary(error, errorInfo, {
      component: 'ErrorBoundary'
    });
    
    logger.error('Error boundary caught error', {
      action: 'error_boundary',
      component: 'ErrorBoundary'
    }, null, error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          aria-live="assertive"
          aria-label="Error occurred"
        >
          Something went wrong. Please refresh the page.
        </div>
      );
    }
    return this.props.children;
  }
}
```

## Example 6: Update Performance Monitoring

### Before (Original)
```typescript
export const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    const start = Date.now();
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);
    } finally {
      setLoading(false);
      console.log(`Images loaded in ${Date.now() - start}ms`);
    }
  };

  return <div>...</div>;
};
```

### After (With New Services)
```typescript
import { measureAsyncOperation, addCustomMetric } from '@/services/performanceService';
import { logger } from '@/services/loggingService';

export const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadImages = measureAsyncOperation('load_image_gallery', async () => {
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);
      
      // Track custom metrics
      addCustomMetric('images_loaded_count', data.length);
      addCustomMetric('gallery_load_success', 1);
      
      logger.info('Image gallery loaded', {
        action: 'load_gallery',
        image_count: data.length
      });
      
      return data;
    } catch (error) {
      addCustomMetric('gallery_load_error', 1);
      throw error;
    } finally {
      setLoading(false);
    }
  });

  return <div>...</div>;
};
```

## Example 7: Update Accessibility Features

### Before (Original)
```typescript
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal">
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  );
};
```

### After (With New Services)
```typescript
import { accessibilityService } from '@/services/accessibilityService';
import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      // Create focus trap
      accessibilityService.createFocusTrap(document.querySelector('.modal'));
      
      // Announce modal opening
      accessibilityService.announceToScreenReader(`Modal opened: ${title}`);
      
      return () => {
        accessibilityService.removeFocusTrap(document.querySelector('.modal'));
      };
    }
  }, [isOpen, title]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <h2 id="modal-title">{title}</h2>
      <button 
        onClick={onClose}
        aria-label="Close modal"
        className="close-button"
      >
        Close
      </button>
      <div id="modal-description">
        {children}
      </div>
    </div>
  );
};
```

## Example 8: Update Service Integration

### Before (Original)
```typescript
// services/userService.ts
export const userService = {
  async getUser(id: string) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
  
  async updateUser(id: string, data: any) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### After (With New Services)
```typescript
import { logger } from '@/services/loggingService';
import { handleApiError } from '@/services/errorHandlingService';
import { measureAsyncOperation } from '@/services/performanceService';
import { User, UpdateUserData } from '@/types';

// services/userService.ts
export const userService = {
  async getUser(id: string): Promise<User> {
    return measureAsyncOperation('get_user', async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
        
        const user = await response.json();
        
        logger.info('User fetched successfully', {
          action: 'get_user',
          user_id: id
        });
        
        return user;
      } catch (error) {
        handleApiError(error, {
          action: 'get_user',
          user_id: id
        });
        throw error;
      }
    });
  },
  
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return measureAsyncOperation('update_user', async () => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.status}`);
        }
        
        const user = await response.json();
        
        logger.info('User updated successfully', {
          action: 'update_user',
          user_id: id,
          updated_fields: Object.keys(data)
        });
        
        return user;
      } catch (error) {
        handleApiError(error, {
          action: 'update_user',
          user_id: id
        });
        throw error;
      }
    });
  }
};
```

## Best Practices

### 1. Consistent Error Handling
- Always use `handleApiError` for API calls
- Use `handleValidationError` for form validation
- Use `handleErrorBoundary` for React errors

### 2. Performance Monitoring
- Wrap async operations with `measureAsyncOperation`
- Track custom metrics with `addCustomMetric`
- Monitor user interactions and page loads

### 3. Logging
- Replace all `console.log` with `logger.info`
- Replace all `console.error` with `logger.error`
- Add context to all log messages

### 4. Accessibility
- Use `accessibilityService.announceToScreenReader` for important events
- Add proper ARIA labels and roles
- Implement keyboard navigation
- Test with screen readers

### 5. Type Safety
- Use proper TypeScript types from `@/types`
- Avoid `any` types
- Use runtime type validation when needed

## Migration Checklist

- [ ] Replace `console.log` with `logger.info`
- [ ] Replace `console.error` with `logger.error`
- [ ] Add error handling to all API calls
- [ ] Wrap async operations with performance monitoring
- [ ] Add accessibility features to components
- [ ] Update error boundaries
- [ ] Add proper TypeScript types
- [ ] Test all integrations
- [ ] Monitor performance impact
- [ ] Validate accessibility compliance 