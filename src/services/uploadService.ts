import { supabase } from '@/lib/supabase';

const IMAGES_BUCKET = 'portfolio-images';
const VIDEOS_BUCKET = 'portfolio-videos';

export interface UploadResult {
    url: string;
    path: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

/**
 * Upload de imagem para Supabase Storage
 */
export const uploadImage = async (
    file: File,
    folder: 'projects' | 'thumbnails',
    projectId: string,
    onProgress?: (progress: UploadProgress) => void
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
    const { data: urlData } = supabase.storage
        .from(IMAGES_BUCKET)
        .getPublicUrl(filePath);

    return {
        url: urlData.publicUrl,
        path: filePath,
    };
};

/**
 * Upload de vídeo para Supabase Storage
 */
export const uploadVideo = async (
    file: File,
    projectId: string,
    onProgress?: (progress: UploadProgress) => void
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

    const { data: urlData } = supabase.storage
        .from(VIDEOS_BUCKET)
        .getPublicUrl(filePath);

    return {
        url: urlData.publicUrl,
        path: filePath,
    };
};

/**
 * Deletar arquivo do storage
 */
export const deleteFile = async (bucket: string, path: string): Promise<void> => {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw new Error(`Delete failed: ${error.message}`);
};

/**
 * Deletar arquivos de um projeto
 */
export const deleteProjectFiles = async (projectId: string): Promise<void> => {
    // Deletar imagem principal
    await deleteFile(IMAGES_BUCKET, `projects/${projectId}/main.jpg`).catch(() => { });
    await deleteFile(IMAGES_BUCKET, `projects/${projectId}/main.png`).catch(() => { });
    await deleteFile(IMAGES_BUCKET, `projects/${projectId}/main.webp`).catch(() => { });

    // Deletar thumbnail
    await deleteFile(IMAGES_BUCKET, `thumbnails/${projectId}/thumb.jpg`).catch(() => { });
    await deleteFile(IMAGES_BUCKET, `thumbnails/${projectId}/thumb.png`).catch(() => { });
    await deleteFile(IMAGES_BUCKET, `thumbnails/${projectId}/thumb.webp`).catch(() => { });

    // Deletar vídeo
    await deleteFile(VIDEOS_BUCKET, `${projectId}/video.mp4`).catch(() => { });
    await deleteFile(VIDEOS_BUCKET, `${projectId}/video.webm`).catch(() => { });
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
    if (!url.includes('supabase')) return url; // Fallback

    const params = new URLSearchParams();
    if (options.width) params.append('width', options.width.toString());
    if (options.height) params.append('height', options.height.toString());
    if (options.quality) params.append('quality', options.quality.toString());
    if (options.format) params.append('format', options.format);

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
};

/**
 * Check if Supabase Storage is available
 */
export const isSupabaseStorageAvailable = (): boolean => {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
};
