'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCategoryRepository } from '@/repositories';
import { Category } from '@/types/category';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            const repository = getCategoryRepository();
            const data = await repository.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();

        const handleUpdate = () => loadCategories();
        window.addEventListener('category-update', handleUpdate);

        return () => {
            window.removeEventListener('category-update', handleUpdate);
        };
    }, [loadCategories]);

    const addCategory = async (name: string) => {
        try {
            const repository = getCategoryRepository();
            // Check existence
            const existing = await repository.getByName(name);
            if (existing) return false;

            await repository.create({ name });
            await loadCategories();
            return true;
        } catch (error) {
            console.error('Failed to add category', error);
            return false;
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const repository = getCategoryRepository();
            const success = await repository.delete(id);
            if (success) await loadCategories();
            return success;
        } catch (error) {
            console.error('Failed to delete category', error);
            return false;
        }
    };

    const reorderCategories = async (newOrder: Category[]) => {
        // Optimistic update
        setCategories(newOrder);
        try {
            const repository = getCategoryRepository();
            await repository.reorder(newOrder);
        } catch (error) {
            console.error('Failed to reorder categories', error);
            await loadCategories(); // Revert on error
        }
    };

    return {
        categories,
        categoryNames: categories.map(c => c.name),
        loading,
        addCategory,
        deleteCategory,
        reorderCategories,
        refreshCategories: loadCategories,
    };
};
