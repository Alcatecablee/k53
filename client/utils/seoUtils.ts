// SEO utility functions for optimizing content structure

export function generatePageTitle(pageTitle: string, siteName: string = 'SuperK53'): string {
  return `${pageTitle} | ${siteName}`;
}

export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + '...';
}

export function generateKeywords(baseKeywords: string[], pageSpecific: string[] = []): string {
  const allKeywords = [...baseKeywords, ...pageSpecific];
  return Array.from(new Set(allKeywords)).join(', ');
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'SuperK53',
    alternateName: 'SuperK53 - K53 Learner\'s License Platform',
    description: 'Official K53 learner\'s license preparation platform authorized by the Department of Transport, South Africa',
    url: 'https://superk53.co.za',
    logo: 'https://superk53.co.za/logo.png',
    image: 'https://superk53.co.za/og-image.jpg',
    telephone: '+27-800-123-456',
    email: 'support@superk53.co.za',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ZA',
      addressRegion: 'All Provinces',
      addressLocality: 'South Africa'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+27-800-123-456',
        contactType: 'customer service',
        areaServed: 'ZA',
        availableLanguage: ['English', 'Afrikaans'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00'
        }
      }
    ],
    sameAs: [
      'https://twitter.com/SuperK53ZA',
      'https://facebook.com/SuperK53ZA',
      'https://linkedin.com/company/superk53'
    ],
    foundingDate: '2025-01-01',
    founder: {
      '@type': 'Organization',
      name: 'Department of Transport, South Africa'
    }
  };
}

export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SuperK53 Practice Tests',
    description: 'Interactive K53 learner\'s license practice test platform',
    url: 'https://superk53.co.za/practice',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Chrome 90+, Firefox 88+, Safari 14+',
    permissions: 'location (optional)',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Practice Tests',
        price: '0',
        priceCurrency: 'ZAR',
        availability: 'https://schema.org/InStock',
        description: 'Unlimited practice and official tests, 5 scenarios daily'
      },
      {
        '@type': 'Offer',
        name: 'Premium Subscription',
        price: '49',
        priceCurrency: 'ZAR',
        availability: 'https://schema.org/InStock',
        description: 'Unlimited scenarios, advanced analytics, premium materials',
        priceValidUntil: '2025-12-31'
      }
    ],
    featureList: [
      'Practice Tests',
      'Official Simulations', 
      'Location-Aware Scenarios',
      'Progress Tracking',
      'Performance Analytics',
      'DLTC Directory'
    ]
  };
}

export function generateEducationalEventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalEvent',
    name: 'K53 Learner\'s License Preparation',
    description: 'Comprehensive online preparation for K53 learner\'s license examination',
    startDate: '2025-01-01',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: 'https://superk53.co.za'
    },
    organizer: {
      '@type': 'Organization',
      name: 'SuperK53',
      url: 'https://superk53.co.za'
    },
    educationalLevel: 'Beginner',
    teaches: [
      'Vehicle Controls',
      'Road Signs and Markings',
      'Traffic Regulations',
      'Driving Safety'
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock'
    }
  };
}

// Alt text generator for images
export function generateAltText(context: string, description?: string): string {
  const baseAlt = `SuperK53 ${context}`;
  return description ? `${baseAlt} - ${description}` : baseAlt;
}

// Generate canonical URL
export function generateCanonicalUrl(path: string, baseUrl: string = 'https://superk53.co.za'): string {
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
}

// Social media image generator
export function generateSocialImage(page: string, title?: string): string {
  const baseUrl = 'https://superk53.co.za';
  // In a real implementation, this could generate dynamic images
  return `${baseUrl}/images/social/${page}-og.jpg`;
}

// Performance hints for SEO
export function addResourceHints() {
  // Preload critical resources
  const preloadLinks = [
    { rel: 'preload', href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    { rel: 'preload', href: '/css/critical.css', as: 'style' },
  ];

  // DNS prefetch for external resources
  const dnsPrefetchLinks = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//www.google-analytics.com',
    '//www.googletagmanager.com'
  ];

  preloadLinks.forEach(link => {
    const linkElement = document.createElement('link');
    Object.entries(link).forEach(([key, value]) => {
      linkElement.setAttribute(key, value);
    });
    document.head.appendChild(linkElement);
  });

  dnsPrefetchLinks.forEach(href => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'dns-prefetch';
    linkElement.href = href;
    document.head.appendChild(linkElement);
  });
}

// Structured data validation
export function validateStructuredData(data: object): boolean {
  try {
    const jsonString = JSON.stringify(data);
    JSON.parse(jsonString); // Basic JSON validation
    
    // Check for required schema.org fields
    const stringData = jsonString.toLowerCase();
    return stringData.includes('@context') && stringData.includes('@type');
  } catch {
    return false;
  }
}

// Common base keywords for the platform
export const BASE_KEYWORDS = [
  'K53',
  'learners licence',
  'learners license',
  'driving test',
  'South Africa',
  'Department of Transport',
  'practice test',
  'road signs',
  'traffic rules',
  'vehicle controls',
  'DLTC',
  'driving exam',
  'licence test',
  'SuperK53'
];

// Page-specific keyword sets
export const PAGE_KEYWORDS = {
  home: ['official', 'authorized', 'preparation', 'platform'],
  practice: ['practice test', 'mock exam', 'assessment', 'simulation'],
  docs: ['study guide', 'documentation', 'preparation guide', 'test structure'],
  dltc: ['testing center', 'test center', 'DLTC', 'examination center'],
  pricing: ['premium', 'subscription', 'unlimited', 'features'],
  progress: ['tracking', 'analytics', 'performance', 'results']
};
