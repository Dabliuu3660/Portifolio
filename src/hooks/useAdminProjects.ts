'use client';

import { useState, useCallback } from 'react';
import { Project, ProjectFormData } from '@/types/project';
import {
    createProject,
    updateProject,
    deleteProject,
} from '@/services/projectService';

export const useAdminProjects = (onSuccess?: () => void) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = useCallback(
        async (data: ProjectFormData): Promise<Project | null> => {
            try {
                setLoading(true);
                setError(null);
                const project = await createProject(data);
                onSuccess?.();
                return project;
            } catch (err) {
                setError('Erro ao criar projeto');
                console.error('Create project error:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [onSuccess]
    );

    const handleUpdate = useCallback(
        async (
            id: string,
            data: Partial<ProjectFormData>
        ): Promise<Project | null> => {
            try {
                setLoading(true);
                setError(null);
                const project = await updateProject(id, data);
                onSuccess?.();
                return project;
            } catch (err) {
                setError('Erro ao atualizar projeto');
                console.error('Update project error:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [onSuccess]
    );

    const handleDelete = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                setLoading(true);
                setError(null);
                const success = await deleteProject(id);
                if (success) {
                    onSuccess?.();
                }
                return success;
            } catch (err) {
                setError('Erro ao deletar projeto');
                console.error('Delete project error:', err);
                return false;
            } finally {
                setLoading(false);
            }
        },
        [onSuccess]
    );

    return {
        loading,
        error,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
};
