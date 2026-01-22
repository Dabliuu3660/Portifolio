import { Project, ProjectFormData } from '@/types/project';
import { IProjectRepository } from './interfaces/IProjectRepository';
import { projectFormSchema } from '@/schemas/validation';
import { supabase } from '@/lib/supabase';

/**
 * Supabase implementation of Project Repository
 */
export class SupabaseProjectRepository implements IProjectRepository {
    private validateProjectData(data: ProjectFormData): ProjectFormData {
        const result = projectFormSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');
            throw new Error(`Validation failed: ${errors}`);
        }
        return result.data as ProjectFormData;
    }

    private mapToProject(data: any): Project {
        return {
            id: data.id,
            title: data.title,
            category: data.category,
            mediaType: data.media_type,
            mediaUrl: data.media_url,
            thumbnailUrl: data.thumbnail_url || undefined,
            description: data.description || undefined,
            createdAt: new Date(data.created_at),
        };
    }

    async getAll(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

        return (data || []).map((item) => this.mapToProject(item));
    }

    async getById(id: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(`Failed to fetch project: ${error.message}`);
        }

        return this.mapToProject(data);
    }

    async create(data: ProjectFormData): Promise<Project> {
        const validated = this.validateProjectData(data);

        const { data: created, error } = await supabase
            .from('projects')
            .insert({
                id: validated.id, // Use frontend generated ID if present
                title: validated.title,
                category: validated.category,
                media_type: validated.mediaType,
                media_url: validated.mediaUrl,
                thumbnail_url: validated.thumbnailUrl || null,
                description: validated.description || null,
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create project: ${error.message}`);

        return this.mapToProject(created);
    }

    async update(id: string, data: Partial<ProjectFormData>): Promise<Project | null> {
        const existing = await this.getById(id);
        if (!existing) return null;

        const merged: ProjectFormData = {
            title: data.title ?? existing.title,
            category: data.category ?? existing.category,
            mediaType: data.mediaType ?? existing.mediaType,
            mediaUrl: data.mediaUrl ?? existing.mediaUrl,
            thumbnailUrl: data.thumbnailUrl ?? existing.thumbnailUrl,
            description: data.description ?? existing.description,
        };

        const validated = this.validateProjectData(merged);

        const { data: updated, error } = await supabase
            .from('projects')
            .update({
                title: validated.title,
                category: validated.category,
                media_type: validated.mediaType,
                media_url: validated.mediaUrl,
                thumbnail_url: validated.thumbnailUrl || null,
                description: validated.description || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Failed to update project: ${error.message}`);

        return this.mapToProject(updated);
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase.from('projects').delete().eq('id', id);

        if (error) {
            if (error.code === 'PGRST116') return false; // Not found
            throw new Error(`Failed to delete project: ${error.message}`);
        }

        return true;
    }

    async getByCategory(category: string): Promise<Project[]> {
        if (category === 'all') return this.getAll();

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

        return (data || []).map((item) => this.mapToProject(item));
    }

    async searchByTitle(query: string): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .ilike('title', `%${query}%`)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to search projects: ${error.message}`);

        return (data || []).map((item) => this.mapToProject(item));
    }
}
