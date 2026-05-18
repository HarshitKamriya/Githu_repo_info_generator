import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ErrorBanner from './components/ErrorBanner';
import ResultsPanel from './components/ResultsPanel';
import './App.css';

/**
 * App — Root component.
 * Manages global state: markdown output, loading, and errors.
 */
function App() {
  const [markdown, setMarkdown] = useState('');
  const [repoName, setRepoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Calls the backend API to generate repo info.
   * @param {string} repoUrl - GitHub repository URL
   * @param {string} token   - Optional GitHub token
   */
  async function handleGenerate(repoUrl, token) {
    setError('');
    setMarkdown('');
    setRepoName('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, token: token || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate repository info.');
      }

      setMarkdown(data.markdown);
      setRepoName(data.repoName || 'repo');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="app__container">
        <Header />
        <InputForm onGenerate={handleGenerate} loading={loading} />
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
        {markdown && <ResultsPanel markdown={markdown} repoName={repoName} />}
      </div>
    </div>
  );
}

export default App;
