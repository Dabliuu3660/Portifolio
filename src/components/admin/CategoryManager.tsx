'use client';

import { useState } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, AlertTriangle, GripVertical } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Category } from '@/types/category';

export const CategoryManager = () => {
    const { categories, addCategory, deleteCategory, reorderCategories } = useCategories();
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        const success = await addCategory(newCategory.trim());
        if (!success) {
            setError('Categoria já existe ou erro ao criar!');
            return;
        }
        setNewCategory('');
        setError('');
    };

    const handleDelete = async () => {
        if (deleteConfirm) {
            await deleteCategory(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-accent" />
                Gerenciar Categorias
            </h2>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="mb-6 flex-shrink-0">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nova Categoria
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => {
                            setNewCategory(e.target.value);
                            setError('');
                        }}
                        placeholder="Ex: Identidade Visual"
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10
                       text-text-primary placeholder:text-text-secondary/50
                       focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    <Button type="submit" disabled={!newCategory.trim()}>
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>

            <div className="mb-2 text-xs text-text-secondary">
                Arraste para reordenar
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <Reorder.Group
                    axis="y"
                    values={categories}
                    onReorder={reorderCategories}
                    className="space-y-2"
                >
                    <AnimatePresence>
                        {categories.map((cat) => (
                            <Reorder.Item
                                key={cat.id}
                                value={cat}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="group flex items-center justify-between p-3 rounded-lg
                             bg-white/5 border border-white/5 hover:border-white/20 transition-colors
                             cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-text-secondary/50 group-hover:text-text-secondary" />
                                    <span className="text-text-primary">{cat.name}</span>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm(cat)}
                                    // Prevent drag on button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    className="p-2 rounded-lg text-text-secondary hover:text-red-400
                               hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label={`Excluir categoria ${cat.name}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 
                          flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        Excluir Categoria?
                    </h3>
                    <p className="text-text-secondary mb-6">
                        Tem certeza que deseja excluir <strong>{deleteConfirm?.name}</strong>?
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
