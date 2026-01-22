// Message service - refactored to use Repository Pattern

import { Message } from '@/types/message';
import { getMessageRepository } from '@/repositories';

// Get all messages
export const getMessages = async (): Promise<Message[]> => {
    const repository = getMessageRepository();
    return repository.getAll();
};

// Create new message (with validation)
export const createMessage = async (data: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> => {
    const repository = getMessageRepository();
    return repository.create(data);
};

// Mark message as read
export const markAsRead = async (id: string): Promise<void> => {
    const repository = getMessageRepository();
    return repository.markAsRead(id);
};

// Delete message
export const deleteMessage = async (id: string): Promise<boolean> => {
    const repository = getMessageRepository();
    return repository.delete(id);
};

// Get unread count
export const getUnreadCount = async (): Promise<number> => {
    const repository = getMessageRepository();
    return repository.getUnreadCount();
};
