'use client';

import { motion } from 'framer-motion';
import { Palette, Video, Heart } from 'lucide-react';

interface SkillsGridProps {
    softSkills: string[];
    hardSkillsDesign: string[];
    hardSkillsVideo: string[];
}

export const SkillsGrid = ({
    softSkills,
    hardSkillsDesign,
    hardSkillsVideo,
}: SkillsGridProps) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 },
    };

    const SkillBadge = ({ skill, accent = false }: { skill: string; accent?: boolean }) => (
        <motion.span
            variants={item}
            className={`
        px-4 py-2 rounded-xl text-sm font-medium
        ${accent
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-text-primary border border-white/10'
                }
        hover:scale-105 transition-transform duration-200
      `}
            whileHover={{ y: -2 }}
        >
            {skill}
        </motion.span>
    );

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* Soft Skills */}
            <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-6 h-6 text-pink-400" />
                    <h3 className="text-lg font-bold text-text-primary">Soft Skills</h3>
                </div>
                <motion.div
                    className="flex flex-wrap gap-2"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {softSkills.map((skill) => (
                        <SkillBadge key={skill} skill={skill} />
                    ))}
                </motion.div>
            </motion.div>

            {/* Design Skills */}
            <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-2 mb-6">
                    <Palette className="w-6 h-6 text-accent" />
                    <h3 className="text-lg font-bold text-text-primary">Design</h3>
                </div>
                <motion.div
                    className="flex flex-wrap gap-2"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {hardSkillsDesign.map((skill) => (
                        <SkillBadge key={skill} skill={skill} accent />
                    ))}
                </motion.div>
            </motion.div>

            {/* Video Skills */}
            <motion.div
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-2 mb-6">
                    <Video className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-bold text-text-primary">Vídeo</h3>
                </div>
                <motion.div
                    className="flex flex-wrap gap-2"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {hardSkillsVideo.map((skill) => (
                        <SkillBadge key={skill} skill={skill} />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};
