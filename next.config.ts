import { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      }
    ],
    domains: ['avatars.githubusercontent.com', "localhost", "cloudflare-ipfs.com", "utfs.io"]
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

export default config;