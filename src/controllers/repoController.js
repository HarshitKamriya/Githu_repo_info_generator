/**
 * Repository Controller
 * Handles the request/response logic for the /api/generate endpoint.
 * Delegates business logic to the service and utility layers.
 */

const { parseGitHubUrl } = require('../utils/urlParser');
const { fetchAllRepoData } = require('../services/githubService');
const { buildMarkdown } = require('../utils/markdownFormatter');

/**
 * POST /api/generate
 * Accepts: { repoUrl: string, token?: string }
 * Returns: { success: true, markdown: string, repoName: string }
 */
async function generateRepoInfo(req, res, next) {
  try {
    const { repoUrl, token } = req.body;

    // 1. Validate and parse the URL
    const { owner, repo } = parseGitHubUrl(repoUrl);

    console.log(`📡 Fetching data for ${owner}/${repo}...`);

    // 2. Fetch all data from GitHub API
    const data = await fetchAllRepoData(owner, repo, token);

    console.log(`✅ Data fetched successfully for ${owner}/${repo}`);

    // 3. Format into Markdown
    const markdown = buildMarkdown(data);

    // 4. Send response
    return res.json({
      success: true,
      markdown,
      repoName: data.repo.full_name,
    });
  } catch (error) {
    next(error); // Forward to centralized error handler
  }
}

module.exports = { generateRepoInfo };
