/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  // 明确指定工作区根目录，消除多 lockfile 警告
  outputFileTracingRoot: process.env.VERCEL ? undefined : process.cwd(),
}

export default nextConfig
