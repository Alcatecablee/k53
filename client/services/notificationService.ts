import { toast } from "@/hooks/use-toast";
import * as React from "react";
import { ToastAction, type ToastActionElement } from "@/components/ui/toast";

export interface NotificationOptions {
  title?: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Replace all alert() calls with proper toast notifications
export const showNotification = (message: string, options: NotificationOptions = {}) => {
  const {
    title = options.type === "error" ? "Error" : "Notification",
    description = message,
    type = "info",
    duration = 5000,
    action
  } = options;

  // Map our simple action shape to a ToastAction element
  const actionElement: ToastActionElement | undefined = action
    ? (React.createElement(ToastAction, { altText: action.label, onClick: action.onClick }, action.label) as unknown as ToastActionElement)
    : undefined;

  toast({
    title,
    description,
    duration,
    variant: type === "error" ? "destructive" : "default",
    ...(actionElement && { action: actionElement }),
  });
};

// Success notifications
export const showSuccess = (message: string, title?: string) => {
  showNotification(message, {
    title: title || "Success",
    type: "success",
    duration: 3000
  });
};

// Error notifications
export const showError = (message: string, title?: string) => {
  showNotification(message, {
    title: title || "Error",
    type: "error",
    duration: 7000
  });
};

// Warning notifications
export const showWarning = (message: string, title?: string) => {
  showNotification(message, {
    title: title || "Warning",
    type: "warning",
    duration: 5000
  });
};

// Info notifications
export const showInfo = (message: string, title?: string) => {
  showNotification(message, {
    title: title || "Information",
    type: "info",
    duration: 4000
  });
};

import { logger } from './loggingService';

// Replace console.warn with structured logging
export const logWarning = (message: string, context?: unknown) => {
  logger.warn(message, { action: 'notification_warning' }, context);
};

// Replace console.error with structured logging
export const logError = (message: string, error?: unknown, context?: unknown) => {
  logger.error(message, { action: 'notification_error' }, context, error instanceof Error ? error : undefined);
};

// Replace console.log with structured logging
export const logInfo = (message: string, data?: unknown) => {
  logger.info(message, { action: 'notification_info' }, data);
};

// Utility for common error patterns
export const handleApiError = (error: any, context: string) => {
  const errorMessage = error?.message || error?.error || "An unexpected error occurred";
  
  logError(`${context}: ${errorMessage}`, error, { context });
  showError(errorMessage, `${context} Failed`);
};

// Utility for common success patterns
export const handleApiSuccess = (message: string, context: string) => {
  logInfo(`${context}: ${message}`);
  showSuccess(message, `${context} Successful`);
};

// Utility for feature coming soon
export const showComingSoon = (feature: string) => {
  showInfo(`${feature} feature coming soon!`, "Feature Preview");
};

// Utility for confirmation dialogs
export const showConfirmation = (
  title: string,
  description: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  // This would integrate with a confirmation dialog component
  // For now, we'll use a simple approach
  if (window.confirm(`${title}\n\n${description}`)) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
}; 