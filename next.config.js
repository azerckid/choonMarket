/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['avatars.githubusercontent.com', "localhost", "cloudflare-ipfs.com", "utfs.io", "github.com"]
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

module.exports = nextConfig; 