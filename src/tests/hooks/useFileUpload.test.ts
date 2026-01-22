import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from '@/components/admin/project-form/hooks/useFileUpload';

vi.mock('@/services/uploadService', () => ({
    isSupabaseStorageAvailable: () => false,
    uploadImage: vi.fn(),
    uploadVideo: vi.fn(),
}));

describe('useFileUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with no error', () => {
        const { result } = renderHook(() => useFileUpload());
        expect(result.current.error).toBeNull();
    });

    it('should reject files larger than 10MB', () => {
        const { result } = renderHook(() => useFileUpload());
        const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
            type: 'image/jpeg',
        });
        const mockCallback = vi.fn();

        act(() => {
            result.current.processFile(largeFile, mockCallback);
        });

        expect(result.current.error).toBe('Arquivo muito grande! Máximo 10MB.');
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should clear error', () => {
        const { result } = renderHook(() => useFileUpload());
        const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
            type: 'image/jpeg',
        });

        act(() => {
            result.current.processFile(largeFile, vi.fn());
        });

        expect(result.current.error).toBeTruthy();

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });
});
