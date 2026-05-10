import { useEffect } from 'react';

export function LoginScreen({ isExiting, onLogin }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLogin]);

  return (
    <section className={`login-screen${isExiting ? ' is-exiting' : ''}`} aria-label="Login screen">
      <button type="button" className="login-card" onClick={onLogin} aria-label="Log in to AaradhyaOS">
        <div className="login-avatar" aria-hidden="true">
          <span>AM</span>
        </div>

        <div className="login-name">Aaradhya Mehra</div>

        <div className="password-dots" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="password-dot" />
          ))}
        </div>

        <div className="login-hint">Press Enter to Login</div>
      </button>
    </section>
  );
}
