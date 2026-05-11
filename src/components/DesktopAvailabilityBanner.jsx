import { motion } from 'framer-motion';

export function DesktopAvailabilityBanner({ email, onDismiss }) {
  return (
    <motion.div
      className="desktop-availability-banner"
      initial={{ y: -32 }}
      animate={{ y: 0 }}
      exit={{ y: -32, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="desktop-availability-banner-section desktop-availability-banner-left">
        <span className="desktop-availability-banner-dot" aria-hidden="true" />
        <span className="desktop-availability-banner-status">OPEN TO WORK</span>
      </div>

      <div className="desktop-availability-banner-section desktop-availability-banner-center">
        <span className="desktop-availability-banner-primary">AI/ML Engineering &amp; SWE Internships</span>
        <span className="desktop-availability-banner-separator" aria-hidden="true">
          {'\u00b7'}
        </span>
        <span className="desktop-availability-banner-secondary">Bengaluru {'\u00b7'} Remote</span>
      </div>

      <div className="desktop-availability-banner-section desktop-availability-banner-right">
        <button
          type="button"
          className="desktop-availability-banner-email"
          onClick={() => window.open(`mailto:${email}`, '_blank')}
        >
          {'\u{1F4EC}'} {email}
        </button>

        <span className="desktop-availability-banner-divider" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          className="desktop-availability-banner-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss availability banner"
        >
          {'\u00d7'}
        </button>
      </div>
    </motion.div>
  );
}
