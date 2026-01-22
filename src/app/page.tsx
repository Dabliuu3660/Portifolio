'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useFilter } from '@/hooks/useFilter';
import { FilterBar } from '@/components/portfolio/FilterBar';
import { MasonryGrid } from '@/components/portfolio/MasonryGrid';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { Project } from '@/types/project';

export default function HomePage() {
  const { projects, loading } = useProjects();
  const { activeFilter, setFilter, filteredProjects } = useFilter(projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full
                         text-sm font-medium bg-accent/10 text-accent border border-accent/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              Designer Gráfico & Editor de Vídeos
            </motion.span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="text-text-primary">ARTHUR</span>
            <br />
            <span className="gradient-text">MATUMOTO</span>
          </motion.h1>

          <motion.p
            className="text-xl text-text-secondary max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Transformando ideias em experiências visuais impactantes.
            Especializado em E-commerce, Redes Sociais e Motion Design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className=""
          >
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 text-text-secondary 
                         hover:text-accent transition-colors"
            >
              <span>Ver Portfolio</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="max-w-7xl mx-auto px-6 pt-2 pb-12">
        {/* Filter Bar */}
        <FilterBar activeFilter={activeFilter} onFilterChange={setFilter} />

        {/* Gallery */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : (
            <MasonryGrid
              projects={filteredProjects}
              onProjectClick={(project) => setSelectedProject(project)}
            />
          )}
        </div>


      </section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
