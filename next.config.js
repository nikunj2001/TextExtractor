/** @type {import('next').NextConfig} */
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();
const withNextEnv = nextEnv();
const nextConfig = withNextEnv({
    webpack: (config, { isServer }) => {
        config.resolve.alias.canvas = false;
        config.resolve.fallback = { fs: false };
        return config;
    }
})

module.exports = nextConfig