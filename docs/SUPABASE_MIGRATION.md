# Guia de Migração para Supabase

## Visão Geral

Este guia detalha como migrar de IndexedDB/localStorage para Supabase, aproveitando a arquitetura de Repository Pattern já implementada.

## Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase
3. Credenciais (URL e anon key)

## Passo 1: Instalar Dependências

```bash
npm install @supabase/supabase-js
```

## Passo 2: Configurar Variáveis de Ambiente

Adicionar ao `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## Passo 3: Criar Schema no Supabase

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name) VALUES
  ('Banner'),
  ('Story Estaticos'),
  ('Anuncio para ecommerce'),
  ('Arte para campanha'),
  ('Arte para feed'),
  ('Motion Video'),
  ('Video editado para campanha'),
  ('Landing Page'),
  ('Videos editados');

-- Habilitar Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies para projects (leitura pública, escrita autenticada)
CREATE POLICY "Projects são visíveis publicamente"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Apenas autenticados podem criar projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apenas autenticados podem atualizar projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas autenticados podem deletar projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policies para messages (envio público, leitura autenticada)
CREATE POLICY "Qualquer um pode enviar mensagem"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Apenas autenticados podem ler mensagens"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policies para categories (leitura pública)
CREATE POLICY "Categories são visíveis publicamente"
  ON categories FOR SELECT
  USING (true);

-- Índices para performance
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

## Passo 4: Criar Cliente Supabase

Criar arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Para operações admin
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

## Passo 5: Implementar Supabase Repositories

Criar `src/repositories/SupabaseProjectRepository.ts`:

```typescript
import { Project, ProjectFormData } from '@/types/project';
import { IProjectRepository } from './interfaces/IProjectRepository';
import { projectFormSchema } from '@/schemas/validation';
import { supabase } from '@/lib/supabase';

export class SupabaseProjectRepository implements IProjectRepository {
  private validateProjectData(data: ProjectFormData): ProjectFormData {
    const result = projectFormSchema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      throw new Error(`Validation failed: ${errors}`);
    }
    return result.data as ProjectFormData;
  }

  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

    return (data || []).map(this.mapToProject);
  }

  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return this.mapToProject(data);
  }

  async create(data: ProjectFormData): Promise<Project> {
    const validated = this.validateProjectData(data);

    const { data: created, error } = await supabase
      .from('projects')
      .insert({
        title: validated.title,
        category: validated.category,
        media_type: validated.mediaType,
        media_url: validated.mediaUrl,
        thumbnail_url: validated.thumbnailUrl || null,
        description: validated.description || null,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create project: ${error.message}`);

    return this.mapToProject(created);
  }

  async update(id: string, data: Partial<ProjectFormData>): Promise<Project | null> {
    const existing = await this.getById(id);
    if (!existing) return null;

    const merged: ProjectFormData = {
      title: data.title ?? existing.title,
      category: data.category ?? existing.category,
      mediaType: data.mediaType ?? existing.mediaType,
      mediaUrl: data.mediaUrl ?? existing.mediaUrl,
      thumbnailUrl: data.thumbnailUrl ?? existing.thumbnailUrl,
      description: data.description ?? existing.description,
    };

    const validated = this.validateProjectData(merged);

    const { data: updated, error } = await supabase
      .from('projects')
      .update({
        title: validated.title,
        category: validated.category,
        media_type: validated.mediaType,
        media_url: validated.mediaUrl,
        thumbnail_url: validated.thumbnailUrl || null,
        description: validated.description || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update project: ${error.message}`);

    return this.mapToProject(updated);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete project: ${error.message}`);

    return true;
  }

  async getByCategory(category: string): Promise<Project[]> {
    if (category === 'all') return this.getAll();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

    return (data || []).map(this.mapToProject);
  }

  async searchByTitle(query: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .ilike('title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to search projects: ${error.message}`);

    return (data || []).map(this.mapToProject);
  }

  private mapToProject(data: any): Project {
    return {
      id: data.id,
      title: data.title,
      category: data.category,
      mediaType: data.media_type,
      mediaUrl: data.media_url,
      thumbnailUrl: data.thumbnail_url,
      description: data.description,
      createdAt: new Date(data.created_at),
    };
  }
}
```

## Passo 6: Atualizar Factory

Modificar `src/repositories/index.ts`:

```typescript
import { IndexedDBProjectRepository } from './IndexedDBProjectRepository';
import { SupabaseProjectRepository } from './SupabaseProjectRepository';
import { IProjectRepository } from './interfaces/IProjectRepository';

// Detectar qual repositório usar baseado em variáveis de ambiente
const USE_SUPABASE = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let projectRepository: IProjectRepository | null = null;

export const getProjectRepository = (): IProjectRepository => {
  if (!projectRepository) {
    projectRepository = USE_SUPABASE
      ? new SupabaseProjectRepository()
      : new IndexedDBProjectRepository();
  }
  return projectRepository;
};
```

## Passo 7: Migrar Dados Existentes (Opcional)

Script para migrar dados do IndexedDB para Supabase:

```typescript
// scripts/migrate-to-supabase.ts
import { openDB } from '../src/services/indexedDbService';
import { supabase } from '../src/lib/supabase';

async function migrateProjects() {
  const db = await openDB();
  const transaction = db.transaction(['projects'], 'readonly');
  const store = transaction.objectStore('projects');
  const request = store.getAll();

  request.onsuccess = async () => {
    const projects = request.result;
    
    for (const project of projects) {
      await supabase.from('projects').insert({
        id: project.id,
        title: project.title,
        category: project.category,
        media_type: project.mediaType,
        media_url: project.mediaUrl,
        thumbnail_url: project.thumbnailUrl,
        description: project.description,
        created_at: project.createdAt,
      });
    }

    console.log(`Migrated ${projects.length} projects`);
  };
}

migrateProjects();
```

## Passo 8: Testar

1. Adicionar variáveis de ambiente
2. Reiniciar aplicação
3. Verificar se dados estão sendo salvos no Supabase
4. Validar Row Level Security

## Rollback

Se necessário voltar para IndexedDB:
1. Remover variáveis de ambiente do Supabase
2. Reiniciar aplicação
3. Factory automaticamente usa IndexedDB

## Benefícios da Migração

- ✅ Dados persistentes entre dispositivos
- ✅ Backup automático
- ✅ Queries mais eficientes
- ✅ Row Level Security
- ✅ Real-time subscriptions (futuro)
- ✅ Autenticação integrada (futuro)

## Próximos Passos Após Migração

1. Implementar autenticação real com Supabase Auth
2. Configurar Storage para uploads de mídia
3. Implementar Real-time subscriptions
4. Adicionar funcionalidades colaborativas
