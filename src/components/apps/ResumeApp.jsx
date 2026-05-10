import { memo, useState } from 'react';

const RESUME_FILENAME = 'Aaradhya_Mehra_Resume.pdf';
const RESUME_PATH = `/${RESUME_FILENAME}`;

function downloadResume() {
  const link = document.createElement('a');
  link.href = RESUME_PATH;
  link.download = RESUME_FILENAME;
  link.click();
}

function ResumeAppComponent() {
  const [loadError, setLoadError] = useState(false);

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

      <div className="resume-viewer-shell">
        {!loadError ? (
          <iframe
            src={RESUME_PATH}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              display: 'block',
              background: '#ffffff',
            }}
            title="Aaradhya Mehra Resume"
            onError={() => setLoadError(true)}
          />
        ) : null}

        {loadError ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>📄</span>
            <p
              style={{
                color: '#64748b',
                fontFamily: 'JetBrains Mono',
                fontSize: '13px',
              }}
            >
              Resume PDF not found.
            </p>
            <p
              style={{
                color: '#374151',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
              }}
            >
              Place Aaradhya_Mehra_Resume.pdf in the public/ folder.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const ResumeApp = memo(ResumeAppComponent);
