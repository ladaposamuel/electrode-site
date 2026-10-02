'use client';

import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

const USER = 'hello';
const DOMAIN = ['electrode', 'dev'];

/**
 * Keeps the address out of the server-rendered HTML so scrapers reading the page
 * source never see it. The parts are only joined in the browser after mount, and the
 * mailto link is opened on click instead of sitting in an href.
 */
export function CopyEmail() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEmail(`${USER}@${DOMAIN.join('.')}`);
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function openMail() {
    window.location.href = `mailto:${email}`;
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
      <div>
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Best way to reach me
        </p>
        <p className="mt-1 h-7 text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {email}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={copy}
          disabled={!email}
          className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={openMail}
          disabled={!email}
          className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white transition-opacity hover:opacity-85 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Email me
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
