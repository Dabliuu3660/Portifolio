import { ResumeData, RESUME_DATA } from '@/types/resume';

const RESUME_KEY = 'portfolio_resume';

// Get resume data
export const getResumeData = async (): Promise<ResumeData> => {
    if (typeof window === 'undefined') return RESUME_DATA;

    const stored = localStorage.getItem(RESUME_KEY);
    if (!stored) {
        // If no custom data, return default static data
        return RESUME_DATA;
    }

    return JSON.parse(stored);
};

// Update resume data
export const updateResumeData = async (data: ResumeData): Promise<ResumeData> => {
    localStorage.setItem(RESUME_KEY, JSON.stringify(data));
    return data;
};

// Reset to default
export const resetResumeData = async (): Promise<ResumeData> => {
    localStorage.removeItem(RESUME_KEY);
    return RESUME_DATA;
};
