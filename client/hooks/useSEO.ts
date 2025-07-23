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
      "SuperK53 - Official K53 Learner's License Platform | Department of Transport",
    description:
      "Official K53 learner's license preparation platform authorized by the Department of Transport, South Africa. Practice tests, scenarios, and comprehensive study materials.",
    keywords:
      "K53, learners licence, driving test, South Africa, Department of Transport, practice test, official, authorized",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "SuperK53",
      description: "Official K53 learner's license preparation platform",
      url: "https://superk53.co.za",
      logo: "https://superk53.co.za/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+27-800-123-456",
        contactType: "customer service",
        areaServed: "ZA",
        availableLanguage: ["English", "Afrikaans"],
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
    },
  },

  practice: {
    title: "K53 Practice Tests - Official Assessment Platform | SuperK53",
    description:
      "Take official K53 practice tests with real exam questions. Practice vehicle controls, road signs, and traffic regulations. Free and premium assessments available.",
    keywords:
      "K53 practice test, driving test practice, learners licence test, vehicle controls, road signs, traffic rules",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "K53 Practice Tests",
      description: "Interactive K53 practice test platform",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
      },
    },
  },

  documentation: {
    title: "K53 Documentation & Study Guide | SuperK53 Official Platform",
    description:
      "Comprehensive K53 study documentation covering test structure, passing requirements, preparation tips, and platform features. Official Department of Transport guidelines.",
    keywords:
      "K53 study guide, learners licence documentation, test structure, passing requirements, study materials",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Complete K53 Study Documentation",
      description: "Comprehensive guide for K53 learner's license preparation",
      author: {
        "@type": "Organization",
        name: "Department of Transport, South Africa",
      },
      publisher: {
        "@type": "Organization",
        name: "SuperK53",
        logo: {
          "@type": "ImageObject",
          url: "https://superk53.co.za/logo.png",
        },
      },
      mainEntityOfPage: "https://superk53.co.za/docs",
      datePublished: "2025-01-01",
      dateModified: "2025-01-01",
    },
  },

  dltc: {
    title: "DLTC Testing Centers Directory | Find K53 Test Centers | SuperK53",
    description:
      "Find official DLTC testing centers near you for K53 learner's license exams. Complete directory with contact details, hours, and services across South Africa.",
    keywords:
      "DLTC, testing center, K53 test center, learners licence test center, Department of Transport",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "DLTC Testing Centers",
      description: "Directory of official K53 testing centers",
      numberOfItems: 500,
      itemListElement: [
        {
          "@type": "GovernmentOffice",
          name: "DLTC Testing Centers",
          description: "Official Department of Transport testing facilities",
          areaServed: "South Africa",
        },
      ],
    },
  },

  pricing: {
    title: "SuperK53 Premium Plans & Pricing | Unlimited Practice Tests",
    description:
      "Upgrade to SuperK53 Premium for unlimited scenario tests, advanced analytics, and premium study materials. Affordable monthly plans starting at R49.",
    keywords:
      "SuperK53 premium, pricing plans, unlimited practice, premium features, subscription",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "SuperK53 Premium",
      description: "Premium K53 practice platform subscription",
      offers: {
        "@type": "Offer",
        price: "49",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2025-12-31",
      },
    },
  },
};
