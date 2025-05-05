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
        CORPORATE_URL: process.env.CORPORATE_URL,
        DEBUG_LOGS: process.env.DEBUG_LOGS,
    },
    images: {
        remotePatterns: [
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