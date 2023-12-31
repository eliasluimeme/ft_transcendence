/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig

module.exports = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'dfstudio-d420.kxcdn.com',
      'i.giphy.com',
      'mir-s3-cdn-cf.behance.net',
      'cdn.dribbble.com',
      'images.unsplash.com',
      'media.istockphoto.com', // Add istockphoto domain
      'img.freepik.com',// Add this line to allow images from unsplash.com
    ],
  },
};
