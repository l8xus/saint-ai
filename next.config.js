/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com'],
  },
  // Increase the serverless function timeout for AI responses
  serverRuntimeConfig: {
    maxDuration: 60,
  },
}

module.exports = nextConfig
