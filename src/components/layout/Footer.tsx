'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-bold text-text-primary">
                            <span className="text-accent">A</span>RTHUR MATUMOTO
                        </h2>
                        <p className="text-text-secondary mt-1">
                            Designer Gráfico & Editor de Vídeos
                        </p>
                    </motion.div>
                </div>

                {/* Copyright */}
                <motion.div
                    className="mt-8 pt-8 border-t border-white/5 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-text-secondary text-sm flex items-center justify-center gap-1">
                        Feito por Arthur Matumoto
                        <span className="mx-2">•</span>
                        {new Date().getFullYear()}
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};
