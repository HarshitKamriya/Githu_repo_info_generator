import './ErrorBanner.css';

/**
 * ErrorBanner — Displays an error message with a dismiss button.
 * @param {Object} props
 * @param {string}   props.message   - Error message text
 * @param {Function} props.onDismiss - Callback to hide the banner
 */
function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="error-banner" role="alert">
      <svg className="error-banner__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      <span className="error-banner__text">{message}</span>
      <button className="error-banner__close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export default ErrorBanner;
