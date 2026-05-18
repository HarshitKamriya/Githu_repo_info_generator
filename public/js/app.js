/**
 * Repo Info Generator — Frontend Application Logic
 * Handles UI interactions, API calls, tab switching, and file download.
 */

// ─── State ──────────────────────────────────────────────────
let currentMarkdown = '';
let currentRepoName = '';

// ─── DOM References ─────────────────────────────────────────
const repoUrlInput    = document.getElementById('repoUrl');
const tokenInput      = document.getElementById('githubToken');
const tokenSection    = document.querySelector('.token-section');
const tokenContent    = document.getElementById('tokenContent');
const generateBtn     = document.getElementById('generateBtn');
const btnText         = document.getElementById('btnText');
const btnLoader       = document.getElementById('btnLoader');
const errorToast      = document.getElementById('errorToast');
const errorMessage    = document.getElementById('errorMessage');
const resultsSection  = document.getElementById('resultsSection');
const markdownPreview = document.getElementById('markdownPreview');
const rawMarkdown     = document.getElementById('rawMarkdown');
const tabPreview      = document.getElementById('tabPreview');
const tabRaw          = document.getElementById('tabRaw');
const panelPreview    = document.getElementById('panelPreview');
const panelRaw        = document.getElementById('panelRaw');

// ─── Allow Enter key to trigger generate ────────────────────
repoUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') generateInfo();
});

// ─── Toggle Token Section ───────────────────────────────────
function toggleToken() {
  tokenSection.classList.toggle('open');
}

// ─── Show Error Toast ───────────────────────────────────────
function showError(message) {
  errorMessage.textContent = message;
  errorToast.hidden = false;
  // Auto-hide after 8 seconds
  setTimeout(() => { errorToast.hidden = true; }, 8000);
}

// ─── Hide Error Toast ───────────────────────────────────────
function hideError() {
  errorToast.hidden = true;
}

// ─── Set Loading State ──────────────────────────────────────
function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  btnText.hidden = isLoading;
  btnLoader.hidden = !isLoading;
}

// ─── Generate Info (Main Action) ────────────────────────────
async function generateInfo() {
  const repoUrl = repoUrlInput.value.trim();
  const token = tokenInput.value.trim();

  // Validate input
  if (!repoUrl) {
    showError('Please enter a GitHub repository URL.');
    repoUrlInput.focus();
    return;
  }

  hideError();
  setLoading(true);
  resultsSection.hidden = true;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl, token: token || undefined }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to generate repository info.');
    }

    // Store the result
    currentMarkdown = data.markdown;
    currentRepoName = data.repoName || 'repo';

    // Render preview
    renderPreview(currentMarkdown);

    // Show raw markdown
    rawMarkdown.textContent = currentMarkdown;

    // Show results section with animation
    resultsSection.hidden = false;
    resultsSection.style.animation = 'none';
    resultsSection.offsetHeight; // trigger reflow
    resultsSection.style.animation = 'fadeInUp 0.5s ease-out';

    // Switch to preview tab
    switchTab('preview');

  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

// ─── Render Markdown Preview ────────────────────────────────
function renderPreview(markdown) {
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    markdownPreview.innerHTML = marked.parse(markdown);
  } else {
    // Fallback: show raw text if marked.js fails to load
    markdownPreview.textContent = markdown;
  }
}

// ─── Switch Tabs ────────────────────────────────────────────
function switchTab(tab) {
  if (tab === 'preview') {
    tabPreview.classList.add('tab--active');
    tabRaw.classList.remove('tab--active');
    panelPreview.hidden = false;
    panelRaw.hidden = true;
  } else {
    tabRaw.classList.add('tab--active');
    tabPreview.classList.remove('tab--active');
    panelRaw.hidden = false;
    panelPreview.hidden = true;
  }
}

// ─── Download File ──────────────────────────────────────────
function downloadFile() {
  if (!currentMarkdown) return;

  const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'info.md';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
