import { ImageIcon, Video } from 'lucide-react';
import { MediaType } from '@/types/project';

interface MediaTypeSelectorProps {
    mediaType: MediaType;
    onMediaTypeChange: (type: MediaType) => void;
}

export const MediaTypeSelector = ({ mediaType, onMediaTypeChange }: MediaTypeSelectorProps) => {
    return (
        <div className="bg-bg-secondary p-1 rounded-xl flex border border-black/5 dark:border-white/5">
            <button
                type="button"
                onClick={() => onMediaTypeChange('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${mediaType === 'image'
                        ? 'bg-accent text-white shadow-lg'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
            >
                <ImageIcon className="w-4 h-4" />
                Image Project
            </button>
            <button
                type="button"
                onClick={() => onMediaTypeChange('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${mediaType === 'video'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
            >
                <Video className="w-4 h-4" />
                Video Project
            </button>
        </div>
    );
};
