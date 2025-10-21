module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            },
            {
                protocol: "http",
                hostname: "*",
            },
        ],
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false,
    distDir: "build",
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        API_SOCKET: process.env.API_SOCKET,
        API_KEY_AI: process.env.API_KEY_AI,
    },
};
