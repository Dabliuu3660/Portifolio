// Accessibility utilities

/**
 * Generates unique IDs for accessibility
 */
let idCounter = 0;
export const generateId = (prefix: string = 'a11y'): string => {
    idCounter += 1;
    return `${prefix}-${idCounter}`;
};

/**
 * Trap focus within a modal/dialog
 */
export const trapFocus = (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    element.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
};

/**
 * Announce to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    if (typeof window === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

/**
 * Get ARIA label for interactive elements
 */
export const getAriaLabel = (action: string, target?: string): string => {
    return target ? `${action} ${target}` : action;
};

/**
 * Keyboard navigation helpers
 */
export const KEYBOARD_KEYS = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab',
    HOME: 'Home',
    END: 'End',
} as const;

export const isKeyboardEvent = (
    event: React.KeyboardEvent,
    key: string | string[]
): boolean => {
    const keys = Array.isArray(key) ? key : [key];
    return keys.includes(event.key);
};

/**
 * Check if element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
    if (element.tabIndex < 0) return false;
    if (element.hasAttribute('disabled')) return false;

    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
    return focusableTags.includes(element.tagName);
};

/**
 * Get contrast ratio for WCAG compliance
 */
export const getContrastRatio = (foreground: string, background: string): number => {
    // Simplified calculation - in production use a proper library
    // This is a placeholder for the concept
    const getLuminance = (hex: string): number => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast meets WCAG AA standards
 * @param ratio - Contrast ratio
 * @param isLargeText - Is the text 18pt+ or 14pt+ and bold
 */
export const meetsWCAG_AA = (ratio: number, isLargeText: boolean = false): boolean => {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
};
