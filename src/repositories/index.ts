import { IndexedDBProjectRepository } from './IndexedDBProjectRepository';
import { LocalStorageMessageRepository } from './LocalStorageMessageRepository';
import { LocalStorageCategoryRepository } from './LocalStorageCategoryRepository';
import { SupabaseProjectRepository } from './SupabaseProjectRepository';
import { SupabaseMessageRepository } from './SupabaseMessageRepository';
import { SupabaseCategoryRepository } from './SupabaseCategoryRepository';
import { IProjectRepository } from './interfaces/IProjectRepository';
import { IMessageRepository } from './interfaces/IMessageRepository';
import { ICategoryRepository } from './interfaces/ICategoryRepository';

// Singleton instances
let projectRepository: IProjectRepository | null = null;
let messageRepository: IMessageRepository | null = null;
let categoryRepository: ICategoryRepository | null = null;

const isSupabaseConfigured = () => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

/**
 * Get the Project Repository instance
 * Returns a singleton instance of the repository
 */
export const getProjectRepository = (): IProjectRepository => {
    if (!projectRepository) {
        if (isSupabaseConfigured()) {
            projectRepository = new SupabaseProjectRepository();
            console.log('✅ Using Supabase Project Repository');
        } else {
            projectRepository = new IndexedDBProjectRepository();
            console.log('⚠️ Using IndexedDB Project Repository (Local)');
        }
    }
    return projectRepository;
};

/**
 * Get the Message Repository instance
 * Returns a singleton instance of the repository
 */
export const getMessageRepository = (): IMessageRepository => {
    if (!messageRepository) {
        if (isSupabaseConfigured()) {
            messageRepository = new SupabaseMessageRepository();
            console.log('✅ Using Supabase Message Repository');
        } else {
            messageRepository = new LocalStorageMessageRepository();
            console.log('⚠️ Using LocalStorage Message Repository (Local)');
        }
    }
    return messageRepository;
};

/**
 * Get the Category Repository instance
 */
export const getCategoryRepository = (): ICategoryRepository => {
    if (!categoryRepository) {
        if (isSupabaseConfigured()) {
            categoryRepository = new SupabaseCategoryRepository();
            console.log('✅ Using Supabase Category Repository');
        } else {
            categoryRepository = new LocalStorageCategoryRepository();
            console.log('⚠️ Using LocalStorage Category Repository (Local)');
        }
    }
    return categoryRepository;
};

/**
 * Reset all repositories (useful for testing)
 */
export const resetRepositories = (): void => {
    projectRepository = null;
    messageRepository = null;
    categoryRepository = null;
};

export type { IProjectRepository } from './interfaces/IProjectRepository';
export type { IMessageRepository } from './interfaces/IMessageRepository';
export type { ICategoryRepository } from './interfaces/ICategoryRepository';
