/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during `next build` (Vercel build step)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript type-checking during `next build`
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
