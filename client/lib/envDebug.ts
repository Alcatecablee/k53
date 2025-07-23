// Environment debugging utility
import { env, getEnvironmentStatus, isEnvironmentValid } from './env';

export const debugEnvironment = () => {
  console.log('=== Environment Debug Info ===');
  console.log('Node Environment:', env.nodeEnv);
  console.log('Is Development:', env.isDevelopment);
  console.log('Is Production:', env.isProduction);
  console.log('Is Configured:', env.isConfigured);
  console.log('Supabase URL Present:', !!env.supabaseUrl);
  console.log('Supabase Key Present:', !!env.supabaseAnonKey);
  console.log('API URL:', env.apiUrl);
  
  const status = getEnvironmentStatus();
  console.log('Environment Status:', status);
  console.log('Is Valid:', isEnvironmentValid());
  console.log('==============================');
  
  return {
    isValid: isEnvironmentValid(),
    isDemoMode: !env.isConfigured,
    environment: env.nodeEnv,
    ...status
  };
};

// Auto-run debug in development
if (env.isDevelopment && typeof window !== 'undefined') {
  setTimeout(() => {
    debugEnvironment();
  }, 1000);
}
