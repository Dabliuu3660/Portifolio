'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Check, Clock } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/Button';

export const MessageList = () => {
    const { messages, loading, markAsRead, deleteMessage } = useMessages();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div
                    className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Caixa de entrada vazia
                </h3>
                <p className="text-text-secondary">
                    Nenhuma mensagem recebida ainda.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                relative p-6 rounded-2xl border transition-all duration-300
                ${msg.read
                                ? 'bg-white/5 border-white/5'
                                : 'bg-accent/5 border-accent/20 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                            }
              `}
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            {/* Header */}
                            <div className="flex items-start gap-4">
                                <div className={`
                          p-3 rounded-full flex-shrink-0
                          ${msg.read ? 'bg-white/10 text-text-secondary' : 'bg-accent/20 text-accent'}
                      `}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold mb-1 ${msg.read ? 'text-text-primary' : 'text-accent'}`}>
                                        {msg.subject}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-text-secondary">
                                        <span className="font-medium text-text-primary">{msg.name}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{msg.email}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Intl.DateTimeFormat('pt-BR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            }).format(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 justify-end">
                                {!msg.read && (
                                    <Button
                                        onClick={() => markAsRead(msg.id)}
                                        className="px-3 py-2 text-sm bg-accent/10 text-accent hover:bg-accent/20 border-transparent"
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Marcar lido
                                    </Button>
                                )}
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="p-2 rounded-lg text-text-secondary hover:text-red-400
                                     hover:bg-red-500/10 transition-colors"
                                    title="Excluir mensagem"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="mt-4 pl-[4.5rem]">
                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
