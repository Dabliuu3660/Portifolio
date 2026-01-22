'use client';

import { motion } from 'framer-motion';
import { User, Briefcase, Lightbulb, Download } from 'lucide-react';
import { useResume } from '@/hooks/useResume';
import { ExperienceCard } from '@/components/resume/ExperienceCard';
import { SkillsGrid } from '@/components/resume/SkillsGrid';
import { Button } from '@/components/ui/Button';

export default function ResumePage() {
    const { resumeData, loading } = useResume();

    if (loading || !resumeData) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-purple-500
                     flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <User className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                    {resumeData.name}
                </h1>

                <p className="text-xl text-accent font-medium mb-2">
                    Designer Gráfico & Editor de Vídeos
                </p>

                <p className="text-text-secondary">
                    10 anos de experiência em design • 4 anos no mercado
                </p>
            </motion.div>

            {/* About Section */}
            <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-accent/20">
                        <User className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Sobre Mim</h2>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <p className="text-text-secondary leading-relaxed text-lg">
                        {resumeData.about}
                    </p>
                </div>
            </motion.section>

            {/* Experience Section */}
            <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-accent/20">
                        <Briefcase className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Experiência</h2>
                </div>

                <div className="space-y-0">
                    {resumeData.experiences.map((exp, index) => (
                        <ExperienceCard key={exp.id} experience={exp} index={index} />
                    ))}
                </div>
            </motion.section>

            {/* Skills Section */}
            <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-accent/20">
                        <Lightbulb className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Habilidades</h2>
                </div>

                <SkillsGrid
                    softSkills={resumeData.softSkills}
                    hardSkillsDesign={resumeData.hardSkillsDesign}
                    hardSkillsVideo={resumeData.hardSkillsVideo}
                />
            </motion.section>

            {/* Download CV */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <a href="/curriculo-arthur-matumoto.pdf" download="Curriculo-Arthur-Matumoto.pdf">
                    <Button className="mx-auto gap-2">
                        <Download className="w-5 h-5" />
                        Baixar Currículo PDF
                    </Button>
                </a>
                <p className="text-text-secondary text-sm mt-3">
                    Faça o download do currículo completo em formato PDF
                </p>
            </motion.div>
        </div>
    );
}
