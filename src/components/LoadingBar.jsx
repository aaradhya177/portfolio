export function LoadingBar({ progress, message }) {
  return (
    <section className="loading-screen" aria-label="System loading screen">
      <div className="loading-panel">
        <h1 className="loading-title">AaradhyaOS</h1>

        <div className="loading-bar-frame" aria-hidden="true">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="loading-status">{message}</p>
      </div>
    </section>
  );
}
