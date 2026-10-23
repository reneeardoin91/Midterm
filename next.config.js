
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  serverExternalPackages: ["genkit", "@genkit-ai/google-genai"],
};

module.exports = nextConfig;
