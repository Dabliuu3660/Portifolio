'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    className?: string;
}

const variants = {
    primary:
        'bg-[linear-gradient(135deg,#2563eb_0%,#1e3a8a_100%)] text-white hover:opacity-90 shadow-lg shadow-blue-900/20',
    secondary:
        'bg-white/10 text-text-primary hover:bg-white/20 border border-white/10',
    danger:
        'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
};

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
}: ButtonProps) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        px-6 py-3 rounded-xl font-semibold transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
        ${variants[variant]}
        ${className}
      `}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
            {children}
        </motion.button>
    );
};
