/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'images.pexels.com'},
            {protocol: 'https', hostname: 'images.steamusercontent.com'},
            {protocol: 'http', hostname: 'localhost'},
            {protocol: 'https', hostname: 'via.placeholder.com'},
        ]
    },
};

export default nextConfig;
