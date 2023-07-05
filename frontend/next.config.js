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
    SERVER_ADDRESS: process.env.SERVER_ADDRESS,
    SERVER_PORT: process.env.SERVER_PORT,
    SERVER_MESSAGE_ENDPOINT: process.env.SERVER_MESSAGE_ENDPOINT,
    SERVER_SPEAK_ENDPOINT: process.env.SERVER_SPEAK_ENDPOINT,
  },
};

export default nextConfig;
