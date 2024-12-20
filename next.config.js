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
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    distDir: "build",
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        API_SOCKET: process.env.API_SOCKET,
        API_KEY_AI: process.env.API_KEY_AI,
        API_IMAGE: process.env.API_IMAGE,
    },
};
