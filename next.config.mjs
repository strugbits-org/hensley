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
        ADMIN_BADGE: process.env.ADMIN_BADGE,
        REVALIDATE_TIME: process.env.REVALIDATE_TIME,
        DEBUG_LOGS: process.env.DEBUG_LOGS,
        CORE_API_BASE_URL: process.env.CORE_API_BASE_URL,
    },
    images: {
        // WebP only — AVIF cuts ~20% more bytes but encoding it with sharp is
        // 3–5x slower per image on first request. Vercel/CDN cache after that,
        // but a fresh page that triggers a few dozen first-time optimizations
        // visibly stalls without this.
        formats: ['image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30,
        deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840],
        imageSizes: [16, 32, 64, 96, 128, 256, 384, 512],
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
    staticPageGenerationTimeout: 180,
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    async redirects() {
        return [
            {
                source: '/pool-cover/:slug*',
                destination: '/pool-covers/:slug*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;  