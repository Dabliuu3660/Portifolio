'use client';

import { motion } from 'framer-motion';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';

interface MasonryGridProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export const MasonryGrid = ({ projects, onProjectClick }: MasonryGridProps) => {
    if (projects.length === 0) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Nenhum projeto encontrado
                </h3>
                <p className="text-text-secondary text-center">
                    Tente selecionar outra categoria ou adicione novos projetos.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            layout
        >
            {projects.map((project, index) => (
                <div key={project.id} className="break-inside-avoid">
                    <ProjectCard
                        project={project}
                        onClick={() => onProjectClick(project)}
                        index={index}
                    />
                </div>
            ))}
        </motion.div>
    );
};
