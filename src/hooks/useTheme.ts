'use client';

import { useState, useEffect, useCallback } from 'react';
import { Theme } from '@/types/theme';

const THEME_KEY = 'portfolio_theme';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(THEME_KEY) as Theme | null;
        if (stored) {
            setTheme(stored);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme, mounted]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return {
        theme,
        toggleTheme,
        mounted,
    };
};
