// Input validation and sanitization service

export const ValidationService = {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Name validation
  isValidName(name: string): boolean {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  // Sanitize string input
  sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocols
      .slice(0, 1000); // Limit length
  },

  // Validate test parameters
  isValidTestParams(
    controlsCount: number,
    signsCount: number,
    rulesCount: number,
  ): boolean {
    return (
      Number.isInteger(controlsCount) &&
      controlsCount >= 1 &&
      controlsCount <= 20 &&
      Number.isInteger(signsCount) &&
      signsCount >= 1 &&
      signsCount <= 50 &&
      Number.isInteger(rulesCount) &&
      rulesCount >= 1 &&
      rulesCount <= 50
    );
  },

  // Validate scenario count
  isValidScenarioCount(count: number): boolean {
    return Number.isInteger(count) && count >= 1 && count <= 500;
  },

  // Rate limiting helper
  createRateLimiter(windowMs: number, maxRequests: number) {
    const requests = new Map<string, number[]>();

    return (userId: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(userId) || [];

      // Remove requests outside the window
      const validRequests = userRequests.filter(
        (time) => now - time < windowMs,
      );

      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }

      validRequests.push(now);
      requests.set(userId, validRequests);
      return true;
    };
  },
};

// Clean up rate limiter data periodically
setInterval(
  () => {
    // This would clean up old rate limiter data in a production system
  },
  60 * 60 * 1000,
); // Every hour
