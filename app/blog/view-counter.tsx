'use client';

import { useEffect } from 'react';
import { increment } from 'app/actions';

export default function ViewCounter({
  slug,
  allViews,
  trackView,
}: {
  slug: string;
  allViews: {
    slug: string;
    count: number;
  }[];
  trackView?: boolean;
}) {
  const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
  let number = new Number(viewsForSlug?.count || 0);
  const verb = number === 1 ? 'view' : 'views';

  useEffect(() => {
    if (trackView) {
      increment(slug);
    }
  }, []);

  return (
    <p className="font-mono text-sm text-neutral-500 tracking-tighter">
      {`${number.toLocaleString()} ${verb}`}
    </p>
  );
}
