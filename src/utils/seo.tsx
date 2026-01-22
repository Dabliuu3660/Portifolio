// SEO utilities - JSON-LD structured data

export interface PersonSchema {
    name: string;
    jobTitle: string;
    url?: string;
    sameAs?: string[];
    image?: string;
    email?: string;
}

export interface PortfolioItemSchema {
    name: string;
    description: string;
    image: string;
    url?: string;
    dateCreated?: string;
    creator: string;
    category?: string;
}

/**
 * Generate Person JSON-LD structured data
 */
export const generatePersonSchema = (data: PersonSchema) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: data.name,
        jobTitle: data.jobTitle,
        url: data.url,
        sameAs: data.sameAs || [],
        image: data.image,
        email: data.email,
    };
};

/**
 * Generate Creative Work JSON-LD structured data
 */
export const generateCreativeWorkSchema = (data: PortfolioItemSchema) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: data.name,
        description: data.description,
        image: data.image,
        url: data.url,
        dateCreated: data.dateCreated,
        creator: {
            '@type': 'Person',
            name: data.creator,
        },
        genre: data.category,
    };
};

/**
 * Generate Breadcrumb JSON-LD structured data
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
};

/**
 * Generate Organization JSON-LD structured data
 */
export const generateOrganizationSchema = (data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
}) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        sameAs: data.sameAs || [],
    };
};

/**
 * Component to inject JSON-LD script
 */
export const JsonLd = ({ data }: { data: any }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};
