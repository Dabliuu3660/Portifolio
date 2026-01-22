// Resume data types

export interface Experience {
    id: string;
    company: string;
    period: string;
    description: string;
}

export interface ResumeData {
    name: string;
    about: string;
    experiences: Experience[];
    softSkills: string[];
    hardSkillsDesign: string[];
    hardSkillsVideo: string[];
}

// Static resume data for Arthur Santos Matumoto
export const RESUME_DATA: ResumeData = {
    name: 'ARTHUR SANTOS MATUMOTO',
    about:
        'Sou designer a 10 anos, com experiência de 4 anos no mercado, especializado em Design de E-commerce, infoprodutos e edição de vídeos. Entusiasta de novas tecnologias, procuro sempre me atualizar sobre novas tecnicas e softwares que possam auxiliar meu trabalho. Busco a oportunidade de aplicar minhas habilidades analíticas e criativas para ajudar sua empresa a alcançar novos resultados',
    experiences: [
        {
            id: '1',
            company: '2RM PLACAS DECORATIVAS',
            period: '2023-2025',
            description:
                'Comecei na empresa como assistente de midias sociais, onde eu cuidava de todo o conteúdo do instagram, era responsável por todo o processo de criação de conteúdo, realizava videos para criativos, carrossel para o instagram, videos interativos, com foco em conversão de vendas e crescimento da marca, tanto no tráfego pago quanto no organico. Após 8 messes, fui promovido para Designer de Produto, onde além das funções que eu já realizava, passei a desenvolver os produtos personalizados que os clientes solicitavam, passei a cuidar da parte de vendas, parcerias com influenciadores do nicho, organização de layout do E-Commerce e destribuição dos produtos para lojas revendedoras',
        },
        {
            id: '2',
            company: 'CLUBFIT ALIMENTAÇÃO SAUDÁVEL',
            period: '2025-Atualmente',
            description:
                'Atuo na gestão integral da identidade visual da Clufit, sendo o responsável estratégico pela criação de comunicações On e Offline. Meu escopo abrange desde o desenvolvimento de catálogos e materiais impressos até a estruturação de interfaces digitais (UX) para E-commerce e Marketplaces. Lidero a criação de campanhas de alta performance, incluindo Motion Design para Elemidia, Landing Pages de conversão e todo o ecossistema de ativos para tráfego pago e e-mail marketing',
        },
    ],
    softSkills: [
        'Resolução de Problemas',
        'Criatividade e Inovação',
        'Adaptabilidade',
        'Trabalho em equipe',
        'Atenção aos Detalhes',
        'Proatividade',
        'Gestão de Conflitos',
        'Facilidade em Receber Feedback',
    ],
    hardSkillsDesign: [
        'Adobe Photoshop',
        'Adobe Illustrator',
        'CorelDRAW',
        'Canva',
        'Adobe XD',
    ],
    hardSkillsVideo: [
        'Adobe After Effects',
        'Adobe Premiere Pro',
        'Capcut',
        'Cinema 4D',
    ],
};
