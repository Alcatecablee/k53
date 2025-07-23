// Environment variable validation and management

interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiUrl: string;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Validate and get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const nodeEnv = import.meta.env.NODE_ENV || 'development';

  // Validate required environment variables
  const missingVars: string[] = [];
  
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');

  if (missingVars.length > 0) {
    const errorMessage = 
      `Missing required environment variables:\n${missingVars.map(v => `- ${v}`).join('\n')}\n\n` +
      'Please copy .env.example to .env and fill in your configuration.';
    
    console.error(errorMessage);
    throw new Error('Environment configuration is incomplete');
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    apiUrl,
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
  };
};

// Export validated environment config
export const env = getEnvironmentConfig();

// Helper functions
export const isEnvironmentValid = (): boolean => {
  try {
    getEnvironmentConfig();
    return true;
  } catch {
    return false;
  }
};

export const getEnvironmentStatus = () => {
  return {
    isValid: isEnvironmentValid(),
    environment: env.nodeEnv,
    hasSupabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
  };
};
