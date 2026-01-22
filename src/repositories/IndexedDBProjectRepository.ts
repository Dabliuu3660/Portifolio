import { Project, ProjectFormData } from '@/types/project';
import { IProjectRepository } from './interfaces/IProjectRepository';
import { projectFormSchema } from '@/schemas/validation';
import {
    openDB,
    getAllProjectsFromDB,
    saveProjectToDB,
    deleteProjectFromDB,
    getProjectFromDB,
} from '@/services/indexedDbService';

/**
 * IndexedDB implementation of Project Repository
 * Implements the repository pattern with client-side storage
 */
export class IndexedDBProjectRepository implements IProjectRepository {
    private readonly storeName = 'projects';

    /**
     * Validate project data using Zod schema
     * @throws {Error} if validation fails
     */
    private validateProjectData(data: ProjectFormData): ProjectFormData {
        const result = projectFormSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
            throw new Error(`Validation failed: ${errors}`);
        }
        return result.data as ProjectFormData;
    }

    async getAll(): Promise<Project[]> {
        const projects = await getAllProjectsFromDB<Project>();
        // Sort by createdAt desc (newest first)
        return projects.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    }

    async getById(id: string): Promise<Project | null> {
        const project = await getProjectFromDB<Project>(id);
        return project || null;
    }

    async create(data: ProjectFormData): Promise<Project> {
        // Validate data
        const validatedData = this.validateProjectData(data);

        const newProject: Project = {
            ...validatedData,
            id: validatedData.id || crypto.randomUUID(),
            createdAt: new Date(),
        };

        await saveProjectToDB(newProject);
        return newProject;
    }

    async update(id: string, data: Partial<ProjectFormData>): Promise<Project | null> {
        const existing = await this.getById(id);
        if (!existing) return null;

        // Merge and validate
        const mergedData: ProjectFormData = {
            title: data.title ?? existing.title,
            category: data.category ?? existing.category,
            mediaType: data.mediaType ?? existing.mediaType,
            mediaUrl: data.mediaUrl ?? existing.mediaUrl,
            thumbnailUrl: data.thumbnailUrl ?? existing.thumbnailUrl,
            description: data.description ?? existing.description,
        };

        const validatedData = this.validateProjectData(mergedData);

        const updated: Project = {
            ...existing,
            ...validatedData,
        };

        await saveProjectToDB(updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const existing = await this.getById(id);
        if (!existing) return false;

        await deleteProjectFromDB(id);
        return true;
    }

    async getByCategory(category: string): Promise<Project[]> {
        const allProjects = await this.getAll();

        if (category === 'all') return allProjects;

        return allProjects.filter((p) => p.category === category);
    }

    async searchByTitle(query: string): Promise<Project[]> {
        const allProjects = await this.getAll();
        const lowerQuery = query.toLowerCase();

        return allProjects.filter((p) => p.title.toLowerCase().includes(lowerQuery));
    }
}
