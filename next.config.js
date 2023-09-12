const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const nextConfig = {
  reactStrictMode: true,
  i18n,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'medusa-public-images.s3.eu-west-1.amazonaws.com',
      'localhost',
      'medusa-server-testing.s3.amazonaws.com',
      'https://img.alicdn.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.alicdn.com',
      },
    ],
  },
};

module.exports = nextConfig;
