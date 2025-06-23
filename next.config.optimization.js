// ✅ Vercel Optimization Configuration
module.exports = {
    // 1. Static Generation Configuration
    experimental: {
        // Tối ưu ISR
        isrMemoryCacheSize: 0, // Disable in-memory cache để tránh RAM issues
        workerThreads: false,
        cpus: 1,
    },

    // 2. Headers for caching
    async headers() {
        return [
            {
                source: "/api/flashcards/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-maxage=3600, stale-while-revalidate=86400", // 1h cache, 24h stale
                    },
                ],
            },
            {
                source: "/flashcard/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, s-maxage=1800, stale-while-revalidate=3600", // 30min cache, 1h stale
                    },
                ],
            },
            // Static assets
            {
                source: "/(.*\\.(js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2))",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable", // 1 year cache
                    },
                ],
            },
        ];
    },

    // 3. Redirects to avoid unnecessary functions
    async redirects() {
        return [
            // Redirect old routes
            {
                source: "/old-flashcard/:path*",
                destination: "/flashcard/:path*",
                permanent: true,
            },
        ];
    },

    // 4. Image optimization
    images: {
        domains: ["your-image-domain.com"],
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 86400, // 24h cache
    },

    // 5. Compression
    compress: true,

    // 6. Bundle analyzer (disable in production)
    ...(process.env.ANALYZE === "true" && {
        webpack: (config) => {
            config.plugins.push(new (require("@next/bundle-analyzer"))());
            return config;
        },
    }),
};
