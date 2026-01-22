import { describe, it, expect, beforeEach } from 'vitest';
import { IndexedDBProjectRepository } from '@/repositories/IndexedDBProjectRepository';
import { ProjectFormData } from '@/types/project';

describe('IndexedDBProjectRepository', () => {
    let repository: IndexedDBProjectRepository;

    beforeEach(() => {
        repository = new IndexedDBProjectRepository();
        localStorage.clear();
    });

    describe('create', () => {
        it('should create a valid project', async () => {
            const projectData: ProjectFormData = {
                title: 'Test Project',
                category: 'Banner',
                mediaType: 'image',
                mediaUrl: 'https://example.com/image.jpg',
                description: 'Test description',
            };

            const created = await repository.create(projectData);

            expect(created).toBeDefined();
            expect(created.id).toBeDefined();
            expect(created.title).toBe('Test Project');
            expect(created.createdAt).toBeInstanceOf(Date);
        });

        it('should throw validation error for invalid data', async () => {
            const invalidData = {
                title: 'Ab', // Too short
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'not-a-url', // Invalid URL
            };

            await expect(repository.create(invalidData as any)).rejects.toThrow('Validation failed');
        });

        it('should trim whitespace from title', async () => {
            const projectData: ProjectFormData = {
                title: '  Test Project  ',
                category: 'Banner',
                mediaType: 'image',
                mediaUrl: 'https://example.com/image.jpg',
                description: '',
            };

            const created = await repository.create(projectData);
            expect(created.title).toBe('Test Project');
        });
    });

    describe('getByCategory', () => {
        beforeEach(async () => {
            // Create test projects
            await repository.create({
                title: 'Banner 1',
                category: 'Banner',
                mediaType: 'image',
                mediaUrl: 'https://example.com/1.jpg',
                description: '',
            });

            await repository.create({
                title: 'Story 1',
                category: 'Story Estaticos',
                mediaType: 'image',
                mediaUrl: 'https://example.com/2.jpg',
                description: '',
            });
        });

        it('should filter projects by category', async () => {
            const banners = await repository.getByCategory('Banner');
            expect(banners).toHaveLength(1);
            expect(banners[0].category).toBe('Banner');
        });

        it('should return all projects for "all" category', async () => {
            const allProjects = await repository.getByCategory('all');
            expect(allProjects.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('searchByTitle', () => {
        beforeEach(async () => {
            await repository.create({
                title: 'Black Friday Banner',
                category: 'Banner',
                mediaType: 'image',
                mediaUrl: 'https://example.com/1.jpg',
                description: '',
            });

            await repository.create({
                title: 'Summer Sale Story',
                category: 'Story Estaticos',
                mediaType: 'image',
                mediaUrl: 'https://example.com/2.jpg',
                description: '',
            });
        });

        it('should search projects by title (case-insensitive)', async () => {
            const results = await repository.searchByTitle('black');
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].title.toLowerCase()).toContain('black');
        });

        it('should return empty array for no matches', async () => {
            const results = await repository.searchByTitle('nonexistent');
            expect(results).toHaveLength(0);
        });
    });
});
