import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article" | "video" | "book";
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  jsonLd?: object;
  noIndex?: boolean;
  noFollow?: boolean;
}

const DEFAULT_SEO: SEOData = {
  title:
    "SuperK53 - Official K53 Learner's License Platform | Department of Transport",
  description:
    "Official K53 learner's license preparation platform authorized by the Department of Transport, South Africa. Practice tests, scenarios, and comprehensive study materials for passing your K53 exam.",
  keywords:
    "K53, learners licence, driving test, South Africa, Department of Transport, practice test, driving exam, road signs, traffic rules",
  ogType: "website",
  ogImage: "/og-image.jpg",
  ogImageAlt: "SuperK53 Official K53 Learner's License Platform",
  twitterCard: "summary_large_image",
};

export function useSEO(seoData: Partial<SEOData> = {}) {
  const location = useLocation();

  useEffect(() => {
    const data = { ...DEFAULT_SEO, ...seoData };
    const baseUrl = "https://superk53.co.za"; // Replace with actual domain
    const fullUrl = baseUrl + location.pathname;

    // Update document title
    document.title = data.title;

    // Update or create meta tags
    updateMetaTag("description", data.description);
    updateMetaTag("keywords", data.keywords || DEFAULT_SEO.keywords!);
    updateMetaTag(
      "robots",
      `${data.noIndex ? "noindex" : "index"},${data.noFollow ? "nofollow" : "follow"}`,
    );

    // Canonical URL
    updateLinkTag("canonical", data.canonicalUrl || fullUrl);

    // Open Graph tags
    updateMetaTag("og:title", data.title, "property");
    updateMetaTag("og:description", data.description, "property");
    updateMetaTag("og:type", data.ogType || "website", "property");
    updateMetaTag("og:url", fullUrl, "property");
    updateMetaTag("og:site_name", "SuperK53", "property");
    updateMetaTag("og:locale", "en_ZA", "property");

    if (data.ogImage) {
      updateMetaTag(
        "og:image",
        data.ogImage.startsWith("http") ? data.ogImage : baseUrl + data.ogImage,
        "property",
      );
      updateMetaTag("og:image:alt", data.ogImageAlt || data.title, "property");
      updateMetaTag("og:image:width", "1200", "property");
      updateMetaTag("og:image:height", "630", "property");
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", data.twitterCard || "summary_large_image");
    updateMetaTag("twitter:title", data.title);
    updateMetaTag("twitter:description", data.description);
    updateMetaTag("twitter:site", "@SuperK53ZA");
    updateMetaTag("twitter:creator", "@SuperK53ZA");

    if (data.ogImage) {
      updateMetaTag(
        "twitter:image",
        data.ogImage.startsWith("http") ? data.ogImage : baseUrl + data.ogImage,
      );
      updateMetaTag("twitter:image:alt", data.ogImageAlt || data.title);
    }

    // Additional SEO meta tags
    updateMetaTag(
      "author",
      "Department of Transport, Republic of South Africa",
    );
    updateMetaTag("publisher", "SuperK53");
    updateMetaTag("application-name", "SuperK53");
    updateMetaTag("apple-mobile-web-app-title", "SuperK53");

    // Geographic tags for South Africa
    updateMetaTag("geo.region", "ZA");
    updateMetaTag("geo.country", "South Africa");
    updateMetaTag("geo.placename", "South Africa");

    // Language and locale
    updateMetaTag("language", "English");
    updateMetaTag("content-language", "en-ZA");

    // JSON-LD Structured Data
    if (data.jsonLd) {
      updateJsonLd(data.jsonLd);
    }
  }, [location.pathname, seoData]);
}

function updateMetaTag(
  name: string,
  content: string,
  attribute: "name" | "property" = "name",
) {
  if (!content) return;

  let element = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement;

  if (element) {
    element.content = content;
  } else {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    element.content = content;
    document.head.appendChild(element);
  }
}

function updateLinkTag(rel: string, href: string) {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (element) {
    element.href = href;
  } else {
    element = document.createElement("link");
    element.rel = rel;
    element.href = href;
    document.head.appendChild(element);
  }
}

function updateJsonLd(data: object) {
  // Remove existing JSON-LD
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new JSON-LD
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// SEO configurations for different pages
export const SEO_CONFIGS = {
  home: {
    title:
      "K53 Learner's Licence Test Practice | Official South Africa Driving Test | SuperK53",
    description:
      "Pass your K53 learner's licence test with our official practice platform. 1000+ questions, 220+ scenarios, and comprehensive study materials. Free practice tests available. Department of Transport approved.",
    keywords:
      "K53 learners licence, K53 test, driving test South Africa, learners licence practice, K53 exam, driving test questions, K53 study guide, learners licence test, K53 practice test, driving licence South Africa, K53 questions, learners licence online, K53 test preparation, driving test practice, K53 learner's licence, South Africa driving test, K53 exam questions, learners licence study, K53 test questions, driving licence practice",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "SuperK53",
      alternateName: "K53 Learner's Licence Practice Platform",
      description: "Official K53 learner's licence preparation platform for South Africa",
      url: "https://superk53.co.za",
      logo: "https://superk53.co.za/images/pwa/icon-512x512.svg",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+27-800-123-456",
        contactType: "customer service",
        areaServed: "ZA",
        availableLanguage: ["English", "Afrikaans", "Zulu"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "ZA",
        addressRegion: "All Provinces",
      },
      sameAs: [
        "https://twitter.com/SuperK53ZA",
        "https://facebook.com/SuperK53ZA",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "K53 Practice Tests",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Free K53 Practice Tests",
              description: "Basic practice tests with 5 scenarios per day"
            }
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Premium K53 Practice",
              description: "Unlimited scenarios and advanced analytics"
            }
          }
        ]
      }
    },
  },

  practice: {
    title: "K53 Practice Test Online | Free Learner's Licence Questions | SuperK53",
    description:
      "Take free K53 practice tests online with real exam questions. Practice vehicle controls, road signs, and traffic regulations. 1000+ questions, immediate feedback, and progress tracking.",
    keywords:
      "K53 practice test online, K53 questions free, learners licence practice test, K53 test online, driving test practice questions, K53 exam practice, learners licence test questions, K53 practice questions, driving test online, K53 test preparation, learners licence practice online, K53 exam questions, driving test practice test, K53 online test, learners licence test practice",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "K53 Practice Test Platform",
      description: "Interactive K53 practice test platform with real exam questions",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "1250"
      }
    },
  },

  documentation: {
    title: "K53 Study Guide 2025 | Complete Learner's Licence Documentation | SuperK53",
    description:
      "Complete K53 study guide and documentation for 2025. Test structure, passing requirements, preparation tips, and official Department of Transport guidelines. Everything you need to pass your learner's licence.",
          keywords:
        "K53 study guide 2025, learners licence study guide, K53 documentation, K53 test structure, learners licence requirements, K53 passing score, K53 study materials, learners licence documentation, K53 test guide, K53 exam structure, learners licence study, K53 preparation guide, K53 test requirements, learners licence documentation 2025, K53 study materials South Africa",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Complete K53 Study Guide 2025",
      description: "Comprehensive guide for K53 learner's licence preparation in South Africa",
      author: {
        "@type": "Organization",
        name: "Department of Transport, South Africa",
      },
      publisher: {
        "@type": "Organization",
        name: "SuperK53",
        logo: {
          "@type": "ImageObject",
          url: "https://superk53.co.za/images/pwa/icon-512x512.svg",
        },
      },
      mainEntityOfPage: "https://superk53.co.za/docs",
      datePublished: "2025-01-01",
      dateModified: "2025-08-18",
    },
  },

  dltc: {
    title: "DLTC Testing Centers Near Me | K53 Test Centers South Africa | SuperK53",
    description:
      "Find DLTC testing centers near you for K53 learner's licence exams. Complete directory with contact details, operating hours, and services across all South African provinces.",
    keywords:
      "DLTC testing centers, K53 test centers, learners licence test centers, DLTC near me, K53 test center locations, learners licence test center, DLTC contact details, K53 testing centers South Africa, DLTC operating hours, learners licence test centers near me, K53 exam centers, DLTC directory, K53 test center contact, learners licence test center locations",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "DLTC Testing Centers Directory",
      description: "Complete directory of official K53 testing centers in South Africa",
      numberOfItems: 500,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Place",
            name: "DLTC Testing Centers",
            description: "Official K53 learner's licence testing centers"
          }
        }
      ]
    },
  },

  progress: {
    title: "K53 Progress Tracker | Learning Analytics & Achievements | SuperK53",
    description:
      "Track your K53 learning progress with detailed analytics. View achievements, monitor performance across categories, and get personalized insights for better test preparation.",
    keywords:
      "K53 progress tracker, learners licence progress, K53 learning analytics, K53 achievements, learners licence tracking, K53 performance analytics, K53 study progress, learners licence analytics, K53 learning tracking, K53 achievement system, learners licence progress tracker, K53 performance tracking, K53 study analytics, learners licence learning progress",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "K53 Progress Tracker",
      description: "Personalized learning progress and achievement tracking for K53 preparation",
      applicationCategory: "EducationalApplication",
    },
  },

  pricing: {
    title: "SuperK53 Premium Plans | Unlimited K53 Practice Tests | R39/month",
    description:
      "Upgrade to SuperK53 Premium for unlimited scenario tests, advanced analytics, and premium study materials. Affordable monthly plans starting at R39. Cancel anytime.",
    keywords:
      "SuperK53 premium, K53 premium plans, learners licence premium, K53 unlimited practice, SuperK53 pricing, K53 subscription plans, learners licence premium features, K53 unlimited tests, SuperK53 monthly plans, K53 premium subscription, learners licence unlimited practice, K53 premium pricing, SuperK53 subscription, K53 unlimited scenarios, learners licence premium plans",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "SuperK53 Premium",
      description: "Premium K53 practice platform subscription with unlimited access",
      offers: {
        "@type": "Offer",
        price: "39",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2025-12-31",
      },
    },
  },

  // New blog SEO configurations
  blog: {
    title: "K53 Learner's Licence Blog | Tips, News & Study Guides | SuperK53",
    description:
      "Latest K53 learner's licence news, study tips, test preparation guides, and driving test advice. Expert insights to help you pass your K53 test in South Africa.",
    keywords:
      "K53 blog, learners licence blog, K53 news, K53 tips, learners licence tips, K53 study blog, K53 test advice, learners licence news, K53 preparation blog, K53 driving tips, learners licence study blog, K53 test tips, K53 exam blog, learners licence advice, K53 study tips blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "SuperK53 Blog",
      description: "K53 learner's licence preparation blog with tips and news",
      url: "https://superk53.co.za/blog",
      publisher: {
        "@type": "Organization",
        name: "SuperK53",
        logo: {
          "@type": "ImageObject",
          url: "https://superk53.co.za/images/pwa/icon-512x512.svg",
        },
      },
    },
  },

  blogPost: {
    title: "K53 Learner's Licence Test Guide | Complete Preparation Tips | SuperK53",
    description:
      "Complete guide to passing your K53 learner's licence test. Expert tips, study strategies, and everything you need to know about the South African driving test.",
    keywords:
      "K53 test guide, learners licence test guide, K53 preparation tips, K53 test tips, learners licence preparation, K53 exam guide, K53 test advice, learners licence test tips, K53 study guide, K53 test preparation, learners licence exam guide, K53 test strategy, K53 exam tips, learners licence preparation guide",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Complete K53 Learner's Licence Test Guide",
      description: "Expert guide to passing your K53 learner's licence test in South Africa",
      author: {
        "@type": "Organization",
        name: "SuperK53",
      },
      publisher: {
        "@type": "Organization",
        name: "SuperK53",
        logo: {
          "@type": "ImageObject",
          url: "https://superk53.co.za/images/pwa/icon-512x512.svg",
        },
      },
      mainEntityOfPage: "https://superk53.co.za/blog",
      datePublished: "2025-01-01",
      dateModified: "2025-08-18",
    },
  },
};
