import { Message } from '@/types/message';
import { IRepository } from './IRepository';

export interface IMessageRepository extends IRepository<Message, Omit<Message, 'id' | 'createdAt' | 'read'>> {
    /**
     * Mark a message as read
     */
    markAsRead(id: string): Promise<void>;

    /**
     * Get unread messages count
     */
    getUnreadCount(): Promise<number>;
}
