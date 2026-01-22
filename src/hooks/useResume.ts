'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResumeData } from '@/types/resume';
import { getResumeData, updateResumeData } from '@/services/resumeService';

export const useResume = () => {
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadResume = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getResumeData();
            setResumeData(data);
        } catch (error) {
            console.error('Failed to load resume data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadResume();
    }, [loadResume]);

    return { resumeData, loading, refreshResume: loadResume };
};

export const useAdminResume = () => {
    const { resumeData, loading, refreshResume } = useResume();
    const [saving, setSaving] = useState(false);

    const saveResume = async (data: ResumeData) => {
        try {
            setSaving(true);
            await updateResumeData(data);
            await refreshResume();
            return true;
        } catch (error) {
            console.error('Failed to save resume data', error);
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
        resumeData,
        loading,
        saving,
        saveResume,
    };
};
