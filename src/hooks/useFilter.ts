'use client';

import { useState, useCallback, useMemo } from 'react';
import { Project, ProjectCategory } from '@/types/project';

export type FilterValue = ProjectCategory | 'all';

export const useFilter = (projects: Project[]) => {
    const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

    const setFilter = useCallback((filter: FilterValue) => {
        setActiveFilter(filter);
    }, []);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'all') return projects;
        return projects.filter((p) => p.category === activeFilter);
    }, [projects, activeFilter]);

    return {
        activeFilter,
        setFilter,
        filteredProjects,
    };
};
