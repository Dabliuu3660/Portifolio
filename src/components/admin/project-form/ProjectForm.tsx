'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ProjectFormData, MediaType, ProjectCategory, PROJECT_CATEGORIES } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { ProjectDetailsSection } from './ProjectDetailsSection';
import { MediaTypeSelector } from './MediaTypeSelector';
import { ImageUploadZone } from './ImageUploadZone';
import { VideoUploadSection } from './VideoUploadSection';

interface ProjectFormProps {
    onSubmit: (data: ProjectFormData) => void;
    loading?: boolean;
    initialData?: Partial<ProjectFormData>;
}

export const ProjectForm = ({ onSubmit, loading, initialData }: ProjectFormProps) => {
    const { categoryNames } = useCategories();

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState<ProjectCategory>(
        initialData?.category || PROJECT_CATEGORIES[0]
    );
    const [description, setDescription] = useState(initialData?.description || '');
    const [mediaType, setMediaType] = useState<MediaType>(initialData?.mediaType || 'image');
    const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');

    // Generate ID for new projects (for storage uploads) or use existing
    // We treat initialData as having an ID if we are editing, but initialData type is Partial<ProjectFormData>
    // We need to ensure we have an ID for uploads
    const [projectId] = useState<string>(() => {
        if (initialData?.id) return initialData.id;
        // Generate UUID v4
        return crypto.randomUUID();
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: projectId, // Pass the ID to be saved
            title,
            category,
            mediaType,
            mediaUrl,
            thumbnailUrl: mediaType === 'video' ? thumbnailUrl : undefined,
            description,
        });
    };

    return (
        <div className="flex justify-center w-full">
            <motion.form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-bg-primary dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Header */}
                <div className="p-8 border-b border-black/5 dark:border-white/10 bg-gradient-to-r from-accent/5 to-transparent">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        {initialData ? 'Editar Projeto' : 'Novo Projeto'}
                    </h2>
                    <p className="text-text-secondary">
                        Preencha os detalhes abaixo para publicar no portfólio.
                    </p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Project Details */}
                    <ProjectDetailsSection
                        title={title}
                        onTitleChange={setTitle}
                        category={category}
                        onCategoryChange={setCategory}
                        description={description}
                        onDescriptionChange={setDescription}
                        categories={categoryNames}
                    />

                    {/* Media Type Selector */}
                    <MediaTypeSelector mediaType={mediaType} onMediaTypeChange={setMediaType} />

                    {/* Media Upload */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mediaType}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {mediaType === 'image' ? (
                                <ImageUploadZone
                                    mediaUrl={mediaUrl}
                                    onMediaUrlChange={setMediaUrl}
                                    projectId={projectId}
                                />
                            ) : (
                                <VideoUploadSection
                                    mediaUrl={mediaUrl}
                                    onMediaUrlChange={setMediaUrl}
                                    thumbnailUrl={thumbnailUrl}
                                    onThumbnailUrlChange={setThumbnailUrl}
                                    projectId={projectId}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="p-8 border-t border-black/5 dark:border-white/10 bg-bg-secondary flex justify-end">
                    <Button
                        type="submit"
                        className={`w-full md:w-auto px-8 py-4 text-base font-bold text-white ${mediaType === 'video'
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-black dark:bg-[#00f0ff] dark:text-black dark:hover:bg-[#00f0ff]/90'
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" /> Publicando...
                            </span>
                        ) : (
                            'Publicar Projeto'
                        )}
                    </Button>
                </div>
            </motion.form>
        </div>
    );
};
