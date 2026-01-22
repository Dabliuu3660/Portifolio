import { z } from 'zod';

// Project Form Validation Schema
export const projectFormSchema = z.object({
    title: z
        .string()
        .min(3, 'Título deve ter no mínimo 3 caracteres')
        .max(100, 'Título deve ter no máximo 100 caracteres')
        .trim(),
    category: z.string().min(1, 'Categoria é obrigatória'),
    mediaType: z.enum(['image', 'video'], {
        message: 'Tipo de mídia inválido',
    }),
    mediaUrl: z.string().url('URL de mídia inválida').min(1, 'URL da mídia é obrigatória'),
    thumbnailUrl: z.string().url('URL da thumbnail inválida').optional().or(z.literal('')),
    description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional().or(z.literal('')),
});

// Message Form Validation Schema
export const messageFormSchema = z.object({
    name: z
        .string()
        .min(2, 'Nome deve ter no mínimo 2 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim(),
    email: z.string().email('Email inválido').trim(),
    subject: z
        .string()
        .min(3, 'Assunto deve ter no mínimo 3 caracteres')
        .max(150, 'Assunto deve ter no máximo 150 caracteres')
        .trim(),
    message: z
        .string()
        .min(10, 'Mensagem deve ter no mínimo 10 caracteres')
        .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
        .trim(),
});

// Login Validation Schema
export const loginSchema = z.object({
    email: z.string().email('Email inválido').trim(),
    password: z.string().min(1, 'Senha é obrigatória'),
});

// Category Validation Schema
export const categorySchema = z.object({
    name: z
        .string()
        .min(2, 'Nome da categoria deve ter no mínimo 2 caracteres')
        .max(50, 'Nome da categoria deve ter no máximo 50 caracteres')
        .trim(),
});

// Export types inferred from schemas
export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type MessageFormInput = z.infer<typeof messageFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
