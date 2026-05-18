/**
 * URL Parser Utility
 * Extracts owner and repo name from various GitHub URL formats.
 */

/**
 * Parses a GitHub repository URL and extracts the owner and repo name.
 * Supports formats:
 *   - https://github.com/owner/repo
 *   - https://github.com/owner/repo.git
 *   - http://github.com/owner/repo
 *   - github.com/owner/repo
 *   - owner/repo
 *
 * @param {string} url - The GitHub repository URL or shorthand
 * @returns {{ owner: string, repo: string }} Parsed owner and repo
 * @throws {Error} If the URL format is invalid
 */
function parseGitHubUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Repository URL is required.');
  }

  const trimmed = url.trim().replace(/\/+$/, ''); // Remove trailing slashes

  // Pattern: full URL — https://github.com/owner/repo(.git)?
  const fullUrlPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+?)(?:\.git)?$/;
  const fullMatch = trimmed.match(fullUrlPattern);

  if (fullMatch) {
    return { owner: fullMatch[1], repo: fullMatch[2] };
  }

  // Pattern: shorthand — owner/repo
  const shorthandPattern = /^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/;
  const shortMatch = trimmed.match(shorthandPattern);

  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2] };
  }

  throw new Error(
    'Invalid GitHub URL format. Expected: https://github.com/owner/repo or owner/repo'
  );
}

module.exports = { parseGitHubUrl };
