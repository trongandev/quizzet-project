module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*",
            },
        ],
    },
    distDir: "build",
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        API_SOCKET: process.env.API_SOCKET,
    },
};
