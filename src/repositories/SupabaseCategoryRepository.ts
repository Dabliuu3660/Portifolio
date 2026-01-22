import { Category } from '@/types/category';
import { ICategoryRepository } from './interfaces/ICategoryRepository';
import { supabase } from '@/lib/supabase';

export class SupabaseCategoryRepository implements ICategoryRepository {
    private mapToCategory(data: any): Category {
        return {
            id: data.id,
            name: data.name,
            orderIndex: data.order_index,
            createdAt: new Date(data.created_at),
        };
    }

    async getAll(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw new Error(`Error fetching categories: ${error.message}`);
        return (data || []).map(this.mapToCategory);
    }

    async getById(id: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return this.mapToCategory(data);
    }

    async getByName(name: string): Promise<Category | null> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('name', name)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return this.mapToCategory(data);
    }

    async create(data: { name: string }): Promise<Category> {
        // Get max order index
        const { data: maxOrder } = await supabase
            .from('categories')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)
            .single();

        const nextOrder = (maxOrder?.order_index ?? -1) + 1;

        const { data: created, error } = await supabase
            .from('categories')
            .insert({
                name: data.name,
                order_index: nextOrder,
            })
            .select()
            .single();

        if (error) throw new Error(`Error creating category: ${error.message}`);
        return this.mapToCategory(created);
    }

    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        const updates: any = {};
        if (data.name) updates.name = data.name;
        if (data.orderIndex !== undefined) updates.order_index = data.orderIndex;

        const { data: updated, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Error updating category: ${error.message}`);
        return this.mapToCategory(updated);
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return true;
    }

    async reorder(categories: Category[]): Promise<void> {
        const updates = categories.map((cat, index) => ({
            id: cat.id,
            name: cat.name,
            order_index: index,
        }));

        const { error } = await supabase.from('categories').upsert(updates);
        if (error) throw new Error(`Error reordering categories: ${error.message}`);
    }
}
