/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: ["v0.blob.com"], // Allow images from v0.blob.com
  },
  experimental: {
    // Enable server components
    serverComponents: true,
    // Enable app directory
    appDir: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Configure redirects if needed
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

