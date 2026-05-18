/**
 * Markdown Formatter Utility
 * Transforms raw GitHub API data into a well-structured Markdown document.
 */

/**
 * Formats a date string into a human-readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncates a commit message to a single line.
 * @param {string} message - Full commit message
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated message
 */
function truncateMessage(message, maxLength = 80) {
  if (!message) return 'No message';
  const firstLine = message.split('\n')[0];
  return firstLine.length > maxLength
    ? firstLine.substring(0, maxLength) + '...'
    : firstLine;
}

/**
 * Builds the complete Markdown document from GitHub API data.
 *
 * @param {Object} data
 * @param {Object} data.repo       - Repository details from /repos/{owner}/{repo}
 * @param {Array}  data.commits    - Array of commit objects
 * @param {Array}  data.contributors - Array of contributor objects
 * @param {Array}  data.files      - Array of tree entries (file paths)
 * @returns {string} Complete Markdown document
 */
function buildMarkdown({ repo, commits, contributors, files }) {
  const sections = [];

  // ─── Header ──────────────────────────────────────────────
  sections.push(`# 📦 ${repo.full_name}\n`);
  sections.push(`> ${repo.description || '_No description provided._'}\n`);

  // ─── Repository Information ──────────────────────────────
  sections.push(`## 📊 Repository Information\n`);
  sections.push(`| Property | Value |`);
  sections.push(`| --- | --- |`);
  sections.push(`| **Name** | ${repo.name} |`);
  sections.push(`| **Full Name** | ${repo.full_name} |`);
  sections.push(`| **Owner** | [${repo.owner.login}](${repo.owner.html_url}) |`);
  sections.push(`| **URL** | [${repo.html_url}](${repo.html_url}) |`);
  sections.push(`| **Language** | ${repo.language || 'N/A'} |`);
  sections.push(`| **License** | ${repo.license?.spdx_id || 'N/A'} |`);
  sections.push(`| **Default Branch** | \`${repo.default_branch}\` |`);
  sections.push(`| **⭐ Stars** | ${repo.stargazers_count.toLocaleString()} |`);
  sections.push(`| **🍴 Forks** | ${repo.forks_count.toLocaleString()} |`);
  sections.push(`| **👀 Watchers** | ${repo.watchers_count.toLocaleString()} |`);
  sections.push(`| **🐛 Open Issues** | ${repo.open_issues_count.toLocaleString()} |`);
  sections.push(`| **📅 Created** | ${formatDate(repo.created_at)} |`);
  sections.push(`| **🔄 Last Updated** | ${formatDate(repo.updated_at)} |`);
  sections.push(`| **📤 Last Pushed** | ${formatDate(repo.pushed_at)} |`);
  sections.push('');

  // ─── Topics ──────────────────────────────────────────────
  if (repo.topics && repo.topics.length > 0) {
    sections.push(`## 🏷️ Topics\n`);
    sections.push(repo.topics.map((t) => `\`${t}\``).join('  '));
    sections.push('');
  }

  // ─── Latest Commit ──────────────────────────────────────
  if (commits && commits.length > 0) {
    const latest = commits[0];
    const commitAuthor = latest.commit?.author?.name || latest.author?.login || 'Unknown';
    const commitDate = formatDate(latest.commit?.author?.date);
    const commitMsg = truncateMessage(latest.commit?.message);
    const sha = latest.sha?.substring(0, 7) || 'N/A';

    sections.push(`## 🔖 Latest Commit\n`);
    sections.push(`| Property | Value |`);
    sections.push(`| --- | --- |`);
    sections.push(`| **SHA** | \`${sha}\` |`);
    sections.push(`| **Message** | ${commitMsg} |`);
    sections.push(`| **Author** | ${commitAuthor} |`);
    sections.push(`| **Date** | ${commitDate} |`);
    sections.push('');
  }

  // ─── Commit History ─────────────────────────────────────
  if (commits && commits.length > 0) {
    sections.push(`## 📜 Commit History (Latest ${commits.length})\n`);
    sections.push(`| # | SHA | Message | Author | Date |`);
    sections.push(`| --- | --- | --- | --- | --- |`);

    commits.forEach((c, i) => {
      const sha = c.sha?.substring(0, 7) || 'N/A';
      const msg = truncateMessage(c.commit?.message, 60);
      const author = c.commit?.author?.name || c.author?.login || 'Unknown';
      const date = c.commit?.author?.date
        ? new Date(c.commit.author.date).toLocaleDateString('en-US')
        : 'N/A';
      sections.push(`| ${i + 1} | \`${sha}\` | ${msg} | ${author} | ${date} |`);
    });
    sections.push('');
  }

  // ─── Contributors ───────────────────────────────────────
  if (contributors && contributors.length > 0) {
    sections.push(`## 👥 Contributors (${contributors.length})\n`);
    sections.push(`| # | Avatar | Username | Contributions |`);
    sections.push(`| --- | --- | --- | --- |`);

    contributors.forEach((c, i) => {
      const avatar = c.avatar_url ? `<img src="${c.avatar_url}" width="30" height="30">` : '—';
      const login = c.login ? `[@${c.login}](https://github.com/${c.login})` : 'Unknown';
      sections.push(`| ${i + 1} | ${avatar} | ${login} | ${c.contributions || 0} |`);
    });
    sections.push('');
  }

  // ─── File Tree ──────────────────────────────────────────
  if (files && files.length > 0) {
    sections.push(`## 📁 File Tree\n`);
    sections.push('```');

    // Build a visual tree structure
    const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));
    sortedFiles.forEach((f) => {
      const depth = f.path.split('/').length - 1;
      const indent = '│   '.repeat(depth);
      const prefix = f.type === 'tree' ? '📂 ' : '📄 ';
      const name = f.path.split('/').pop();
      sections.push(`${indent}├── ${prefix}${name}`);
    });

    sections.push('```');
    sections.push('');
  }

  // ─── Footer ─────────────────────────────────────────────
  sections.push(`---`);
  sections.push(
    `*Generated by [Repo Info Generator](https://github.com) on ${formatDate(new Date().toISOString())}*`
  );

  return sections.join('\n');
}

module.exports = { buildMarkdown };
