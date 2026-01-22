'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, List, Tag } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useAdminProjects } from '@/hooks/useAdminProjects';
import { ProjectForm } from '@/components/admin/project-form/ProjectForm';
import { ProjectTable } from '@/components/admin/ProjectTable';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { Button } from '@/components/ui/Button';
import { Project, ProjectFormData } from '@/types/project';

type Tab = 'projects' | 'categories';

interface PortfolioViewProps {
    initialView?: 'list' | 'add';
}

export const PortfolioView = ({ initialView = 'list' }: PortfolioViewProps) => {
    const { projects, loading: projectsLoading, refreshProjects } = useProjects();
    const { loading: crudLoading, handleCreate, handleUpdate, handleDelete } = useAdminProjects(refreshProjects);

    const [tab, setTab] = useState<Tab>('projects');
    const [view, setView] = useState<'list' | 'add' | 'edit'>(initialView);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Sync view if prop changes (e.g. sidebar click)
    useEffect(() => {
        if (initialView) setView(initialView);
    }, [initialView]);

    const handleSubmitNew = async (data: ProjectFormData) => {
        await handleCreate(data);
        setView('list');
    };

    const handleSubmitEdit = async (data: ProjectFormData) => {
        if (editingProject) {
            await handleUpdate(editingProject.id, data);
            setEditingProject(null);
            setView('list');
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setView('edit');
    };

    return (
        <div className="space-y-6">
            {/* Context Navigation (Sub-tabs) */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setTab('projects')}
                    className={`pb-1 px-2 font-medium transition-colors ${tab === 'projects' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    Projetos
                </button>
                <button
                    onClick={() => setTab('categories')}
                    className={`pb-1 px-2 font-medium transition-colors ${tab === 'categories' ? 'text-accent border-b-2 border-accent' : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    Categorias
                </button>
            </div>

            {tab === 'categories' ? (
                <CategoryManager />
            ) : (
                <>
                    {/* Projects Toolbar */}
                    {view === 'list' && (
                        <div className="flex justify-end mb-4">
                            <Button onClick={() => setView('add')} className="gap-2">
                                <Plus className="w-4 h-4" /> Novo Projeto
                            </Button>
                        </div>
                    )}

                    {view === 'list' && (
                        <ProjectTable
                            projects={projects}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            loading={projectsLoading || crudLoading}
                        />
                    )}

                    {view === 'add' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-text-primary">Novo Projeto</h3>
                                <Button variant="secondary" onClick={() => setView('list')}>
                                    <List className="w-4 h-4 mr-2" /> Voltar para Lista
                                </Button>
                            </div>
                            <ProjectForm onSubmit={handleSubmitNew} loading={crudLoading} />
                        </div>
                    )}

                    {view === 'edit' && editingProject && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-text-primary">Editando: {editingProject.title}</h3>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setView('list');
                                        setEditingProject(null);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                            <ProjectForm
                                onSubmit={handleSubmitEdit}
                                loading={crudLoading}
                                initialData={editingProject}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
