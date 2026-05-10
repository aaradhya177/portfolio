import { memo, useState } from 'react';

const RESUME_FILENAME = 'Aaradhya_Mehra_Resume.pdf';
const RESUME_PATH = `/${RESUME_FILENAME}`;

function downloadResume() {
  const link = document.createElement('a');
  link.href = RESUME_PATH;
  link.download = RESUME_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function ResumeAppComponent() {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div className="resume-app">
      <div className="resume-toolbar">
        <div className="resume-toolbar-file">
          <span className="resume-toolbar-icon" aria-hidden="true">
            {'\u{1F4C4}'}
          </span>
          <span>{RESUME_FILENAME}</span>
        </div>

        <button type="button" className="resume-download-button" onClick={downloadResume}>
          Download
        </button>
      </div>

      <div
        className="resume-viewer-shell app-scroll"
        style={{
          overflowY: 'auto',
          height: 'calc(100% - 36px)',
        }}
      >
        {!loadFailed ? (
          <iframe
            src={RESUME_PATH}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              borderRadius: '0 0 10px 10px',
            }}
            title="Aaradhya Mehra Resume"
            onError={() => setLoadFailed(true)}
          />
        ) : null}

        {loadFailed ? (
          <div className="resume-fallback-message">
            <p>📄 Resume not found.</p>
            <p>Place Aaradhya_Mehra_Resume.pdf in the public/ folder.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const ResumeApp = memo(ResumeAppComponent);
