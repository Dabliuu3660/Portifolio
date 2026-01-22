// Environment configuration utility

interface EnvConfig {
    appName: string;
    appUrl: string;
    adminEmail: string;
    adminPassword: string;
    isDevelopment: boolean;
    isProduction: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

export const env: EnvConfig = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'Arthur Matumoto Portfolio',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    adminEmail: getEnvVar('ADMIN_EMAIL', 'admin@portfolio.com'),
    adminPassword: getEnvVar('ADMIN_PASSWORD', ''),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables in production
if (env.isProduction && !env.adminPassword) {
    console.warn('⚠️  WARNING: ADMIN_PASSWORD is not set in production environment!');
}
