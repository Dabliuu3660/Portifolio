// Project service - refactored to use Repository Pattern
// This service now delegates to the repository for data operations

import { Project, ProjectFormData, ProjectCategory } from '@/types/project';
import { getProjectRepository } from '@/repositories';

const INITIALIZED_KEY = 'portfolio_db_initialized';

// Sample mock projects for initial seeding
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Banner Black Friday 2024',
        category: 'Banner',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&fit=crop',
        description: 'Banner promocional para campanha de Black Friday com foco em conversão.',
        createdAt: new Date('2024-11-20'),
    },
    {
        id: '2',
        title: 'Story Lançamento Produto',
        category: 'Story Estaticos',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop',
        description: 'Story estático para Instagram destacando novo produto.',
        createdAt: new Date('2024-10-15'),
    },
    {
        id: '3',
        title: 'Motion Video Institucional',
        category: 'Motion Video',
        mediaType: 'video',
        mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
        description: 'Vídeo motion para apresentação institucional da marca.',
        createdAt: new Date('2024-09-10'),
    },
];

// Ensure DB is initialized with mocks only once
const ensureInitialized = async () => {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(INITIALIZED_KEY);
    if (!initialized) {
        const repository = getProjectRepository();
        // Seed initial data
        await Promise.all(
            MOCK_PROJECTS.map((project) =>
                repository.create({
                    title: project.title,
                    category: project.category,
                    mediaType: project.mediaType,
                    mediaUrl: project.mediaUrl,
                    thumbnailUrl: project.thumbnailUrl,
                    description: project.description,
                })
            )
        );
        localStorage.setItem(INITIALIZED_KEY, 'true');
    }
};

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
    if (typeof window === 'undefined') return MOCK_PROJECTS;

    await ensureInitialized();
    const repository = getProjectRepository();
    return repository.getAll();
};

// Get projects by category
export const getProjectsByCategory = async (category: ProjectCategory | 'all'): Promise<Project[]> => {
    if (typeof window === 'undefined') return MOCK_PROJECTS;

    await ensureInitialized();
    const repository = getProjectRepository();
    return repository.getByCategory(category);
};

// Get single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
    if (typeof window === 'undefined') return null;

    await ensureInitialized();
    const repository = getProjectRepository();
    return repository.getById(id);
};

// Create new project (with validation)
export const createProject = async (data: ProjectFormData): Promise<Project> => {
    const repository = getProjectRepository();
    return repository.create(data);
};

// Update project (with validation)
export const updateProject = async (id: string, data: Partial<ProjectFormData>): Promise<Project | null> => {
    const repository = getProjectRepository();
    return repository.update(id, data);
};

// Delete project
export const deleteProject = async (id: string): Promise<boolean> => {
    const repository = getProjectRepository();
    return repository.delete(id);
};

// Search projects by title
export const searchProjects = async (query: string): Promise<Project[]> => {
    const repository = getProjectRepository();
    return repository.searchByTitle(query);
};

// Category Management (kept as is - could be moved to separate service)
const CATEGORY_KEY = 'portfolio_categories';
import { PROJECT_CATEGORIES } from '@/types/project';

export const getCategories = (): string[] => {
    if (typeof window === 'undefined') return PROJECT_CATEGORIES;

    const stored = localStorage.getItem(CATEGORY_KEY);
    if (!stored) {
        localStorage.setItem(CATEGORY_KEY, JSON.stringify(PROJECT_CATEGORIES));
        return PROJECT_CATEGORIES;
    }

    return JSON.parse(stored);
};

export const addCategory = (category: string): boolean => {
    const categories = getCategories();
    if (categories.includes(category)) return false;

    const updated = [...categories, category];
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('category-update'));
    }
    return true;
};

export const deleteCategory = (category: string): boolean => {
    const categories = getCategories();
    const updated = categories.filter((c) => c !== category);

    localStorage.setItem(CATEGORY_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('category-update'));
    }
    return true;
};
