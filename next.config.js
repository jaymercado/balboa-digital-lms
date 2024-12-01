/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'preview.webpixels.io',
      },
      {
        protocol: 'https',
        hostname: 'balboa-digital-lms.s3.ap-southeast-1.amazonaws.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })

    return config
  },
}

module.exports = nextConfig
