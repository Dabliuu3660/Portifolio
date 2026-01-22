import { useState, useCallback } from 'react';
import {
    uploadImage,
    uploadVideo,
    isSupabaseStorageAvailable,
    UploadResult,
} from '@/services/uploadService';

const MAX_FILE_SIZE_SUPABASE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE_BASE64 = 10 * 1024 * 1024; // 10MB

export interface UseFileUploadReturn {
    processFile: (
        file: File,
        callback: (result: string) => void,
        options?: {
            type?: 'image' | 'video' | 'thumbnail';
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

    const useSupabase = isSupabaseStorageAvailable();

    const processFile = useCallback(
        async (
            file: File,
            callback: (result: string) => void,
            options?: {
                type?: 'image' | 'video' | 'thumbnail';
                projectId?: string;
            }
        ) => {
            setError(null);
            setProgress(0);

            const maxSize = useSupabase ? MAX_FILE_SIZE_SUPABASE : MAX_FILE_SIZE_BASE64;

            if (file.size > maxSize) {
                const sizeMB = Math.round(maxSize / 1024 / 1024);
                setError(`Arquivo muito grande! Máximo ${sizeMB}MB.`);
                return;
            }

            try {
                setUploading(true);

                if (useSupabase && options?.projectId) {
                    // Upload para Supabase Storage
                    let result: UploadResult;

                    setProgress(30);

                    if (options.type === 'video') {
                        result = await uploadVideo(file, options.projectId);
                    } else {
                        const folder = options.type === 'thumbnail' ? 'thumbnails' : 'projects';
                        result = await uploadImage(file, folder, options.projectId);
                    }

                    setProgress(100);
                    callback(result.url);
                } else {
                    // Fallback: Base64
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
                console.error('Upload error:', err);
                setError(err instanceof Error ? err.message : 'Erro no upload');
            } finally {
                setTimeout(() => {
                    setUploading(false);
                    setProgress(0);
                }, 500);
            }
        },
        [useSupabase]
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
