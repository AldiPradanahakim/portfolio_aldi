import type { CSSProperties, ElementType } from 'react';
import { useInView } from './useInView';

interface SplitTextProps {
  text: string;
  /** element to render; defaults to a <span> */
  as?: ElementType;
  /** word-level or character-level masks */
  mode?: 'word' | 'char';
  className?: string;
  /** base delay in milliseconds before the first token */
  delay?: number;
  /** per-token stagger in milliseconds */
  stagger?: number;
  /** gate the reveal on an external condition */
  active?: boolean;
  /** passed through when the split text itself is the labelled element, e.g. an <h2> */
  id?: string;
}

/**
 * Word/char rise-from-mask reveal, driven by one CSS transition.
 *
 * The animation-library version could pin a heading at `opacity: 0` permanently: `initial` was
 * re-evaluated on every render, so StrictMode's double mount re-applied the hidden value after
 * the observer had already fired, and nothing retried. A heading that never appears is far worse
 * than a heading with no animation, so the hidden state now lives in the stylesheet and a single
 * `data-show` attribute releases it. Worst case: the text appears instantly.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  mode = 'word',
  className,
  delay = 0,
  stagger = 55,
  active = true,
  id,
}: SplitTextProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ once: false, threshold: 0 });
  const show = active && inView;
  const words = text.split(' ');
  let step = 0;

  const token = (content: string, key: string) => {
    const index = step++;
    return (
      <span key={key} className="st-word" aria-hidden="true">
        <span className="st-line">
          <span
            className="st-inner"
            style={{ '--st-delay': `${(delay + index * stagger) / 1000}s` } as CSSProperties}
          >
            {content}
          </span>
        </span>
      </span>
    );
  };

  return (
    <Tag id={id} aria-label={text} className={className}>
      <span ref={ref} className="st-root" data-show={show}>
        <span className="sr-only">{text}</span>
        {words.map((word, i) => (
          <span key={i}>
            {mode === 'char'
              ? Array.from(word).map((char, c) => token(char, `${i}-${c}`))
              : token(word, `${i}`)}
            {i === words.length - 1 ? null : ' '}
          </span>
        ))}
      </span>
    </Tag>
  );
}
