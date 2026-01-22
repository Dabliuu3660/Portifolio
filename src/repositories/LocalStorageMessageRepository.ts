import { Message } from '@/types/message';
import { IMessageRepository } from './interfaces/IMessageRepository';
import { messageFormSchema } from '@/schemas/validation';

const MESSAGE_KEY = 'portfolio_messages';

/**
 * LocalStorage implementation of Message Repository
 */
export class LocalStorageMessageRepository implements IMessageRepository {
    private getMessages(): Message[] {
        if (typeof window === 'undefined') return [];

        const stored = localStorage.getItem(MESSAGE_KEY);
        if (!stored) return [];

        const messages = JSON.parse(stored) as Message[];
        return messages.map((m) => ({
            ...m,
            createdAt: new Date(m.createdAt),
        }));
    }

    private saveMessages(messages: Message[]): void {
        localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
    }

    async getAll(): Promise<Message[]> {
        const messages = this.getMessages();
        return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getById(id: string): Promise<Message | null> {
        const messages = this.getMessages();
        return messages.find((m) => m.id === id) || null;
    }

    async create(data: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
        // Validate data
        const result = messageFormSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
            throw new Error(`Validation failed: ${errors}`);
        }

        const messages = this.getMessages();

        const newMessage: Message = {
            ...result.data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            read: false,
        };

        const updated = [newMessage, ...messages];
        this.saveMessages(updated);

        return newMessage;
    }

    async update(id: string, data: Partial<Omit<Message, 'id' | 'createdAt' | 'read'>>): Promise<Message | null> {
        const messages = this.getMessages();
        const index = messages.findIndex((m) => m.id === id);

        if (index === -1) return null;

        const updated = {
            ...messages[index],
            ...data,
        };

        messages[index] = updated;
        this.saveMessages(messages);

        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const messages = this.getMessages();
        const filtered = messages.filter((m) => m.id !== id);

        if (filtered.length === messages.length) return false;

        this.saveMessages(filtered);
        return true;
    }

    async markAsRead(id: string): Promise<void> {
        const messages = this.getMessages();
        const updated = messages.map((m) => (m.id === id ? { ...m, read: true } : m));
        this.saveMessages(updated);
    }

    async getUnreadCount(): Promise<number> {
        const messages = this.getMessages();
        return messages.filter((m) => !m.read).length;
    }
}
