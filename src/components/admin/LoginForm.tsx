'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await onLogin(email, password);

        if (!success) {
            setError('Email ou senha incorretos');
        }
        setLoading(false);
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="w-full max-w-md bg-white/5 border border-white/10 
                   rounded-3xl p-8 backdrop-blur-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 
                       flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Lock className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Área Administrativa
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Faça login para gerenciar seus projetos
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@portfolio.com"
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10
                           text-text-primary placeholder:text-text-secondary/50
                           focus:outline-none focus:border-accent/50 transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary
                           hover:text-text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 
                         border border-red-500/20 text-red-400 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                {/* Demo credentials */}
                <p className="mt-6 text-center text-text-secondary text-xs">
                    Demo: admin@portfolio.com / admin123
                </p>
            </motion.div>
        </motion.div>
    );
};
