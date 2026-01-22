import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDragAndDrop } from '@/components/admin/project-form/hooks/useDragAndDrop';

describe('useDragAndDrop', () => {
    const createDragEvent = (type: string, files?: File[]): React.DragEvent => {
        const event = {
            preventDefault: () => { },
            stopPropagation: () => { },
            dataTransfer: {
                files: files || [],
            },
            type,
        } as unknown as React.DragEvent;
        return event;
    };

    it('should initialize with isDragging false', () => {
        const { result } = renderHook(() => useDragAndDrop());
        expect(result.current.isDragging).toBe(false);
    });

    it('should set isDragging to true on drag enter', () => {
        const { result } = renderHook(() => useDragAndDrop());
        const event = createDragEvent('dragenter');

        act(() => {
            result.current.handleDragEnter(event);
        });

        expect(result.current.isDragging).toBe(true);
    });

    it('should set isDragging to false on drag leave', () => {
        const { result } = renderHook(() => useDragAndDrop());
        const enterEvent = createDragEvent('dragenter');
        const leaveEvent = createDragEvent('dragleave');

        act(() => {
            result.current.handleDragEnter(enterEvent);
        });

        expect(result.current.isDragging).toBe(true);

        act(() => {
            result.current.handleDragLeave(leaveEvent);
        });

        expect(result.current.isDragging).toBe(false);
    });

    it('should call onFileDrop with the dropped file', () => {
        const { result } = renderHook(() => useDragAndDrop());
        const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
        const mockOnFileDrop = vi.fn();
        const event = createDragEvent('drop', [mockFile]);

        act(() => {
            result.current.handleDrop(event, mockOnFileDrop);
        });

        expect(mockOnFileDrop).toHaveBeenCalledWith(mockFile);
        expect(result.current.isDragging).toBe(false);
    });

    it('should not call onFileDrop if no files are dropped', () => {
        const { result } = renderHook(() => useDragAndDrop());
        const mockOnFileDrop = vi.fn();
        const event = createDragEvent('drop', []);

        act(() => {
            result.current.handleDrop(event, mockOnFileDrop);
        });

        expect(mockOnFileDrop).not.toHaveBeenCalled();
    });
});
