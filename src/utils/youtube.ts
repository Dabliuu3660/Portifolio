/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
        /youtube\.com\/v\/([^&\s?]+)/,
        /youtube\.com\/shorts\/([^&\s?]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

/**
 * Checks if a URL is a YouTube video
 */
export const isYouTubeUrl = (url: string): boolean => {
    return getYouTubeVideoId(url) !== null;
};

/**
 * Gets YouTube thumbnail URL from video ID or URL
 */
export const getYouTubeThumbnail = (urlOrId: string, quality: 'default' | 'hq' | 'maxres' = 'maxres'): string | null => {
    const videoId = getYouTubeVideoId(urlOrId) || urlOrId;
    if (!videoId) return null;

    const qualityMap = {
        default: 'default.jpg',
        hq: 'hqdefault.jpg',
        maxres: 'maxresdefault.jpg',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

/**
 * Gets YouTube embed URL from video ID or URL
 */
export const getYouTubeEmbedUrl = (urlOrId: string): string | null => {
    const videoId = getYouTubeVideoId(urlOrId) || urlOrId;
    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
};
