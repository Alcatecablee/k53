import React from "react";
import { cn } from "@/lib/utils";

// Screen reader only text
export const ScreenReaderText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <span className={cn("sr-only", className)}>
    {children}
  </span>
);

// Accessible button with proper ARIA attributes
export const AccessibleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}> = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  variant = "primary",
  size = "md"
}) => {
  const baseClasses = "btn-accessible inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

// Accessible form field wrapper
export const AccessibleFormField: React.FC<{
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ label, error, required = false, children, className, id }) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;
  
  return (
    <div className={cn("space-y-2", className)}>
      <label 
        htmlFor={fieldId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          "aria-describedby": error ? errorId : descriptionId,
          "aria-invalid": !!error,
          className: cn(
            "form-field-accessible",
            (children as React.ReactElement).props.className
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible navigation item
export const AccessibleNavItem: React.FC<{
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}> = ({ 
  children, 
  href, 
  isActive = false, 
  isDisabled = false,
  onClick,
  className,
  ariaLabel
}) => {
  const baseClasses = "nav-accessible flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const activeClasses = isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-white";
  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  
  const commonProps = {
    className: cn(baseClasses, activeClasses, disabledClasses, className),
    "aria-current": isActive ? "page" as const : undefined,
    "aria-disabled": isDisabled,
    "aria-label": ariaLabel
  };
  
  if (href) {
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} {...commonProps}>
      {children}
    </button>
  );
};

// Accessible table
export const AccessibleTable: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}> = ({ children, className, ariaLabel, ariaDescribedBy }) => (
  <div className="relative w-full overflow-auto">
    <table 
      className={cn("w-full caption-bottom text-sm", className)}
      role="table"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </table>
  </div>
);

// Accessible table header
export const AccessibleTableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  scope?: "col" | "row";
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | "none";
  onSort?: () => void;
}> = ({ 
  children, 
  className, 
  scope = "col", 
  sortable = false,
  sortDirection = "none",
  onSort 
}) => {
  const baseClasses = "table-accessible h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0";
  const sortableClasses = sortable ? "cursor-pointer select-none" : "";
  
  const ariaSort = sortDirection !== "none" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined;
  
  if (sortable && onSort) {
    return (
      <th 
        className={cn(baseClasses, sortableClasses, className)}
        scope={scope}
        aria-sort={ariaSort}
        onClick={onSort}
        role="columnheader"
      >
        <div className="flex items-center space-x-1">
          {children}
          {sortable && (
            <span className="ml-1">
              {sortDirection === "asc" && "↑"}
              {sortDirection === "desc" && "↓"}
              {sortDirection === "none" && "↕"}
            </span>
          )}
        </div>
      </th>
    );
  }
  
  return (
    <th 
      className={cn(baseClasses, className)}
      scope={scope}
      aria-sort={ariaSort}
      role="columnheader"
    >
      {children}
    </th>
  );
};

// Accessible table cell
export const AccessibleTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  scope?: "col" | "row";
}> = ({ children, className, scope }) => (
  <td 
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    scope={scope}
    role="cell"
  >
    {children}
  </td>
);

// Accessible modal wrapper
export const AccessibleModal: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  className?: string;
}> = ({ children, isOpen, onClose, title, description, className }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn("modal-accessible relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4", className)}>
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold mb-2">
            {title}
          </h2>
          {description && (
            <p id="modal-description" className="text-sm text-gray-600 mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Skip to main content link
export const SkipToMainContent: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
  >
    Skip to main content
  </a>
);

// Live region for announcements
export const LiveRegion: React.FC<{
  children: React.ReactNode;
  className?: string;
  "aria-live"?: "polite" | "assertive" | "off";
}> = ({ children, className, "aria-live": ariaLive = "polite" }) => (
  <div 
    className={cn("sr-only", className)}
    aria-live={ariaLive}
    aria-atomic="true"
  >
    {children}
  </div>
); 
