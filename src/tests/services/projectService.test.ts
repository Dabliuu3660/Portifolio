import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCategories, addCategory, deleteCategory } from '@/services/projectService';
import { PROJECT_CATEGORIES } from '@/types/project';

describe('projectService - Category Management', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('getCategories', () => {
        it('should return default categories on first call', () => {
            const categories = getCategories();
            expect(categories).toEqual(PROJECT_CATEGORIES);
        });

        it('should return stored categories from localStorage', () => {
            const customCategories = ['Custom 1', 'Custom 2'];
            localStorage.setItem('portfolio_categories', JSON.stringify(customCategories));

            const categories = getCategories();
            expect(categories).toEqual(customCategories);
        });
    });

    describe('addCategory', () => {
        it('should add a new category', () => {
            const newCategory = 'My New Category';
            const result = addCategory(newCategory);

            expect(result).toBe(true);

            const categories = getCategories();
            expect(categories).toContain(newCategory);
        });

        it('should not add duplicate category', () => {
            const category = 'Duplicate Category';
            addCategory(category);
            const result = addCategory(category);

            expect(result).toBe(false);

            const categories = getCategories();
            const count = categories.filter((c: string) => c === category).length;
            expect(count).toBe(1);
        });

        it('should dispatch category-update event', () => {
            const eventSpy = vi.fn();
            window.addEventListener('category-update', eventSpy);

            addCategory('Test Category');

            expect(eventSpy).toHaveBeenCalled();

            window.removeEventListener('category-update', eventSpy);
        });
    });

    describe('deleteCategory', () => {
        it('should delete existing category', () => {
            const categoryToDelete = PROJECT_CATEGORIES[0];
            const result = deleteCategory(categoryToDelete);

            expect(result).toBe(true);

            const categories = getCategories();
            expect(categories).not.toContain(categoryToDelete);
        });

        it('should dispatch category-update event on delete', () => {
            const eventSpy = vi.fn();
            window.addEventListener('category-update', eventSpy);

            deleteCategory(PROJECT_CATEGORIES[0]);

            expect(eventSpy).toHaveBeenCalled();

            window.removeEventListener('category-update', eventSpy);
        });
    });
});
