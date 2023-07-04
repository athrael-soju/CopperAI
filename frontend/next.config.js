/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  publicRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AUDIO_DB_SENSITIVITY: process.env.AUDIO_DB_SENSITIVITY,
  },
};

export default nextConfig;
