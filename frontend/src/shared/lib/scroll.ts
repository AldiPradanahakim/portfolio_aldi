/**
 * Remembers and recalls scroll positions per history entry, so navigation back to a visited
 * page (POP) restores where the user had scrolled. The window position is captured at the
 * call site via `window.scrollY` — no listener lives here.
 */
const positions = new Map<string, number>();

export const rememberScroll = (key: string, y: number) => {
  positions.set(key, y);
};

/** Null when this history entry was never visited, so a fresh load is left alone. */
export const recallScroll = (key: string): number | null => positions.get(key) ?? null;
