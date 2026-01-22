import { describe, it, expect, beforeEach } from 'vitest';
import { projectFormSchema, messageFormSchema, loginSchema } from '@/schemas/validation';

describe('Validation Schemas', () => {
    describe('projectFormSchema', () => {
        it('should validate a correct project', () => {
            const validProject = {
                title: 'Test Project',
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'https://example.com/image.jpg',
                description: 'A test description',
            };

            const result = projectFormSchema.safeParse(validProject);
            expect(result.success).toBe(true);
        });

        it('should reject title too short', () => {
            const invalidProject = {
                title: 'Ab',
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'https://example.com/image.jpg',
            };

            const result = projectFormSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('mínimo 3 caracteres');
            }
        });

        it('should reject invalid URL', () => {
            const invalidProject = {
                title: 'Test Project',
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'not-a-url',
            };

            const result = projectFormSchema.safeParse(invalidProject);
            expect(result.success).toBe(false);
        });

        it('should accept optional description', () => {
            const validProject = {
                title: 'Test Project',
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'https://example.com/image.jpg',
            };

            const result = projectFormSchema.safeParse(validProject);
            expect(result.success).toBe(true);
        });

        it('should trim whitespace from title', () => {
            const project = {
                title: '  Test Project  ',
                category: 'Banner',
                mediaType: 'image' as const,
                mediaUrl: 'https://example.com/image.jpg',
            };

            const result = projectFormSchema.safeParse(project);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.title).toBe('Test Project');
            }
        });
    });

    describe('messageFormSchema', () => {
        it('should validate a correct message', () => {
            const validMessage = {
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Test Subject',
                message: 'This is a test message with enough characters',
            };

            const result = messageFormSchema.safeParse(validMessage);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidMessage = {
                name: 'John Doe',
                email: 'invalid-email',
                subject: 'Test',
                message: 'Test message',
            };

            const result = messageFormSchema.safeParse(invalidMessage);
            expect(result.success).toBe(false);
        });

        it('should reject message too short', () => {
            const invalidMessage = {
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Test',
                message: 'Short',
            };

            const result = messageFormSchema.safeParse(invalidMessage);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toContain('mínimo 10 caracteres');
            }
        });
    });

    describe('loginSchema', () => {
        it('should validate correct credentials', () => {
            const validLogin = {
                email: 'admin@example.com',
                password: 'password123',
            };

            const result = loginSchema.safeParse(validLogin);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidLogin = {
                email: 'not-an-email',
                password: 'password123',
            };

            const result = loginSchema.safeParse(invalidLogin);
            expect(result.success).toBe(false);
        });

        it('should reject empty password', () => {
            const invalidLogin = {
                email: 'admin@example.com',
                password: '',
            };

            const result = loginSchema.safeParse(invalidLogin);
            expect(result.success).toBe(false);
        });
    });
});
