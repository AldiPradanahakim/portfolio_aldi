import { cx } from '../lib/cn';

interface IMacFrameProps {
  /** screenshot shown inside the display; null renders the initials placeholder instead */
  src: string | null;
  alt: string;
  initials: string;
  className?: string;
}

/**
 * A product screenshot mounted in an iMac, using the transparent cutout in
 * `public/images/imac-frame.png`: the display is a real hole in that PNG (alpha 0), so the
 * screenshot sits *behind* the hardware and the bezel frames it — no CSS bezel guessing at the
 * aluminium gradient.
 *
 * The window percentages were measured off the asset (display hole bbox ÷ device bbox), so the
 * screenshot lands in the glass at every size instead of drifting when the card grows.
 */
export function IMacFrame({ src, alt, initials, className }: IMacFrameProps) {
  return (
    <div className={cx('imac', className)}>
      <div className="imac-screen">
        {src ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        ) : (
          <span aria-hidden="true" className="imac-fallback">
            {initials.toUpperCase()}
          </span>
        )}
      </div>
      {/* decorative: the screen inside carries the alt text, so the body is not announced twice */}
      <img
        src="/images/imac-frame.png"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="imac-body"
      />
    </div>
  );
}