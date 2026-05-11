import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const COPY_TIMEOUT_MS = 2500;

function fallbackCopyToClipboard(value) {
  const input = document.createElement('input');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  input.style.pointerEvents = 'none';
  input.style.left = '-9999px';

  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, value.length);

  const copied = document.execCommand('copy');
  document.body.removeChild(input);

  return copied;
}

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showCopiedState = () => {
    setCopied(true);
    setShowToast(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      setShowToast(false);
      timeoutRef.current = null;
    }, COPY_TIMEOUT_MS);
  };

  const handleClick = async (event) => {
    event.stopPropagation();

    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showCopiedState();
        return;
      }

      if (fallbackCopyToClipboard(url)) {
        showCopiedState();
      }
    } catch {
      if (fallbackCopyToClipboard(url)) {
        showCopiedState();
      }
    }
  };

  return (
    <>
      <button type="button" className="share-portfolio-button" onClick={handleClick}>
        <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
        <span>{copied ? 'Copied!' : 'Share Portfolio'}</span>
      </button>

      <AnimatePresence>
        {showToast ? (
          <div className="share-portfolio-toast-shell">
            <motion.div
              key="share-toast"
              className="share-portfolio-toast"
              role="status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              ✓ Portfolio link copied to clipboard
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
