/**
 * Repository Routes
 * Defines all API routes related to repository info generation.
 */

const express = require('express');
const router = express.Router();
const { generateRepoInfo } = require('../controllers/repoController');

/**
 * POST /api/generate
 * Body: { repoUrl: string, token?: string }
 * Response: { success: boolean, markdown: string, repoName: string }
 */
router.post('/generate', generateRepoInfo);

module.exports = router;
