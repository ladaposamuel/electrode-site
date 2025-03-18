import { ReactNode } from 'react';

interface AboutCardProps {
  title: string;
  children: ReactNode;
  gradient?: string;
}

export function AboutCard({ title, children, gradient }: AboutCardProps) {
  const backgroundStyle = gradient
    ? { backgroundImage: gradient }
    : {};

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
      style={backgroundStyle}
    >
      <div className={gradient ? "relative z-10 text-white" : ""}>
        <h3 className="font-medium mb-4">{title}</h3>
        {children}
      </div>
      {gradient && (
        <div className="absolute inset-0 bg-black/20" />
      )}
    </div>
  );
}
