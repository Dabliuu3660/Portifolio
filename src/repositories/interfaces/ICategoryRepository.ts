import { Category } from '@/types/category';
import { IRepository } from './IRepository';

export interface ICategoryRepository extends IRepository<Category, Omit<Category, 'id' | 'createdAt' | 'orderIndex'>> {
    /**
     * Reorder categories by updating their orderIndex
     * @param categories Ordered list of categories with new indices implied by array order
     */
    reorder(categories: Category[]): Promise<void>;

    /**
     * Get category by name
     */
    getByName(name: string): Promise<Category | null>;
}
