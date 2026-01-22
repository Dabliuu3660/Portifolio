'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Briefcase, Star } from 'lucide-react';
import { ResumeData, Experience } from '@/types/resume';
import { useAdminResume } from '@/hooks/useResume';
import { Button } from '@/components/ui/Button';

export const ResumeEditor = () => {
    const { resumeData, loading, saving, saveResume } = useAdminResume();
    const [formData, setFormData] = useState<ResumeData | null>(null);

    useEffect(() => {
        if (resumeData) {
            setFormData(resumeData);
        }
    }, [resumeData]);

    if (loading || !formData) {
        return <div className="p-8 text-center">Carregando currículo...</div>;
    }

    const handleChange = (field: keyof ResumeData, value: any) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = async () => {
        if (formData) {
            await saveResume(formData);
        }
    };

    // Experience Helpers
    const addExperience = () => {
        const newExp: Experience = {
            id: crypto.randomUUID(),
            company: 'Nova Empresa',
            period: '2025-Atualmente',
            description: 'Descrição das atividades...',
        };
        handleChange('experiences', [...formData.experiences, newExp]);
    };

    const removeExperience = (id: string) => {
        handleChange('experiences', formData.experiences.filter(e => e.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        handleChange('experiences', formData.experiences.map(e =>
            e.id === id ? { ...e, [field]: value } : e
        ));
    };

    // Skills Helpers
    const updateSkill = (type: 'softSkills' | 'hardSkillsDesign' | 'hardSkillsVideo', index: number, value: string) => {
        const newSkills = [...formData[type]];
        newSkills[index] = value;
        handleChange(type, newSkills);
    };

    const addSkill = (type: 'softSkills' | 'hardSkillsDesign' | 'hardSkillsVideo') => {
        handleChange(type, [...formData[type], 'Nova Habilidade']);
    };

    const removeSkill = (type: 'softSkills' | 'hardSkillsDesign' | 'hardSkillsVideo', index: number) => {
        const newSkills = [...formData[type]];
        newSkills.splice(index, 1);
        handleChange(type, newSkills);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 sticky top-24 z-30 backdrop-blur-md">
                <h2 className="text-xl font-bold text-text-primary">Editar Currículo</h2>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>

            {/* Profile */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-accent mb-4">Perfil</h3>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Nome Completo</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-text-primary focus:border-accent/50 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Sobre Mim</label>
                    <textarea
                        value={formData.about}
                        onChange={(e) => handleChange('about', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-text-primary focus:border-accent/50 outline-none resize-none"
                    />
                </div>
            </section>

            {/* Experience */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Experiência
                    </h3>
                    <Button variant="secondary" onClick={addExperience} className="text-sm py-2">
                        <Plus className="w-4 h-4 mr-1" /> Adicionar
                    </Button>
                </div>

                <div className="space-y-6">
                    <AnimatePresence>
                        {formData.experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative bg-black/20 rounded-xl p-4 border border-white/5"
                            >
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="grid md:grid-cols-2 gap-4 mb-4 pr-10">
                                    <div>
                                        <label className="text-xs text-text-secondary mb-1 block">Empresa</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm focus:border-accent/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary mb-1 block">Período</label>
                                        <input
                                            type="text"
                                            value={exp.period}
                                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm focus:border-accent/50 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary mb-1 block">Descrição</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm focus:border-accent/50 outline-none resize-none"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Skills */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Habilidades
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Soft Skills */}
                    <SkillList
                        title="Soft Skills"
                        skills={formData.softSkills}
                        onUpdate={(i, v) => updateSkill('softSkills', i, v)}
                        onAdd={() => addSkill('softSkills')}
                        onRemove={(i) => removeSkill('softSkills', i)}
                    />
                    {/* Design Skills */}
                    <SkillList
                        title="Design"
                        skills={formData.hardSkillsDesign}
                        onUpdate={(i, v) => updateSkill('hardSkillsDesign', i, v)}
                        onAdd={() => addSkill('hardSkillsDesign')}
                        onRemove={(i) => removeSkill('hardSkillsDesign', i)}
                    />
                    {/* Video Skills */}
                    <SkillList
                        title="Vídeo"
                        skills={formData.hardSkillsVideo}
                        onUpdate={(i, v) => updateSkill('hardSkillsVideo', i, v)}
                        onAdd={() => addSkill('hardSkillsVideo')}
                        onRemove={(i) => removeSkill('hardSkillsVideo', i)}
                    />
                </div>
            </section>
        </div>
    );
};

// Helper component for skill lists
const SkillList = ({ title, skills, onUpdate, onAdd, onRemove }: {
    title: string;
    skills: string[];
    onUpdate: (index: number, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}) => (
    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-text-primary">{title}</h4>
            <button onClick={onAdd} className="text-accent hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
            </button>
        </div>
        <div className="space-y-2">
            {skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => onUpdate(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm focus:border-accent/50 outline-none"
                    />
                    <button
                        onClick={() => onRemove(index)}
                        className="text-text-secondary hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    </div>
);
