'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message } from '@/types/message';
import { getMessages, markAsRead, deleteMessage } from '@/services/messageService';

export const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    const handleDelete = async (id: string) => {
        await deleteMessage(id);
        setMessages(prev => prev.filter(m => m.id !== id));
    };

    return {
        messages,
        loading,
        refreshMessages: loadMessages,
        markAsRead: handleMarkAsRead,
        deleteMessage: handleDelete,
    };
};
