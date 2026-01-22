import { useState } from 'react';
import { Link as LinkIcon, FileVideo, Image as ImageIconLucide, CheckCircle2, X } from 'lucide-react';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFileUpload } from './hooks/useFileUpload';

interface VideoUploadSectionProps {
    mediaUrl: string;
    onMediaUrlChange: (url: string) => void;
    thumbnailUrl: string;
    onThumbnailUrlChange: (url: string) => void;
    projectId?: string;
}

export const VideoUploadSection = ({
    mediaUrl,
    onMediaUrlChange,
    thumbnailUrl,
    onThumbnailUrlChange,
    projectId,
}: VideoUploadSectionProps) => {
    const [videoInputType, setVideoInputType] = useState<'url' | 'file'>('url');
    const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        useDragAndDrop();
    const { processFile, uploading, progress, error } = useFileUpload();

    const handleVideoFileDrop = (file: File) => {
        processFile(file, onMediaUrlChange, { type: 'video', projectId });
        setVideoInputType('file');
    };

    const handleThumbnailFileDrop = (file: File) => {
        processFile(file, onThumbnailUrlChange, { type: 'thumbnail', projectId });
    };

    const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0], onMediaUrlChange, { type: 'video', projectId });
        }
    };

    const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0], onThumbnailUrlChange, { type: 'thumbnail', projectId });
        }
    };

    return (
        <div className="space-y-6">
            {/* Video Source */}
            <div className="space-y-4">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setVideoInputType('url')}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${videoInputType === 'url'
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${videoInputType === 'url'
                                ? 'bg-purple-600 dark:bg-purple-400'
                                : 'bg-transparent border border-gray-500'
                                }`}
                        />
                        External URL (YouTube/Vimeo)
                    </button>
                    <button
                        type="button"
                        onClick={() => setVideoInputType('file')}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${videoInputType === 'file'
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${videoInputType === 'file'
                                ? 'bg-purple-600 dark:bg-purple-400'
                                : 'bg-transparent border border-gray-500'
                                }`}
                        />
                        File Upload
                    </button>
                </div>

                {videoInputType === 'url' ? (
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="url"
                            value={mediaUrl}
                            onChange={(e) => onMediaUrlChange(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border border-black/5 dark:border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            required={videoInputType === 'url'}
                        />
                    </div>
                ) : (
                    <div className="border border-black/5 dark:border-white/10 rounded-xl p-4 bg-bg-secondary flex items-center justify-between">
                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            id="video-file-upload"
                            onChange={handleVideoFileSelect}
                            required={videoInputType === 'file' && !mediaUrl}
                        />
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                <FileVideo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {mediaUrl && mediaUrl.startsWith('data:')
                                        ? 'Vídeo selecionado'
                                        : mediaUrl || 'Nenhum arquivo selecionado'}
                                </p>
                                <p className="text-xs text-text-secondary">MP4, WebM (Max 10MB)</p>
                            </div>
                        </div>
                        <label
                            htmlFor="video-file-upload"
                            className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-lg text-sm text-text-primary cursor-pointer transition-colors shadow-sm"
                        >
                            Escolher
                        </label>
                    </div>
                )}
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                    Thumbnail / Cover{' '}
                    <span className="text-xs text-purple-600 dark:text-purple-400">(Obrigatório)</span>
                </label>
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all text-center ${isDragging
                        ? 'border-purple-500 bg-purple-500/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-bg-secondary'
                        }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, handleThumbnailFileDrop)}
                >
                    <input
                        type="file"
                        className="hidden"
                        id="thumb-upload"
                        accept="image/*"
                        onChange={handleThumbnailFileSelect}
                        required
                    />

                    {thumbnailUrl ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={thumbnailUrl}
                                alt="Thumb"
                                className="w-20 h-12 object-cover rounded bg-black/5"
                            />
                            <div className="flex-1 text-left">
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Thumbnail Carregada
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onThumbnailUrlChange('')}
                                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-secondary hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="thumb-upload"
                            className="cursor-pointer flex items-center justify-center gap-4 py-2"
                        >
                            <ImageIconLucide className="w-6 h-6 text-text-secondary" />
                            <span className="text-sm text-text-secondary hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                Arraste uma imagem ou clique para upload
                            </span>
                        </label>
                    )}
                    {uploading && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Enviando arquivos...</span>
                                <span className="text-text-primary font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-accent h-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
};
