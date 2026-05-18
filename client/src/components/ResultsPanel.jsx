import { useState, useMemo } from 'react';
import { marked } from 'marked';
import './ResultsPanel.css';

/**
 * ResultsPanel — Tabbed view with rendered preview, raw markdown, and download.
 * @param {Object} props
 * @param {string} props.markdown - Raw markdown string
 * @param {string} props.repoName - e.g. "owner/repo"
 */
function ResultsPanel({ markdown, repoName }) {
  const [activeTab, setActiveTab] = useState('preview');

  // Parse markdown to HTML once (memoized)
  const renderedHtml = useMemo(() => {
    marked.setOptions({ breaks: true, gfm: true });
    return marked.parse(markdown);
  }, [markdown]);

  /** Download the markdown as a .md file */
  function handleDownload() {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'info.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** Copy raw markdown to clipboard */
  function handleCopy() {
    navigator.clipboard.writeText(markdown);
  }

  return (
    <section className="results-panel">
      {/* Tab Bar */}
      <div className="results-tabs">
        <div className="results-tabs__left">
          <button
            className={`results-tab ${activeTab === 'preview' ? 'results-tab--active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`results-tab ${activeTab === 'raw' ? 'results-tab--active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Markdown
          </button>
        </div>
        <div className="results-tabs__right">
          <button className="btn-secondary" onClick={handleCopy} title="Copy to clipboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy
          </button>
          <button className="btn-success" onClick={handleDownload}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Panels */}
      <div className="results-content">
        {activeTab === 'preview' ? (
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <pre className="raw-view"><code>{markdown}</code></pre>
        )}
      </div>
    </section>
  );
}

export default ResultsPanel;
