'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Image as ImageIcon } from 'lucide-react';
import { Project } from '@/types/project';
import { isYouTubeUrl, getYouTubeThumbnail } from '@/utils/youtube';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    index: number;
}

export const ProjectCard = ({ project, onClick, index }: ProjectCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isYouTube = isYouTubeUrl(project.mediaUrl);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && !isYouTube) {
            videoRef.current.play().catch(() => {
                // Autoplay might be blocked
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current && !isYouTube) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    // Determine aspect ratio based on category
    const getAspectRatio = () => {
        switch (project.category) {
            case 'Story Estaticos':
            case 'Videos editados':
                return 'aspect-[9/16]'; // Vertical for Stories
            case 'Banner':
            case 'Motion Video':
            case 'Video editado para campanha':
                return 'aspect-video'; // 16:9 for horizontal videos
            default:
                return 'aspect-square'; // Square for feed
        }
    };

    // Get thumbnail URL
    const getThumbnailUrl = () => {
        if (isYouTube) {
            return getYouTubeThumbnail(project.mediaUrl) || project.thumbnailUrl || project.mediaUrl;
        }
        return project.thumbnailUrl || project.mediaUrl;
    };

    return (
        <motion.div
            className={`
        group relative overflow-hidden rounded-2xl cursor-pointer
        bg-white/5 border border-white/10
        ${getAspectRatio()}
      `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            layout
        >
            {/* Media */}
            {project.mediaType === 'video' ? (
                <>
                    {/* Thumbnail - always visible for YouTube, conditional for regular videos */}
                    <img
                        src={getThumbnailUrl()}
                        alt={project.title}
                        className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-300
              ${isYouTube || !isHovered ? 'opacity-100' : 'opacity-0'}
            `}
                    />
                    {/* Video (only for non-YouTube videos, plays on hover) */}
                    {!isYouTube && (
                        <video
                            ref={videoRef}
                            src={project.mediaUrl}
                            muted
                            loop
                            playsInline
                            className={`
                absolute inset-0 w-full h-full object-cover
                transition-opacity duration-300
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
                        />
                    )}
                    {/* Play indicator */}
                    <div
                        className={`
              absolute top-4 right-4 p-2 rounded-full
              bg-black/50 backdrop-blur-sm
              transition-opacity duration-300
              ${isHovered ? 'opacity-0' : 'opacity-100'}
            `}
                    >
                        <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                </>
            ) : (
                <motion.img
                    src={project.mediaUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                         text-xs font-medium bg-accent/20 text-accent mb-2">
                    {project.mediaType === 'video' ? (
                        <Play className="w-3 h-3" />
                    ) : (
                        <ImageIcon className="w-3 h-3" />
                    )}
                    {project.category}
                </span>
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {project.title}
                </h3>
            </motion.div>
        </motion.div>
    );
};
