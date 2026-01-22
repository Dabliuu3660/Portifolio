import { Category } from '@/types/category';
import { ICategoryRepository } from './interfaces/ICategoryRepository';

const KEY = 'portfolio_categories';
// Default categories if empty
const DEFAULTS = [
    'Banner', 'Story Estaticos', 'Anuncio para ecommerce',
    'Arte para campanha', 'Arte para feed', 'Motion Video',
    'Video editado para campanha', 'Landing Page', 'Videos editados'
];

export class LocalStorageCategoryRepository implements ICategoryRepository {
    private getStored(): Category[] {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(KEY);

        // Handle migration from string[] to Category[]
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
                    // Convert old string[] format
                    const converted = parsed.map((name, i) => ({
                        id: crypto.randomUUID(),
                        name,
                        orderIndex: i,
                        createdAt: new Date()
                    }));
                    this.save(converted);
                    return converted;
                }
                // Assume new format if not string array
                return parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) }));
            } catch (e) {
                console.error('Error parsing categories', e);
            }
        }

        // Initialize defaults
        const initial = DEFAULTS.map((name, i) => ({
            id: crypto.randomUUID(),
            name,
            orderIndex: i,
            createdAt: new Date()
        }));
        this.save(initial);
        return initial;
    }

    private save(categories: Category[]) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(KEY, JSON.stringify(categories));
    }

    async getAll(): Promise<Category[]> {
        return this.getStored().sort((a, b) => a.orderIndex - b.orderIndex);
    }

    async getById(id: string): Promise<Category | null> {
        return this.getStored().find(c => c.id === id) || null;
    }

    async getByName(name: string): Promise<Category | null> {
        return this.getStored().find(c => c.name === name) || null;
    }

    async create(data: { name: string }): Promise<Category> {
        const categories = this.getStored();
        const maxOrder = Math.max(...categories.map(c => c.orderIndex), -1);

        const newCat: Category = {
            id: crypto.randomUUID(),
            name: data.name,
            orderIndex: maxOrder + 1,
            createdAt: new Date()
        };

        this.save([...categories, newCat]);
        return newCat;
    }

    async update(id: string, data: Partial<Category>): Promise<Category | null> {
        const categories = this.getStored();
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) return null;

        const updated = { ...categories[index], ...data };
        categories[index] = updated;
        this.save(categories);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const categories = this.getStored();
        const filtered = categories.filter(c => c.id !== id);
        if (filtered.length === categories.length) return false;

        this.save(filtered);
        return true;
    }

    async reorder(categories: Category[]): Promise<void> {
        // Update orderIndices based on array position
        const updated = categories.map((cat, index) => ({
            ...cat,
            orderIndex: index
        }));
        this.save(updated);
    }
}
