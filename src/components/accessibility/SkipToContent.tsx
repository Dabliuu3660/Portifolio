// Skip to content link component for accessibility

'use client';

export const SkipToContent = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-accent focus:text-white 
                 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white 
                 focus:ring-offset-2 focus:ring-offset-accent
                 transition-all duration-200"
            aria-label="Pular para o conteúdo principal"
        >
            Pular para o conteúdo
        </a>
    );
};
