
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@genkit-ai/ai', '@genkit-ai/core', '@genkit-ai/googleai'],
  // Make sure to remove your 'eslint' key from here as noted in your logs!
};

module.exports = nextConfig;


import { googleGenAI } from '@genkit-ai/google-genai';

// Initialization
ai.configure({
  plugins: [googleGenAI()],
});

// Usage (Note the prefix change to 'googleGenAI/')
const response = await ai.generate({
  model: 'googleGenAI/gemini-1.5-flash',
  prompt: 'Hello!',
});
