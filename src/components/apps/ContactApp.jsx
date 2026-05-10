import { memo, useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';

const QUICK_LINKS = [
  {
    id: 'email',
    icon: '✉',
    label: 'Email',
    onClick: () => window.open('mailto:aaradhyamehra240@gmail.com', '_blank'),
  },
  {
    id: 'linkedin',
    icon: '💼',
    label: 'LinkedIn',
    onClick: () => window.open('https://www.linkedin.com/in/aaradhyamehra-builds/', '_blank'),
  },
  {
    id: 'github',
    icon: '🐙',
    label: 'GitHub',
    onClick: () => window.open('https://github.com/aaradhya177', '_blank'),
  },
  {
    id: 'twitter',
    icon: '𝕏',
    label: 'Twitter/X',
    onClick: () => window.open('https://x.com/4aradhya_17', '_blank'),
  },
  {
    id: 'codeforces',
    icon: '♟',
    label: 'Codeforces',
    onClick: () => window.open('https://codeforces.com/profile/YoullNeverCodeAlone17', '_blank'),
  },
];

export const ContactApp = memo(function ContactApp() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [showValidationHint, setShowValidationHint] = useState(false);
  const sentTimeoutRef = useRef(0);
  const validationTimeoutRef = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(sentTimeoutRef.current);
      window.clearTimeout(validationTimeoutRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!subject.trim() && !message.trim()) {
      setShowValidationHint(true);
      window.clearTimeout(validationTimeoutRef.current);
      validationTimeoutRef.current = window.setTimeout(() => {
        setShowValidationHint(false);
      }, 2000);
      return;
    }

    const mailtoLink = `mailto:aaradhyamehra240@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailtoLink, '_blank');
    setSent(true);
    setShowValidationHint(false);

    window.clearTimeout(sentTimeoutRef.current);
    sentTimeoutRef.current = window.setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="contact-app">
      <aside className="contact-sidebar app-scroll">
        <div className="contact-sidebar-heading">Quick Links</div>

        <div className="contact-links-list">
          {QUICK_LINKS.map((linkItem) => (
            <button
              key={linkItem.id}
              type="button"
              className="contact-link-item"
              onClick={linkItem.onClick}
            >
              <span className="contact-link-icon" aria-hidden="true">
                {linkItem.icon}
              </span>
              <span>{linkItem.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <section
        className="contact-compose-panel app-scroll"
        style={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <h2 className="contact-compose-title">New Message</h2>
        <div className="contact-divider" />

        <div className="contact-field">
          <label>To:</label>
          <div className="contact-readonly-value">{profile.email}</div>
        </div>

        <div className="contact-field">
          <label htmlFor="contact-subject">Subject:</label>
          <input
            id="contact-subject"
            className="contact-input"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>

        <div className="contact-field contact-field-message">
          <label htmlFor="contact-message">Message:</label>
          <textarea
            id="contact-message"
            className="contact-textarea"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>

        <button
          type="button"
          className={`contact-send-button${sent ? ' is-sent' : ''}`}
          onClick={handleSend}
          disabled={sent}
        >
          {sent ? '✓ Message Opened in Mail' : 'Send'}
        </button>

        {showValidationHint ? (
          <div className="contact-validation-hint">Please enter a subject or message</div>
        ) : null}
      </section>
    </div>
  );
});
