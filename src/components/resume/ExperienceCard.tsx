'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { Experience } from '@/types/resume';

interface ExperienceCardProps {
    experience: Experience;
    index: number;
}

export const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
    return (
        <motion.div
            className="relative pl-8 pb-8 border-l-2 border-accent/30 last:border-transparent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
        >
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 
                      rounded-full bg-accent border-4 border-bg-primary" />

            {/* Content */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6
                      hover:border-accent/30 transition-colors duration-300">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-accent" />
                        <h3 className="text-xl font-bold text-text-primary">
                            {experience.company}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.period}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">
                    {experience.description}
                </p>
            </div>
        </motion.div>
    );
};
