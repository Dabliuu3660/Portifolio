// Theme type definitions

export type Theme = 'dark' | 'light';

export interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}
