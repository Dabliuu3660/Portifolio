'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTheme as useThemeHook } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const ThemeContext = createContext<ReturnType<typeof useThemeHook> | null>(null);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const themeState = useThemeHook();

    // Prevent flash of wrong theme
    if (!themeState.mounted) {
        return (
            <div className="dark">
                {children}
            </div>
        );
    }

    return (
        <ThemeContext.Provider value={themeState}>
            <div className={themeState.theme}>
                {children}
                <ThemeToggle theme={themeState.theme} onToggle={themeState.toggleTheme} />
            </div>
        </ThemeContext.Provider>
    );
};
