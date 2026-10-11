
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@genkit-ai/ai', '@genkit-ai/core', '@genkit-ai/googleai'],
  // Make sure to remove your 'eslint' key from here as noted in your logs!
};

module.exports = nextConfig;


