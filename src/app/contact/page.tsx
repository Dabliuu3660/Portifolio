'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { createMessage } = await import('@/services/messageService');
            await createMessage({
                name: formState.name,
                email: formState.email,
                subject: formState.subject,
                message: formState.message,
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally show error state
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'arthurmatumoto14@gmail.com',
            href: 'mailto:arthurmatumoto14@gmail.com',
            isExternal: false,
        },
        {
            icon: Phone,
            label: 'Telefone',
            value: '+55 (11) 96831-8958',
            href: 'https://wa.me/5511968318958',
            isExternal: true, // Mark as external for target="_blank"
        },
        {
            icon: MapPin,
            label: 'Localização',
            value: 'São Paulo, Brasil',
            href: null,
            isExternal: false,
        },
    ];

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <motion.div
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20
                       flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-text-primary mb-4">
                        Mensagem Enviada!
                    </h2>
                    <p className="text-text-secondary mb-6 max-w-md mx-auto">
                        Obrigado pelo contato! Responderei sua mensagem o mais rápido possível.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="secondary">
                        Enviar Nova Mensagem
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20
                     flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <MessageSquare className="w-10 h-10 text-accent" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                    Vamos Conversar?
                </h1>

                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                    Estou disponível para novos projetos e oportunidades.
                    Entre em contato e vamos criar algo incrível juntos!
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12">
                {/* Contact Info */}
                <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-text-primary mb-6">
                        Informações de Contato
                    </h2>

                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={info.label}
                            className="flex items-start gap-4 p-4 rounded-2xl
                         bg-white/5 border border-white/10
                         hover:border-accent/30 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className="p-3 rounded-xl bg-accent/20">
                                <info.icon className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-text-secondary text-sm mb-1">{info.label}</p>
                                {info.href ? (
                                    <a
                                        href={info.href}
                                        target={info.isExternal ? "_blank" : undefined}
                                        rel={info.isExternal ? "noopener noreferrer" : undefined}
                                        className="text-text-primary font-medium hover:text-accent transition-colors"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-text-primary font-medium">{info.value}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Response time */}
                    <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                        <p className="text-accent text-sm">
                            ⚡ Tempo médio de resposta: <strong>24 horas</strong>
                        </p>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-text-primary mb-6">
                        Envie uma Mensagem
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Nome *
                            </label>
                            <input
                                type="text"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                placeholder="Seu nome"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors"
                                required
                            />
                        </div>

                        {/* Subject */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Assunto *
                            </label>
                            <input
                                type="text"
                                value={formState.subject}
                                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                placeholder="Qual o assunto?"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors"
                                required
                            />
                        </div>

                        {/* Message */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                Mensagem *
                            </label>
                            <textarea
                                value={formState.message}
                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                placeholder="Descreva seu projeto ou oportunidade..."
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors
                           resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-6">
                        <Button type="submit" disabled={loading} className="w-full md:w-auto gap-2">
                            {loading ? (
                                'Enviando...'
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Enviar Mensagem
                                </>
                            )}
                        </Button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
