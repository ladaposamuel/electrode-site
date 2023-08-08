'use client';

import { useEffect } from 'react';
import { increment } from 'app/actions';

export default function ViewCounter({
  post,
  allViews,
  trackView,
}: {
  post: {
    slug: string;
    structuredData: {
      headline: string;
    };
  };
  allViews: {
    slug: string;
    count: number;
  }[];
  trackView?: boolean;
}) {
  const { slug, structuredData } = post;
  const { headline } = structuredData;

  const viewsForSlug = allViews.find((view) => view.slug === slug);
  const count = viewsForSlug?.count || 0;
  const verb = count === 1 ? 'view' : 'views';

  useEffect(() => {
    if (trackView) {
      increment(headline, slug);
    }
  }, [trackView, headline, slug]);

  return (
    <p className="font-mono text-sm text-neutral-500 tracking-tighter">
      {`${count.toLocaleString()} ${verb}`}
    </p>
  );
}
