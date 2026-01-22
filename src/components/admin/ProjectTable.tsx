'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Play, ImageIcon, AlertTriangle, ImageOff } from 'lucide-react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ProjectTableProps {
    projects: Project[];
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
}

export const ProjectTable = ({
    projects,
    onEdit,
    onDelete,
    loading,
}: ProjectTableProps) => {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDeleteConfirm = () => {
        if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    if (projects.length === 0) {
        return (
            <div className="bg-bg-primary dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Nenhum projeto cadastrado
                </h3>
                <p className="text-text-secondary">
                    Adicione seu primeiro projeto usando o formulário acima.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-bg-primary dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 
                        bg-bg-secondary border-b border-black/5 dark:border-white/10 text-text-secondary text-sm font-medium">
                    <div className="col-span-1">Thumbnail</div>
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Categoria</div>
                    <div className="col-span-2">Data</div>
                    <div className="col-span-2 text-right">Ações</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-black/5 dark:divide-white/5">
                    <AnimatePresence>
                        {projects.map((project, index) => {
                            const thumbSource = project.mediaType === 'video' ? project.thumbnailUrl : project.mediaUrl;

                            return (
                                <motion.div
                                    key={project.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4
                           hover:bg-black/5 dark:hover:bg-white/5 transition-colors items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    {/* Thumbnail */}
                                    <div className="col-span-1 flex items-center">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-bg-secondary border border-black/5 dark:border-white/10 group">
                                            {thumbSource ? (
                                                <img
                                                    src={thumbSource}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                                    <ImageOff className="w-4 h-4" />
                                                </div>
                                            )}

                                            {/* Type Overlay */}
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {project.mediaType === 'video' ? (
                                                    <Play className="w-4 h-4 text-white drop-shadow-md" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-white drop-shadow-md" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="col-span-4 flex items-center">
                                        <span className="text-text-primary font-medium truncate">
                                            {project.title}
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <div className="col-span-3 flex items-center">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium
                                   bg-accent/10 text-accent border border-accent/20">
                                            {project.category}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-2 flex items-center text-text-secondary text-sm">
                                        {new Intl.DateTimeFormat('pt-BR').format(new Date(project.createdAt))}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-end gap-2">
                                        <motion.button
                                            onClick={() => onEdit(project)}
                                            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 
                               text-text-secondary hover:text-accent transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={loading}
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setDeleteId(project.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 
                               text-text-secondary hover:text-red-500 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={loading}
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="p-8 text-center bg-bg-primary dark:bg-[#1a1a1a]">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 
                          flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        Confirmar exclusão?
                    </h3>
                    <p className="text-text-secondary mb-6">
                        Esta ação não pode ser desfeita. O projeto será removido permanentemente.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setDeleteId(null)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Excluir
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
