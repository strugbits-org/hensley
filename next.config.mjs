/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    env: {
        BASE_URL: process.env.BASE_URL,
        SITE_ID_WIX: process.env.SITE_ID_WIX,
        CLIENT_ID_WIX: process.env.CLIENT_ID_WIX,
        API_KEY_WIX: process.env.API_KEY_WIX,
        CONTACT_FORM_ID_WIX: process.env.CONTACT_FORM_ID_WIX,
        NEWSLETTER_ID_WIX: process.env.NEWSLETTER_ID_WIX,
        ADMIN_BADGE: process.env.ADMIN_BADGE,
        REVALIDATE_TIME: process.env.REVALIDATE_TIME,
        DEBUG_LOGS: process.env.DEBUG_LOGS,
        CORE_API_BASE_URL: process.env.CORE_API_BASE_URL,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3000',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;  