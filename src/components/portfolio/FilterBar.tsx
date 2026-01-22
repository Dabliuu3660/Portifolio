'use client';

import { motion } from 'framer-motion';
import { FilterValue } from '@/hooks/useFilter';
import { useCategories } from '@/hooks/useCategories';

interface FilterBarProps {
    activeFilter: FilterValue;
    onFilterChange: (filter: FilterValue) => void;
}

export const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
    const { categoryNames } = useCategories();
    const allFilters: FilterValue[] = ['all', ...categoryNames];

    return (
        <motion.div
            className="relative z-40 py-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {allFilters.map((filter) => {
                        const isActive = activeFilter === filter;
                        const label = filter === 'all' ? 'Todos' : filter;

                        return (
                            <motion.button
                                key={filter}
                                onClick={() => onFilterChange(filter)}
                                className={`
                                    relative px-5 py-2.5 rounded-full text-sm font-medium
                                    border transition-all duration-300
                                    ${isActive
                                        ? 'border-[#2563eb] bg-[linear-gradient(135deg,#2563eb_0%,#1e3a8a_100%)] text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                        : 'border-white/10 bg-white/5 text-text-secondary hover:border-[#2563eb]/50 hover:text-text-primary hover:bg-white/10'
                                    }
                                `}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                layout
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isActive && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-1.5 h-1.5 rounded-full bg-bg-primary"
                                        />
                                    )}
                                    {label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
