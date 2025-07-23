// Advanced meta tag management for dynamic SEO optimization

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

interface LinkTag {
  rel: string;
  href: string;
  type?: string;
  sizes?: string;
  crossorigin?: string;
  as?: string;
}

class MetaManager {
  private static instance: MetaManager;
  private managedTags: Set<string> = new Set();

  public static getInstance(): MetaManager {
    if (!MetaManager.instance) {
      MetaManager.instance = new MetaManager();
    }
    return MetaManager.instance;
  }

  // Update or create meta tag
  public updateMeta(tag: MetaTag): void {
    const selector = this.buildSelector(tag);
    let element = document.querySelector(selector) as HTMLMetaElement;

    if (element) {
      element.content = tag.content;
    } else {
      element = document.createElement("meta");

      if (tag.name) element.setAttribute("name", tag.name);
      if (tag.property) element.setAttribute("property", tag.property);
      if (tag.httpEquiv) element.setAttribute("http-equiv", tag.httpEquiv);

      element.content = tag.content;
      document.head.appendChild(element);
    }

    this.managedTags.add(selector);
  }

  // Update or create link tag
  public updateLink(link: LinkTag): void {
    const selector = `link[rel="${link.rel}"]${link.href ? `[href="${link.href}"]` : ""}`;
    let element = document.querySelector(selector) as HTMLLinkElement;

    if (element) {
      element.href = link.href;
      if (link.type) element.type = link.type;
      if (link.sizes) element.sizes = link.sizes;
      if (link.crossorigin) element.crossOrigin = link.crossorigin;
      if (link.as) element.setAttribute("as", link.as);
    } else {
      element = document.createElement("link");
      element.rel = link.rel;
      element.href = link.href;
      if (link.type) element.type = link.type;
      if (link.sizes) element.sizes = link.sizes;
      if (link.crossorigin) element.crossOrigin = link.crossorigin;
      if (link.as) element.setAttribute("as", link.as);

      document.head.appendChild(element);
    }

    this.managedTags.add(selector);
  }

  // Set page title with proper formatting
  public setTitle(title: string): void {
    document.title = title;

    // Also update og:title and twitter:title
    this.updateMeta({ property: "og:title", content: title });
    this.updateMeta({ name: "twitter:title", content: title });
  }

  // Set structured data
  public setStructuredData(data: object, id?: string): void {
    const existingScript = id
      ? document.querySelector(`script[data-schema-id="${id}"]`)
      : document.querySelector('script[type="application/ld+json"]');

    if (existingScript) {
      existingScript.textContent = JSON.stringify(data);
    } else {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(data);
      if (id) script.setAttribute("data-schema-id", id);
      document.head.appendChild(script);
    }
  }

  // Set comprehensive page SEO
  public setPageSEO(seo: {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogImage?: string;
    ogImageAlt?: string;
    twitterCard?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    jsonLd?: object;
  }): void {
    // Basic meta tags
    this.setTitle(seo.title);
    this.updateMeta({ name: "description", content: seo.description });

    if (seo.keywords) {
      this.updateMeta({ name: "keywords", content: seo.keywords });
    }

    // Robots meta
    const robotsContent = `${seo.noIndex ? "noindex" : "index"},${seo.noFollow ? "nofollow" : "follow"}`;
    this.updateMeta({ name: "robots", content: robotsContent });

    // Canonical URL
    if (seo.canonical) {
      this.updateLink({ rel: "canonical", href: seo.canonical });
    }

    // Open Graph tags
    this.updateMeta({ property: "og:title", content: seo.title });
    this.updateMeta({ property: "og:description", content: seo.description });
    this.updateMeta({ property: "og:type", content: "website" });
    this.updateMeta({ property: "og:site_name", content: "SuperK53" });
    this.updateMeta({ property: "og:locale", content: "en_ZA" });

    if (seo.canonical) {
      this.updateMeta({ property: "og:url", content: seo.canonical });
    }

    if (seo.ogImage) {
      this.updateMeta({ property: "og:image", content: seo.ogImage });
      this.updateMeta({
        property: "og:image:alt",
        content: seo.ogImageAlt || seo.title,
      });
      this.updateMeta({ property: "og:image:width", content: "1200" });
      this.updateMeta({ property: "og:image:height", content: "630" });
    }

    // Twitter Card tags
    this.updateMeta({
      name: "twitter:card",
      content: seo.twitterCard || "summary_large_image",
    });
    this.updateMeta({ name: "twitter:title", content: seo.title });
    this.updateMeta({ name: "twitter:description", content: seo.description });
    this.updateMeta({ name: "twitter:site", content: "@SuperK53ZA" });
    this.updateMeta({ name: "twitter:creator", content: "@SuperK53ZA" });

    if (seo.ogImage) {
      this.updateMeta({ name: "twitter:image", content: seo.ogImage });
      this.updateMeta({
        name: "twitter:image:alt",
        content: seo.ogImageAlt || seo.title,
      });
    }

    // Additional SEO meta tags
    this.updateMeta({
      name: "author",
      content: "Department of Transport, South Africa",
    });
    this.updateMeta({ name: "publisher", content: "SuperK53" });
    this.updateMeta({ name: "application-name", content: "SuperK53" });
    this.updateMeta({
      name: "apple-mobile-web-app-title",
      content: "SuperK53",
    });
    this.updateMeta({ name: "theme-color", content: "#1e293b" }); // slate-800

    // Geographic and language tags
    this.updateMeta({ name: "geo.region", content: "ZA" });
    this.updateMeta({ name: "geo.country", content: "South Africa" });
    this.updateMeta({ name: "language", content: "English" });
    this.updateMeta({ name: "content-language", content: "en-ZA" });

    // Structured data
    if (seo.jsonLd) {
      this.setStructuredData(seo.jsonLd);
    }
  }

  // Set up performance optimization tags
  public setPerformanceOptimizations(): void {
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      "//fonts.googleapis.com",
      "//fonts.gstatic.com",
      "//www.google-analytics.com",
      "//www.googletagmanager.com",
      "//connect.facebook.net",
      "//platform.twitter.com",
    ];

    dnsPrefetchDomains.forEach((domain) => {
      this.updateLink({ rel: "dns-prefetch", href: domain });
    });

    // Preconnect for critical resources
    this.updateLink({
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    });
    this.updateLink({
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    });

    // Resource hints for better performance
    this.updateMeta({ httpEquiv: "x-dns-prefetch-control", content: "on" });
  }

  // Set mobile and viewport optimizations
  public setMobileOptimizations(): void {
    // Viewport meta tag
    this.updateMeta({
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
    });

    // Mobile web app meta tags
    this.updateMeta({ name: "mobile-web-app-capable", content: "yes" });
    this.updateMeta({ name: "apple-mobile-web-app-capable", content: "yes" });
    this.updateMeta({
      name: "apple-mobile-web-app-status-bar-style",
      content: "default",
    });
    this.updateMeta({
      name: "apple-mobile-web-app-title",
      content: "SuperK53",
    });

    // Format detection
    this.updateMeta({ name: "format-detection", content: "telephone=yes" });

    // Touch icons
    this.updateLink({
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    });
    this.updateLink({
      rel: "icon",
      href: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    });
    this.updateLink({
      rel: "icon",
      href: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    });
    this.updateLink({ rel: "manifest", href: "/site.webmanifest" });
  }

  // Clean up managed tags
  public cleanup(): void {
    this.managedTags.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.managedTags.clear();
  }

  private buildSelector(tag: MetaTag): string {
    if (tag.name) return `meta[name="${tag.name}"]`;
    if (tag.property) return `meta[property="${tag.property}"]`;
    if (tag.httpEquiv) return `meta[http-equiv="${tag.httpEquiv}"]`;
    return "meta";
  }
}

// Export singleton instance
export const metaManager = MetaManager.getInstance();

// Utility functions for common SEO tasks
export function updatePageSEO(
  seoData: Parameters<typeof metaManager.setPageSEO>[0],
) {
  metaManager.setPageSEO(seoData);
}

export function setPageTitle(title: string) {
  metaManager.setTitle(title);
}

export function addStructuredData(data: object, id?: string) {
  metaManager.setStructuredData(data, id);
}

export function optimizePagePerformance() {
  metaManager.setPerformanceOptimizations();
  metaManager.setMobileOptimizations();
}

// Initialize on first import
if (typeof window !== "undefined") {
  // Set up basic optimizations immediately
  metaManager.setPerformanceOptimizations();
  metaManager.setMobileOptimizations();

  // Ensure charset is set correctly
  if (!document.querySelector("meta[charset]")) {
    const charset = document.createElement("meta");
    charset.setAttribute("charset", "utf-8");
    document.head.insertBefore(charset, document.head.firstChild);
  }
}
