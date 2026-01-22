import { Project, ProjectFormData } from '@/types/project';
import { IRepository } from './IRepository';

/**
 * Project Repository Interface
 * Extends base repository with project-specific methods
 */
export interface IProjectRepository extends IRepository<Project, ProjectFormData> {
    /**
     * Get projects by category
     * @param category - The category to filter by, or 'all' for no filter
     */
    getByCategory(category: string): Promise<Project[]>;

    /**
     * Search projects by title
     * @param query - The search query
     */
    searchByTitle(query: string): Promise<Project[]>;
}
