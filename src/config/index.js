/**
 * Application Configuration
 * Centralizes all environment variables and app-wide constants.
 */

require('dotenv').config();

const config = {
  // Server
  port: process.env.PORT || 3000,

  // GitHub API
  github: {
    baseUrl: 'https://api.github.com',
    defaultToken: process.env.GITHUB_TOKEN || '',
    apiVersion: '2022-11-28',
    perPageCommits: 10,
    perPageContributors: 30,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                   // 50 requests per window
  },

  // CORS
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};

module.exports = config;
