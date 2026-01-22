# Análise: Integração de Upload de Arquivos e Supabase Storage

## 🔍 Situação Atual

### Como Funciona Agora

**Método**: **Base64 Data URLs** armazenados no IndexedDB

#### Fluxo Atual:
```
1. Usuário seleciona arquivo (imagem/vídeo)
   ↓
2. FileReader.readAsDataURL() converte para Base64
   ↓
3. String Base64 (data:image/jpeg;base64,...) armazenada como mediaUrl
   ↓
4. Salvo no IndexedDB junto com os metadados do projeto
   ↓
5. Renderizado diretamente no <img src={mediaUrl} />
```

#### Código Atual (useFileUpload.ts):
```typescript
const reader = new FileReader();
reader.onloadend = () => {
    callback(reader.result as string); // "data:image/jpeg;base64,..."
};
reader.readAsDataURL(file);
```

### ⚠️ Problemas com Abordagem Atual

| Problema | Descrição | Impacto |
|----------|-----------|---------|
| **Tamanho** | Base64 aumenta arquivo em ~33% | IndexedDB limitado |
| **Performance** | String gigante no banco | Queries lentas |
| **Limite** | IndexedDB ~50MB por domínio | Poucos projetos |
| **Não escalável** | Base64 em migrations SQL | Impraticável |
| **Sem CDN** | Arquivos não otimizados | Loading lento |

### ✅ Pontos Positivos (Por Enquanto)

- ✅ Funciona offline
- ✅ Sem dependências externas
- ✅ Setup zero
- ✅ Preview instantâneo
- ✅ Bom para protótipo/desenvolvimento

---

## 🎯 Solução: Supabase Storage

### Por Que Supabase Storage?

1. **Armazenamento ilimitado** (plano grátis: 1GB)
2. **CDN global** (serving otimizado)
3. **Transformação de imagens** (resize, compress, format)
4. **URLs públicas** (sem Base64)
5. **Integrado com RLS** (Row Level Security)
6. **Resumable uploads** (arquivos grandes)

### Como Vai Funcionar

```
1. Usuário seleciona arquivo
   ↓
2. Upload para Supabase Storage bucket
   ↓
3. Recebe URL pública (https://xxx.supabase.co/storage/v1/object/public/...)
   ↓
4. Salva apenas a URL no banco de dados
   ↓
5. Renderizado com <img src={publicUrl} />
```

---

## 📁 Estrutura de Storage Proposta

```
Supabase Storage Buckets:
├── portfolio-images/          (Público)
│   ├── projects/
│   │   ├── {project-id}/
│   │   │   └── main.{ext}
│   │   └── ...
│   └── thumbnails/
│       ├── {project-id}/
│       │   └── thumb.{ext}
│       └── ...
│
└── portfolio-videos/          (Público)
    ├── {project-id}/
    │   └── video.{ext}
    └── ...
```

---

## 🔧 Implementação

### 1. Criar Service de Upload

**Arquivo**: `src/services/uploadService.ts`

```typescript
import { supabase } from '@/lib/supabase';

const IMAGES_BUCKET = 'portfolio-images';
const VIDEOS_BUCKET = 'portfolio-videos';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload de imagem para Supabase Storage
 */
export const uploadImage = async (
  file: File,
  folder: 'projects' | 'thumbnails',
  projectId: string
): Promise<UploadResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = folder === 'projects' ? `main.${fileExt}` : `thumb.${fileExt}`;
  const filePath = `${folder}/${projectId}/${fileName}`;

  // Upload para storage
  const { data, error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Sobrescreve se já existir
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
};

/**
 * Upload de vídeo para Supabase Storage
 */
export const uploadVideo = async (
  file: File,
  projectId: string
): Promise<UploadResult> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `video.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(VIDEOS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage
    .from(VIDEOS_BUCKET)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
};

/**
 * Deletar arquivo do storage
 */
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw new Error(`Delete failed: ${error.message}`);
};

/**
 * Gerar URL de transformação de imagem
 * Docs: https://supabase.com/docs/guides/storage/serving/image-transformations
 */
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif';
  }
): string => {
  if (!url.includes('supabase')) return url; // Fallback para URLs não-Supabase

  const params = new URLSearchParams();
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  return `${url}?${params.toString()}`;
};
```

### 2. Atualizar Hook de Upload

**Arquivo**: `src/components/admin/project-form/hooks/useFileUpload.ts`

```typescript
import { useState, useCallback } from 'react';
import { uploadImage, uploadVideo, UploadResult } from '@/services/uploadService';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB para Supabase
const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;

export interface UseFileUploadReturn {
  processFile: (
    file: File,
    callback: (result: string) => void,
    options?: {
      type: 'image' | 'video' | 'thumbnail';
      projectId?: string;
    }
  ) => Promise<void>;
  uploading: boolean;
  progress: number;
  error: string | null;
  clearError: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (
      file: File,
      callback: (result: string) => void,
      options?: {
        type: 'image' | 'video' | 'thumbnail';
        projectId?: string;
      }
    ) => {
      setError(null);
      setProgress(0);

      if (file.size > MAX_FILE_SIZE) {
        setError('Arquivo muito grande! Máximo 50MB.');
        return;
      }

      try {
        setUploading(true);

        if (USE_SUPABASE && options?.projectId) {
          // Upload para Supabase Storage
          let result: UploadResult;

          if (options.type === 'video') {
            result = await uploadVideo(file, options.projectId);
          } else {
            const folder = options.type === 'thumbnail' ? 'thumbnails' : 'projects';
            result = await uploadImage(file, folder, options.projectId);
          }

          setProgress(100);
          callback(result.url);
        } else {
          // Fallback: Base64 (desenvolvimento)
          const reader = new FileReader();
          
          reader.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress((e.loaded / e.total) * 100);
            }
          };

          reader.onloadend = () => {
            callback(reader.result as string);
            setProgress(100);
          };

          reader.onerror = () => {
            setError('Erro ao ler o arquivo. Tente novamente.');
          };

          reader.readAsDataURL(file);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro no upload');
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    processFile,
    uploading,
    progress,
    error,
    clearError,
  };
};
```

### 3. Atualizar Componente de Upload

**Modificar**: `ImageUploadZone.tsx` e `VideoUploadSection.tsx`

```typescript
// Adicionar projectId como prop
interface ImageUploadZoneProps {
  mediaUrl: string;
  onMediaUrlChange: (url: string) => void;
  projectId?: string; // Novo
}

// Atualizar chamadas
const handleFileDrop = (file: File) => {
  processFile(file, onMediaUrlChange, {
    type: 'image',
    projectId: projectId || crypto.randomUUID(), // Gerar ID se não existir
  });
};

// Mostrar progresso
{uploading && (
  <div className="mt-2">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-accent h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-sm text-text-secondary mt-1">{progress}% enviado</p>
  </div>
)}
```

### 4. Setup de Buckets no Supabase

**SQL para executar no Supabase**:

```sql
-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true);

-- Criar bucket para vídeos
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-videos', 'portfolio-videos', true);

-- Policies de storage
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('portfolio-images', 'portfolio-videos'));

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('portfolio-images', 'portfolio-videos')
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('portfolio-images', 'portfolio-videos')
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('portfolio-images', 'portfolio-videos')
  AND auth.role() = 'authenticated'
);
```

---

## 🔄 Migração de Dados Existentes

### Script de Migração

```typescript
// scripts/migrate-files-to-supabase.ts
import { openDB } from '../src/services/indexedDbService';
import { uploadImage } from '../src/services/uploadService';

async function migrateFiles() {
  const db = await openDB();
  const projects = await getAllProjectsFromDB();

  for (const project of projects) {
    if (project.mediaUrl.startsWith('data:')) {
      // Converter Base64 para Blob
      const response = await fetch(project.mediaUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      // Upload para Supabase
      const { url } = await uploadImage(file, 'projects', project.id);

      // Atualizar projeto com nova URL
      await updateProject(project.id, { mediaUrl: url });

      console.log(`✓ Migrated ${project.title}`);
    }
  }
}
```

---

## 📊 Comparação

| Aspecto | Base64 (Atual) | Supabase Storage |
|---------|----------------|------------------|
| **Tamanho** | +33% overhead | Original |
| **Limite** | ~50MB total | 1GB grátis |
| **Performance** | Lento (queries) | Rápido (CDN) |
| **Otimização** | Não | ✅ Auto resize/compress |
| **Offline** | ✅ Funciona | ❌ Requer internet |
| **Escalabilidade** | ❌ Limitado | ✅ Ilimitado |
| **URLs** | Nãocompartilháveis | ✅ Públicas |
| **Custo** | Grátis | Grátis (1GB) |

---

## 🎯 Recomendação

### Fase 1: Manter Base64 (ATUAL) ✅
- Ideal para desenvolvimento
- Zero setup
- Funciona offline
- **Usar agora**

### Fase 2: Migrar para Supabase (QUANDO PRECISAR)
**Quando migrar**:
- [ ] Mais de 20-30 projetos
- [ ] Arquivos maiores que 5MB
- [ ] Performance se torna problema
- [ ] Deploy em produção
- [ ] Múltiplos usuários

**Tempo estimado**: 2-3 horas

---

## ✅ Checklist de Migração

Quando decidir migrar para Supabase Storage:

- [ ] Criar buckets no Supabase Dashboard
- [ ] Executar SQL policies
- [ ] Criar `src/services/uploadService.ts`
- [ ] Atualizar `useFileUpload` hook
- [ ] Atualizar componentes de upload
- [ ] Testar upload de imagem
- [ ] Testar upload de vídeo
- [ ] Testar upload de thumbnail
- [ ] Migrar dados existentes (script)
- [ ] Validar URLs públicas
- [ ] Testar otimização de imagens
- [ ] Deploy

---

## 🔗 Recursos

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Resumable Uploads](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
