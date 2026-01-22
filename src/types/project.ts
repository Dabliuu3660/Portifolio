// Project data types - ready for Supabase integration

export type ProjectCategory = string;

export type MediaType = 'image' | 'video';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  description: string;
  createdAt: Date;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  category: ProjectCategory;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  description: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Banner',
  'Story Estaticos',
  'Anuncio para ecommerce',
  'Arte para campanha',
  'Arte para feed',
  'Motion Video',
  'Video editado para campanha',
  'Landing Page',
  'Videos editados',
];
