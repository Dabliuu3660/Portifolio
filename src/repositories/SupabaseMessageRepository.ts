import { Message } from '@/types/message';
import { IMessageRepository } from './interfaces/IMessageRepository';
import { messageFormSchema } from '@/schemas/validation';
import { supabase } from '@/lib/supabase';

/**
 * Supabase implementation of Message Repository
 */
export class SupabaseMessageRepository implements IMessageRepository {
    private mapToMessage(data: any): Message {
        return {
            id: data.id,
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            read: data.read,
            createdAt: new Date(data.created_at),
        };
    }

    async getAll(): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to fetch messages: ${error.message}`);

        return (data || []).map((item) => this.mapToMessage(item));
    }

    async getById(id: string): Promise<Message | null> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new Error(`Failed to fetch message: ${error.message}`);
        }

        return this.mapToMessage(data);
    }

    async create(data: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
        const result = messageFormSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('; ');
            throw new Error(`Validation failed: ${errors}`);
        }

        const { data: created, error } = await supabase
            .from('messages')
            .insert({
                name: result.data.name,
                email: result.data.email,
                subject: result.data.subject,
                message: result.data.message,
                read: false,
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create message: ${error.message}`);

        return this.mapToMessage(created);
    }

    async update(
        id: string,
        data: Partial<Omit<Message, 'id' | 'createdAt' | 'read'>>
    ): Promise<Message | null> {
        const { data: updated, error } = await supabase
            .from('messages')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new Error(`Failed to update message: ${error.message}`);
        }

        return this.mapToMessage(updated);
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase.from('messages').delete().eq('id', id);

        if (error) {
            if (error.code === 'PGRST116') return false;
            throw new Error(`Failed to delete message: ${error.message}`);
        }

        return true;
    }

    async markAsRead(id: string): Promise<void> {
        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', id);

        if (error) throw new Error(`Failed to mark message as read: ${error.message}`);
    }

    async getUnreadCount(): Promise<number> {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('read', false);

        if (error) throw new Error(`Failed to get unread count: ${error.message}`);

        return count || 0;
    }
}
