'use client';

import { useEffect } from 'react';
import { increment } from 'app/actions';

export default function ViewCounter({
  slug,
  allViews,
  trackView,
}: {
  slug: string;
  allViews: { slug: string; count?: number }[];
  trackView?: boolean;
}) {
  const viewsForSlug = allViews.find((view) => view.slug === slug);
  const count = viewsForSlug?.count || 0;
  const verb = count === 1 ? 'view' : 'views';

  useEffect(() => {
    if (trackView) {
      increment(slug, slug);
    }
  }, [trackView, slug]);

  return (
    <p className="text-sm text-neutral-600 dark:text-neutral-400">
      {`${count.toLocaleString()} ${verb}`}
    </p>
  );
}
