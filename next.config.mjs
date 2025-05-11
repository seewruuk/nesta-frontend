/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {protocol: 'https', hostname: 'images.pexels.com'},
            {protocol: 'https', hostname: 'images.steamusercontent.com'},
        ]
    },
};

export default nextConfig;
