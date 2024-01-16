/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.alias.canvas = false;
        config.resolve.fallback = { fs: false };
        return config;
    }
}

module.exports = nextConfig
