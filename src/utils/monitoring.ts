// Error Monitoring with Sentry (placeholder)

/**
 * Initialize error monitoring
 * When ready to use Sentry:
 * 1. npm install @sentry/nextjs
 * 2. npx @sentry/wizard@latest -i nextjs
 * 3. Configure with your DSN
 */

interface ErrorContext {
    user?: {
        id?: string;
        email?: string;
    };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
}

/**
 * Capture exception
 */
export const captureException = (error: Error, context?: ErrorContext): void => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Exception:', error);
        if (context) console.error('Context:', context);
    }

    // In production, this would send to Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     user: context?.user,
    //     extra: context?.extra,
    //     tags: context?.tags,
    //   });
    // }
};

/**
 * Capture message
 */
export const captureMessage = (
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`📝 ${level.toUpperCase()}:`, message);
        if (context) console.log('Context:', context);
    }

    // In production:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureMessage(message, {
    //     level,
    //     user: context?.user,
    //     extra: context?.extra,
    //     tags: context?.tags,
    //   });
    // }
};

/**
 * Set user context
 */
export const setUserContext = (user: { id: string; email?: string; name?: string }): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log('👤 User context set:', user);
    }

    // In production:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.setUser(user);
    // }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (
    message: string,
    category: string,
    level: 'info' | 'warning' | 'error' = 'info'
): void => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`🍞 Breadcrumb [${category}]:`, message);
    }

    // In production:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.addBreadcrumb({
    //     message,
    //     category,
    //     level,
    //     timestamp: Date.now() / 1000,
    //   });
    // }
};

/**
 * Error boundary wrapper
 */
export const withErrorBoundary = <T extends (...args: any[]) => any>(
    fn: T,
    errorHandler?: (error: Error) => void
): T => {
    return ((...args: Parameters<T>) => {
        try {
            const result = fn(...args);

            // Handle async functions
            if (result instanceof Promise) {
                return result.catch((error) => {
                    captureException(error);
                    errorHandler?.(error);
                    throw error;
                });
            }

            return result;
        } catch (error) {
            captureException(error as Error);
            errorHandler?.(error as Error);
            throw error;
        }
    }) as T;
};
