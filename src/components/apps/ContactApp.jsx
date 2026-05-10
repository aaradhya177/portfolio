import { memo, useMemo, useState } from 'react';
import { profile } from '../../data/profile';

const QUICK_LINKS = [
  { id: 'email', icon: '\u2709', label: 'Email', href: `mailto:${profile.email}` },
  { id: 'linkedin', icon: '\u{1F4BC}', label: 'LinkedIn', href: profile.linkedinUrl },
  { id: 'github', icon: '\u{1F419}', label: 'GitHub', href: profile.githubUrl },
  { id: 'codeforces', icon: '\u{265F}', label: 'Codeforces', href: profile.codeforcesUrl },
];

export const ContactApp = memo(function ContactApp() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const mailtoHref = useMemo(() => {
    const params = new URLSearchParams({
      subject,
      body: message,
    });
    return `mailto:${profile.email}?${params.toString()}`;
  }, [message, subject]);

  return (
    <div className="contact-app">
      <aside className="contact-sidebar app-scroll">
        <div className="contact-sidebar-heading">Quick Links</div>

        <div className="contact-links-list">
          {QUICK_LINKS.map((linkItem) => (
            <a
              key={linkItem.id}
              className="contact-link-item"
              href={linkItem.href}
              target={linkItem.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={linkItem.href.startsWith('mailto:') ? undefined : 'noreferrer'}
            >
              <span className="contact-link-icon" aria-hidden="true">
                {linkItem.icon}
              </span>
              <span>{linkItem.label}</span>
            </a>
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
          className="contact-send-button"
          onClick={() => {
            window.location.href = mailtoHref;
          }}
        >
          Send
        </button>
      </section>
    </div>
  );
});
