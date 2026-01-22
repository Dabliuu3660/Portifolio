import { Upload, X } from 'lucide-react';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFileUpload } from './hooks/useFileUpload';

interface ImageUploadZoneProps {
    mediaUrl: string;
    onMediaUrlChange: (url: string) => void;
    projectId?: string;
}

export const ImageUploadZone = ({ mediaUrl, onMediaUrlChange, projectId }: ImageUploadZoneProps) => {
    const { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        useDragAndDrop();
    const { processFile, error, uploading, progress } = useFileUpload();

    const handleFileDrop = (file: File) => {
        processFile(file, onMediaUrlChange, {
            type: 'image',
            projectId
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            processFile(e.target.files[0], onMediaUrlChange, {
                type: 'image',
                projectId
            });
        }
    };

    return (
        <div>
            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center group ${isDragging
                    ? 'border-accent bg-accent/5'
                    : 'border-black/10 dark:border-white/10 hover:border-accent/50 bg-bg-secondary'
                    }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, handleFileDrop)}
            >
                <input
                    type="file"
                    className="hidden"
                    id="main-image-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    required={!mediaUrl}
                />

                {mediaUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5">
                        <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" />
                        <button
                            type="button"
                            onClick={() => onMediaUrlChange('')}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label
                        htmlFor="main-image-upload"
                        className="cursor-pointer flex flex-col items-center py-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" />
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-1">
                            Click or Drag Image Here
                        </h3>
                        <p className="text-sm text-text-secondary">
                            Supports JPG, PNG, WebP (Max 10MB)
                        </p>
                    </label>
                )}
            </div>
            {uploading && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">Enviando...</span>
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
    );
};
