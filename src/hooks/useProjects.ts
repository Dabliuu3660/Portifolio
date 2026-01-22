'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types/project';
import { getProjects as fetchProjects } from '@/services/projectService';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProjects();
            setProjects(data);
        } catch (err) {
            setError('Erro ao carregar projetos');
            console.error('useProjects error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const refreshProjects = useCallback(() => {
        loadProjects();
    }, [loadProjects]);

    return {
        projects,
        loading,
        error,
        refreshProjects,
    };
};
