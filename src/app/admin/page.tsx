'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Moon, Sun, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { LoginForm } from '@/components/admin/LoginForm';
import { PortfolioView } from '@/components/admin/PortfolioView';
import { ResumeEditor } from '@/components/admin/ResumeEditor';
import { MessageList } from '@/components/admin/MessageList';

type AdminView = 'portfolio' | 'add-project' | 'resume' | 'contact';

export default function AdminPage() {
    const { isAuthenticated, user, login, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [currentView, setCurrentView] = useState<AdminView>('portfolio');

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <LoginForm onLogin={login} />
            </div>
        );
    }

    const menuItems = [
        { id: 'portfolio', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'add-project', label: 'Novo Projeto', icon: Plus },
        { id: 'resume', label: 'Currículo', icon: FileText },
        { id: 'contact', label: 'Mensagens', icon: MessageSquare },
    ] as const;

    return (
        <div className="min-h-screen flex bg-bg-primary text-text-primary transition-colors duration-300">
            {/* Sidebar Desktop */}
            <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-black/40 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                        Arthur.Design Admin
                    </h1>
                    <p className="text-sm text-text-secondary mt-1">Bem-vindo, {user?.name}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentView === item.id
                                ? 'bg-accent/20 text-accent border border-accent/20 font-medium'
                                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        Alternar Tema
                    </button>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
                <h1 className="font-bold text-lg text-accent">Arthur.Design</h1>
                <button onClick={logout} className="text-red-400"><LogOut className="w-5 h-5" /></button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-8 pt-20 md:pt-8 overflow-x-hidden min-h-screen">
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <header className="mb-8 hidden md:block">
                        <h2 className="text-3xl font-bold text-text-primary">
                            {menuItems.find(i => i.id === currentView)?.label}
                        </h2>
                        <p className="text-text-secondary">
                            {(currentView === 'portfolio' || currentView === 'add-project') && 'Gerencie seus projetos e categorias.'}
                            {currentView === 'resume' && 'Edite as informações do seu currículo.'}
                            {currentView === 'contact' && 'Visualize mensagens recebidas pelo site.'}
                        </p>
                    </header>

                    {(currentView === 'portfolio' || currentView === 'add-project') && (
                        <PortfolioView initialView={currentView === 'add-project' ? 'add' : 'list'} />
                    )}
                    {currentView === 'resume' && <ResumeEditor />}
                    {currentView === 'contact' && <MessageList />}
                </motion.div>
            </main>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around p-2 shadow-2xl">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${currentView === item.id ? 'text-accent' : 'text-text-secondary'
                            }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
