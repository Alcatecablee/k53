// Environment variable validation and management

interface EnvironmentConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  apiUrl: string;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isConfigured: boolean;
  paypal: {
    clientId: string | null;
    clientSecret: string | null;
    environment: 'sandbox' | 'production';
    isConfigured: boolean;
  };
}

// Get environment configuration with graceful fallbacks
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || null;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null;
  const apiUrl = import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:8080/api');
  const nodeEnv = import.meta.env.NODE_ENV || 'development';

  // PayPal configuration
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID ||
    import.meta.env.PAYPAL_CLIENT_ID || null;
  const paypalClientSecret = import.meta.env.VITE_PAYPAL_CLIENT_SECRET ||
    import.meta.env.PAYPAL_CLIENT_SECRET || null;
  const paypalEnvironment = (import.meta.env.VITE_PAYPAL_ENVIRONMENT ||
    import.meta.env.PAYPAL_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';

  const paypalConfigured = Boolean(paypalClientId);

  // Check if configuration is complete
  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
  
  // Log missing variables for debugging (but don't throw)
  if (!isConfigured) {
    const missingVars: string[] = [];
    if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
    
    console.warn(
      `Missing environment variables (app will run in demo mode):\n${missingVars.map(v => `- ${v}`).join('\n')}\n\n` +
      'For full functionality, set up environment variables as described in SECURITY.md'
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    apiUrl,
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isConfigured,
    paypal: {
      clientId: paypalClientId,
      clientSecret: paypalClientSecret,
      environment: paypalEnvironment,
      isConfigured: paypalConfigured,
    },
  };
};

// Export environment config (no longer throws errors)
export const env = getEnvironmentConfig();

// Helper functions
export const isEnvironmentValid = (): boolean => {
  return env.isConfigured;
};

export const getEnvironmentStatus = () => {
  return {
    isValid: env.isConfigured,
    environment: env.nodeEnv,
    hasSupabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
    hasPayPal: env.paypal.isConfigured,
    paypalEnvironment: env.paypal.environment,
    missingVars: [
      !env.supabaseUrl && 'VITE_SUPABASE_URL',
      !env.supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
    ].filter(Boolean),
    missingPayPalVars: [
      !env.paypal.clientId && 'VITE_PAYPAL_CLIENT_ID',
    ].filter(Boolean),
  };
};
