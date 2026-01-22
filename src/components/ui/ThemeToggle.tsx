'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    theme: 'dark' | 'light';
    onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
    return (
        <motion.button
            onClick={onToggle}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full 
                 bg-white/10 backdrop-blur-md border border-white/20
                 dark:bg-black/20 dark:border-white/10
                 hover:bg-white/20 dark:hover:bg-white/10
                 transition-colors duration-300 shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
            <div className="relative w-6 h-6">
                {/* Sun */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : 90,
                        opacity: theme === 'dark' ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Sun className="w-6 h-6 text-accent" />
                </motion.div>

                {/* Moon */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{
                        scale: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : -90,
                        opacity: theme === 'light' ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <Moon className="w-6 h-6 text-accent" />
                </motion.div>
            </div>
        </motion.button>
    );
};
