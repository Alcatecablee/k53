import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  quality = 75,
  placeholder = "empty",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const currentPlaceholder = placeholderRef.current;
    if (!currentPlaceholder) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(currentPlaceholder);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gray-200 flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  if (!isInView) {
    return (
      <div
        ref={placeholderRef}
        className={cn(
          "bg-gray-200 animate-pulse",
          className
        )}
        style={{ width, height }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        "transition-opacity duration-300",
        !isLoaded && "opacity-0",
        isLoaded && "opacity-100",
        className
      )}
      loading={priority ? "eager" : "lazy"}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
    />
  );
}

// Responsive image component with multiple sizes
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'src'> {
  srcSet: {
    src: string;
    width: number;
  }[];
  defaultSrc: string;
}

export function ResponsiveImage({
  srcSet,
  defaultSrc,
  alt,
  className,
  priority = false,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-gray-200 flex items-center justify-center",
          className
        )}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  const srcSetString = srcSet
    .map(({ src, width }) => `${src} ${width}w`)
    .join(", ");

  return (
    <img
      src={defaultSrc}
      srcSet={srcSetString}
      alt={alt}
      className={cn(
        "transition-opacity duration-300 w-full h-auto",
        !isLoaded && "opacity-0",
        isLoaded && "opacity-100",
        className
      )}
      loading={priority ? "eager" : "lazy"}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
} 