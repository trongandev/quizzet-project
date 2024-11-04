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
        API_ENDPOINT: "http://localhost:5000/api",
        API_SOCKET: "http://localhost:4000/",
    },
};
