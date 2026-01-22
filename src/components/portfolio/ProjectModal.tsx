'use client';

import { motion } from 'framer-motion';
import { Play, Calendar, Tag } from 'lucide-react';
import { Project } from '@/types/project';
import { Modal } from '@/components/ui/Modal';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '@/utils/youtube';

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
    if (!project) return null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric',
        }).format(new Date(date));
    };

    const isYouTube = isYouTubeUrl(project.mediaUrl);
    const embedUrl = isYouTube ? getYouTubeEmbedUrl(project.mediaUrl) : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col lg:flex-row">
                {/* Media */}
                <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                    {project.mediaType === 'video' ? (
                        isYouTube && embedUrl ? (
                            <iframe
                                src={`${embedUrl}?autoplay=1&rel=0`}
                                className="w-full h-full aspect-video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ minHeight: '500px', maxHeight: '70vh' }}
                            />
                        ) : (
                            <video
                                src={project.mediaUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain max-h-[70vh]"
                            />
                        )
                    ) : (
                        <motion.img
                            src={project.mediaUrl}
                            alt={project.title}
                            className="w-full h-full object-contain max-h-[70vh]"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </div>

                {/* Info */}
                <div className="lg:w-80 p-6 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                               text-sm font-medium bg-accent/20 text-accent">
                                {project.mediaType === 'video' ? (
                                    <Play className="w-4 h-4" />
                                ) : (
                                    <Tag className="w-4 h-4" />
                                )}
                                {project.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            {project.title}
                        </h2>

                        {/* Description */}
                        <p className="text-text-secondary leading-relaxed mb-6">
                            {project.description}
                        </p>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-text-secondary text-sm mt-auto">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(project.createdAt)}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Modal>
    );
};
