'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Portfolio' },
    { href: '/resume', label: 'Currículo' },
    { href: '/contact', label: 'Contato' },
];

export const Header = () => {
    const pathname = usePathname();

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="mx-auto max-w-7xl px-6 py-4">
                <nav className="flex items-center justify-between rounded-2xl 
                        bg-white/5 backdrop-blur-xl border border-white/10 
                        px-6 py-4 shadow-2xl">
                    {/* Logo */}
                    <Link href="/" className="group">
                        <motion.h1
                            className="text-xl md:text-2xl font-bold text-text-primary"
                            whileHover={{ scale: 1.02 }}
                        >
                            <span className="text-accent">A</span>RTHUR
                            <span className="hidden md:inline text-text-secondary ml-2 font-light">
                                MATUMOTO
                            </span>
                        </motion.h1>
                    </Link>

                    {/* Navigation */}
                    <ul className="flex items-center gap-2 md:gap-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link href={item.href}>
                                        <motion.span
                                            className={`
                        relative px-3 py-2 md:px-4 text-sm md:text-base font-medium
                        transition-colors duration-300
                        ${isActive ? 'text-accent' : 'text-text-primary/70 hover:text-text-primary'}
                      `}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {item.label}
                                            {isActive && (
                                                <motion.div
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                                     w-1 h-1 rounded-full bg-accent"
                                                    layoutId="activeNav"
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </motion.span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
};
