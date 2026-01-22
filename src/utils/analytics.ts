// Analytics and Monitoring utilities

interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
}

/**
 * Send event to Google Analytics
 */
export const trackEvent = ({ category, action, label, value }: AnalyticsEvent): void => {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics:', { category, action, label, value });
    }
};

/**
 * Track page view
 */
export const trackPageView = (url: string, title?: string): void => {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
            page_path: url,
            page_title: title,
        });
    }

    if (process.env.NODE_ENV === 'development') {
        console.log('📄 Page View:', { url, title });
    }
};

/**
 * Track user interaction
 */
export const trackInteraction = (element: string, action: string): void => {
    trackEvent({
        category: 'User Interaction',
        action: action,
        label: element,
    });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string, success: boolean): void => {
    trackEvent({
        category: 'Form',
        action: success ? 'Submit Success' : 'Submit Error',
        label: formName,
    });
};

/**
 * Track project view
 */
export const trackProjectView = (projectId: string, projectTitle: string): void => {
    trackEvent({
        category: 'Portfolio',
        action: 'View Project',
        label: `${projectId}: ${projectTitle}`,
    });
};

/**
 * Track filter usage
 */
export const trackFilterUsage = (category: string): void => {
    trackEvent({
        category: 'Portfolio',
        action: 'Filter Projects',
        label: category,
    });
};

/**
 * Track performance metrics
 */
export const trackPerformance = (): void => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Wait for page to load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            if (window.gtag) {
                window.gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: pageLoadTime,
                    event_category: 'Performance',
                });

                window.gtag('event', 'timing_complete', {
                    name: 'connect_time',
                    value: connectTime,
                    event_category: 'Performance',
                });

                window.gtag('event', 'timing_complete', {
                    name: 'render_time',
                    value: renderTime,
                    event_category: 'Performance',
                });
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('⚡ Performance:', {
                    pageLoad: `${pageLoadTime}ms`,
                    connect: `${connectTime}ms`,
                    render: `${renderTime}ms`,
                });
            }
        }, 0);
    });
};

/**
 * Track errors
 */
export const trackError = (error: Error, context?: string): void => {
    if (window.gtag) {
        window.gtag('event', 'exception', {
            description: error.message,
            fatal: false,
            ...context && { context },
        });
    }

    // Also send to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('🔴 Error tracked:', { error, context });
    }
};

/**
 * Add to global window type
 */
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
