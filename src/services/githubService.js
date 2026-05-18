/**
 * GitHub Service
 * Handles all communication with the GitHub REST API.
 * Implements data fetching with proper error handling and header management.
 */

const config = require('../config');

/**
 * Builds standard headers for GitHub API requests.
 * @param {string} [token] - Optional personal access token
 * @returns {Object} Headers object
 */
function buildHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': config.github.apiVersion,
    'User-Agent': 'RepoInfoGenerator/1.0',
  };

  // Prefer per-request token, fall back to server-level token
  const authToken = token || config.github.defaultToken;
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

/**
 * Makes a GET request to the GitHub API.
 * @param {string} endpoint - API path (e.g., /repos/owner/repo)
 * @param {string} [token]  - Optional auth token
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {Error} On non-2xx responses
 */
async function githubFetch(endpoint, token) {
  const url = `${config.github.baseUrl}${endpoint}`;
  const headers = buildHeaders(token);

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = body.message || response.statusText;

    if (response.status === 404) {
      throw new Error(`Repository not found. Please check the URL and ensure the repo is accessible.`);
    }
    if (response.status === 403 && message.includes('rate limit')) {
      throw new Error(`GitHub API rate limit exceeded. Please provide a GitHub token or wait before retrying.`);
    }
    if (response.status === 401) {
      throw new Error(`Authentication failed. Please check your GitHub token.`);
    }

    throw new Error(`GitHub API error (${response.status}): ${message}`);
  }

  return response.json();
}

/**
 * Fetches repository details.
 * @param {string} owner - Repository owner
 * @param {string} repo  - Repository name
 * @param {string} [token]
 * @returns {Promise<Object>} Repository data
 */
async function fetchRepoDetails(owner, repo, token) {
  return githubFetch(`/repos/${owner}/${repo}`, token);
}

/**
 * Fetches the latest commits for a repository.
 * @param {string} owner
 * @param {string} repo
 * @param {string} [token]
 * @returns {Promise<Array>} Array of commit objects
 */
async function fetchCommits(owner, repo, token) {
  return githubFetch(
    `/repos/${owner}/${repo}/commits?per_page=${config.github.perPageCommits}`,
    token
  );
}

/**
 * Fetches the contributors list for a repository.
 * @param {string} owner
 * @param {string} repo
 * @param {string} [token]
 * @returns {Promise<Array>} Array of contributor objects
 */
async function fetchContributors(owner, repo, token) {
  return githubFetch(
    `/repos/${owner}/${repo}/contributors?per_page=${config.github.perPageContributors}`,
    token
  );
}

/**
 * Fetches the full file tree for a repository (recursive).
 * Uses the default branch's tree SHA.
 * @param {string} owner
 * @param {string} repo
 * @param {string} defaultBranch - The repo's default branch name
 * @param {string} [token]
 * @returns {Promise<Array>} Array of tree entry objects
 */
async function fetchFileTree(owner, repo, defaultBranch, token) {
  const data = await githubFetch(
    `/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
    token
  );
  return data.tree || [];
}

/**
 * Fetches all repository data in parallel.
 * @param {string} owner
 * @param {string} repo
 * @param {string} [token]
 * @returns {Promise<Object>} Combined data: { repo, commits, contributors, files }
 */
async function fetchAllRepoData(owner, repo, token) {
  // First, get repo details to know the default branch
  const repoData = await fetchRepoDetails(owner, repo, token);

  // Then fetch commits, contributors, and file tree in parallel
  const [commits, contributors, files] = await Promise.all([
    fetchCommits(owner, repo, token).catch((err) => {
      console.warn(`⚠ Could not fetch commits: ${err.message}`);
      return [];
    }),
    fetchContributors(owner, repo, token).catch((err) => {
      console.warn(`⚠ Could not fetch contributors: ${err.message}`);
      return [];
    }),
    fetchFileTree(owner, repo, repoData.default_branch, token).catch((err) => {
      console.warn(`⚠ Could not fetch file tree: ${err.message}`);
      return [];
    }),
  ]);

  return { repo: repoData, commits, contributors, files };
}

module.exports = {
  fetchRepoDetails,
  fetchCommits,
  fetchContributors,
  fetchFileTree,
  fetchAllRepoData,
};
