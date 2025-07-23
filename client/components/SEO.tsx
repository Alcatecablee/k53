import { useEffect } from "react";
import { useSEO, SEOData } from "@/hooks/useSEO";

interface SEOProps extends Partial<SEOData> {
  children?: React.ReactNode;
}

export function SEO({ children, ...seoData }: SEOProps) {
  useSEO(seoData);

  useEffect(() => {
    // Ensure viewport meta tag exists
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement("meta");
      viewport.name = "viewport";
      viewport.content =
        "width=device-width, initial-scale=1.0, maximum-scale=5.0";
      document.head.appendChild(viewport);
    }

    // Ensure charset meta tag exists
    if (!document.querySelector("meta[charset]")) {
      const charset = document.createElement("meta");
      charset.setAttribute("charset", "utf-8");
      document.head.insertBefore(charset, document.head.firstChild);
    }

    // Add preconnect links for performance
    addPreconnectLink("https://fonts.googleapis.com");
    addPreconnectLink("https://fonts.gstatic.com");
    addPreconnectLink("https://www.google-analytics.com");

    // Add DNS prefetch for external domains
    addDNSPrefetch("//www.googletagmanager.com");
    addDNSPrefetch("//connect.facebook.net");
    addDNSPrefetch("//platform.twitter.com");
  }, []);

  return children ? <>{children}</> : null;
}

function addPreconnectLink(href: string) {
  if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (href.includes("gstatic")) {
      link.crossOrigin = "anonymous";
    }
    document.head.appendChild(link);
  }
}

function addDNSPrefetch(href: string) {
  if (!document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = href;
    document.head.appendChild(link);
  }
}

// Breadcrumb structured data component
export function BreadcrumbSEO({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  useEffect(() => {
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items]);

  return null;
}

// FAQ structured data component
export function FAQSEO({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  useEffect(() => {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [faqs]);

  return null;
}

// Course structured data for K53 preparation
export function CourseSEO() {
  useEffect(() => {
    const courseData = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "K53 Learner's License Preparation Course",
      description:
        "Comprehensive online course for K53 learner's license preparation in South Africa",
      provider: {
        "@type": "Organization",
        name: "Department of Transport, South Africa",
      },
      educationalLevel: "Beginner",
      courseCode: "K53-PREP",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT10H",
        instructor: {
          "@type": "Organization",
          name: "Department of Transport",
        },
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ZAR",
        availability: "https://schema.org/InStock",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(courseData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

// Website structured data for the main site
export function WebsiteSEO() {
  useEffect(() => {
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SuperK53",
      alternateName: "SuperK53 - K53 Learner's License Platform",
      url: "https://superk53.co.za",
      description:
        "Official K53 learner's license preparation platform authorized by the Department of Transport, South Africa",
      publisher: {
        "@type": "Organization",
        name: "Department of Transport, South Africa",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://superk53.co.za/docs?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      mainEntity: {
        "@type": "EducationalOrganization",
        name: "SuperK53",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+27-800-123-456",
          contactType: "customer service",
        },
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(websiteData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
