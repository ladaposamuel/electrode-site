'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { clap } from 'app/actions';

const MAX_CLAPS = 50;
const FLUSH_DELAY = 600;

/**
 * Medium-style applause button shown at the end of an article.
 *
 * The total and the per-reader tally are authoritative on the server: identity is a
 * server-set httpOnly cookie (with a hashed-IP secondary limit), so the 50-cap is
 * enforced in the `clap` server action rather than in the browser. `initialUserClaps`
 * is read from that cookie at render time, so the "X/MAX" label reflects server truth
 * across reloads and devices. Taps update optimistically; a debounced, serialized
 * flush sends the accumulated delta and reconciles against the counts the server
 * returns once the reader stops tapping.
 */
export default function ClapButton({
  slug,
  title,
  allClaps,
  initialUserClaps,
}: {
  slug: string;
  title: string;
  allClaps: { slug: string; count?: number }[];
  initialUserClaps: number;
}) {
  const serverCount = allClaps.find((c) => c.slug === slug)?.count ?? 0;

  const [total, setTotal] = useState(serverCount);
  const [userClaps, setUserClaps] = useState(initialUserClaps);
  const [burst, setBurst] = useState(false);

  const pendingRef = useRef(0);
  const userClapsRef = useRef(initialUserClaps);
  const flushingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      void flush();
    }, FLUSH_DELAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flush = useCallback(async () => {
    // Serialize writes so the first clap can set the identity cookie before any
    // follow-up request runs, avoiding a duplicate identity for the same reader.
    if (flushingRef.current) {
      return;
    }
    const delta = pendingRef.current;
    if (delta <= 0) {
      return;
    }
    pendingRef.current = 0;
    flushingRef.current = true;
    try {
      const result = await clap(title, slug, delta);
      // Reconcile to server truth only once the reader has stopped tapping, so
      // in-flight optimistic clicks are not clobbered mid-burst.
      if (result && pendingRef.current === 0) {
        setTotal(result.total);
        setUserClaps(result.userClaps);
        userClapsRef.current = result.userClaps;
      }
    } catch (error) {
      console.error('Failed to persist claps:', error);
      // Re-queue the unsent claps so the next flush retries them.
      pendingRef.current += delta;
    } finally {
      flushingRef.current = false;
    }
    if (pendingRef.current > 0) {
      scheduleFlush();
    }
  }, [slug, title, scheduleFlush]);

  // Best-effort flush of unsent claps when the reader leaves, backgrounds the tab, or
  // the component unmounts, so optimistic claps survive a quick exit before the debounce.
  useEffect(() => {
    const handleHide = () => {
      void flush();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        void flush();
      }
    };
    window.addEventListener('pagehide', handleHide);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pagehide', handleHide);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      void flush();
    };
  }, [flush]);

  const handleClap = () => {
    if (userClapsRef.current >= MAX_CLAPS) {
      return;
    }
    userClapsRef.current += 1;
    pendingRef.current += 1;
    setUserClaps(userClapsRef.current);
    setTotal((t) => t + 1);

    setBurst(true);
    window.setTimeout(() => setBurst(false), 250);

    scheduleFlush();
  };

  const atMax = userClaps >= MAX_CLAPS;

  const subtitle = atMax
    ? 'Thanks for the applause!'
    : userClaps === 0
    ? 'Tap to clap'
    : `${userClaps}/${MAX_CLAPS} from you`;

  return (
    <div className="mt-12 flex flex-col items-center gap-3 border-t border-neutral-200 dark:border-neutral-800 pt-10">
      <button
        type="button"
        onClick={handleClap}
        disabled={atMax}
        aria-label={atMax ? 'Maximum claps reached' : 'Clap for this post'}
        className={[
          'relative inline-flex h-16 w-16 items-center justify-center rounded-full border text-2xl transition-all',
          'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 active:scale-95',
          'dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800',
          atMax ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-105',
        ].join(' ')}
      >
        <span className={['transition-transform', burst ? 'scale-125' : 'scale-100'].join(' ')}>
          👏
        </span>
      </button>

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {total.toLocaleString()} {total === 1 ? 'clap' : 'claps'}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}
