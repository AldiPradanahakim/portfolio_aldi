import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  labels: { dialog: string; close: string; previous: string; next: string };
}

export function Lightbox({ images, index, onClose, onIndexChange, labels }: LightboxProps) {
  const open = index !== null;
  const reduced = usePrefersReducedMotion();
  const dialogRef = useFocusTrap<HTMLDivElement>(open, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % images.length);
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, images.length, onIndexChange]);

  const current = index === null ? null : images[index];

  return (
    // reducedMotion="user" makes framer follow the OS setting, but framer keeps opacity
    // animations even then, so the transition duration is also zeroed when reduced.
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4 sm:p-8"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.16, ease: 'easeOut' }}
            onClick={onClose}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={labels.dialog}
              className="flex w-full max-w-5xl flex-col gap-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-small text-chalk-muted">
                  {(index ?? 0) + 1} / {images.length}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={labels.close}
                  className="press rounded-full border border-ink-700 p-2 text-chalk-muted hover:text-chalk"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <img
                src={current.src}
                alt={current.alt}
                width={1200}
                height={750}
                decoding="async"
                className="w-full rounded-2xl border border-media-ring bg-media"
              />

              {images.length > 1 && (
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onIndexChange((index! - 1 + images.length) % images.length)}
                    className="press inline-flex items-center gap-2 rounded-full border border-ink-700 px-4 py-2 text-small text-chalk-muted hover:border-ink-600 hover:text-chalk"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    {labels.previous}
                  </button>
                  <button
                    type="button"
                    onClick={() => onIndexChange((index! + 1) % images.length)}
                    className="press inline-flex items-center gap-2 rounded-full border border-ink-700 px-4 py-2 text-small text-chalk-muted hover:border-ink-600 hover:text-chalk"
                  >
                    {labels.next}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
