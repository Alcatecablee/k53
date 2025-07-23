// Application configuration management

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  features: {
    locationAware: boolean;
    caching: boolean;
    analytics: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxQuestionsPerTest: number;
    maxScenariosPerTest: number;
    cacheTimeout: number;
    rateLimitWindow: number;
    rateLimitRequests: number;
  };
  testing: {
    minPassRate: {
      controls: number;
      signs: number;
      rules: number;
    };
    testLengths: {
      practice: {
        controls: number;
        signs: number;
        rules: number;
      };
      official: {
        controls: number;
        signs: number;
        rules: number;
      };
    };
  };
}

const config: AppConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  features: {
    locationAware: true,
    caching: true,
    analytics: true,
    offlineMode: true,
  },
  limits: {
    maxQuestionsPerTest: 100,
    maxScenariosPerTest: 500,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    rateLimitWindow: 60 * 1000, // 1 minute
    rateLimitRequests: 10,
  },
  testing: {
    minPassRate: {
      controls: 0.75, // 75%
      signs: 0.82,    // 82%
      rules: 0.79,    // 79%
    },
    testLengths: {
      practice: {
        controls: 2,
        signs: 5,
        rules: 5,
      },
      official: {
        controls: 8,
        signs: 28,
        rules: 28,
      },
    },
  },
};

// Validation
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error('Missing required Supabase configuration');
}

export default config;

// Helper functions
export const getFeatureFlag = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature];
};

export const getLimit = (limit: keyof AppConfig['limits']): number => {
  return config.limits[limit];
};

export const getMinPassRate = (category: 'controls' | 'signs' | 'rules'): number => {
  return config.testing.minPassRate[category];
};

export const getTestLength = (type: 'practice' | 'official', category: 'controls' | 'signs' | 'rules'): number => {
  return config.testing.testLengths[type][category];
};
