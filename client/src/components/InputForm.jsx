import { useState } from 'react';
import './InputForm.css';

/**
 * InputForm — URL input, optional token, and generate button.
 * @param {Object} props
 * @param {Function} props.onGenerate - Callback: (repoUrl, token) => void
 * @param {boolean}  props.loading    - Whether a request is in progress
 */
function InputForm({ onGenerate, loading }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    onGenerate(repoUrl.trim(), token.trim());
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      {/* Repository URL */}
      <div className="form-group">
        <label htmlFor="repoUrl" className="form-label">Repository URL</label>
        <input
          type="text"
          id="repoUrl"
          className="form-input"
          placeholder="https://github.com/owner/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          disabled={loading}
        />
      </div>

      {/* Token Toggle */}
      <div className="token-section">
        <button
          type="button"
          className="token-toggle"
          onClick={() => setShowToken(!showToken)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          GitHub Token
          <span className="token-badge">Optional</span>
          <svg
            className={`token-chevron ${showToken ? 'token-chevron--open' : ''}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showToken && (
          <div className="token-body">
            <input
              type="password"
              id="githubToken"
              className="form-input form-input--mono"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              disabled={loading}
            />
            <p className="token-hint">
              Needed for private repos. Increases API rate limit from 60 to 5,000 requests/hr.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary" disabled={loading || !repoUrl.trim()}>
        {loading ? (
          <>
            <span className="spinner" />
            Generating…
          </>
        ) : (
          'Generate Info'
        )}
      </button>
    </form>
  );
}

export default InputForm;
