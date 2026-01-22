import { ProjectCategory } from '@/types/project';

interface ProjectDetailsSectionProps {
    title: string;
    onTitleChange: (value: string) => void;
    category: ProjectCategory;
    onCategoryChange: (value: ProjectCategory) => void;
    description: string;
    onDescriptionChange: (value: string) => void;
    categories: string[];
}

export const ProjectDetailsSection = ({
    title,
    onTitleChange,
    category,
    onCategoryChange,
    description,
    onDescriptionChange,
    categories,
}: ProjectDetailsSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                        Título do Projeto
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Ex: Campanha Nike 2024"
                        className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-black/5 dark:border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                        Categoria
                    </label>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value as ProjectCategory)}
                        className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-black/5 dark:border-white/10 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none cursor-pointer"
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat} className="text-black dark:text-white">
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                    Descrição (Opcional)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Breve contexto sobre o trabalho..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-black/5 dark:border-white/10 text-text-primary placeholder:text-text-secondary/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
                />
            </div>
        </div>
    );
};
