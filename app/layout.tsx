import "./global.css";
import clsx from "clsx";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Sidebar from "./components/sidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jetbrainsMono = localFont({
  src: [
    {
      path: "../public/fonts/jetbrains/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/jetbrains/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    // Add more variations as needed
  ],
  variable: "--font-jetbrains-mono",
});

// const kaisei = localFont({
//   src: "../public/fonts/kaisei-tokumin-latin-700-normal.woff2",
//   weight: "700",
//   variable: "--font-kaisei",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: {
    default: "Samuel Ladapo",
    template: "%s | Samuel Ladapo",
  },
  description: "Developer, writer, and creator.",
  openGraph: {
    title: "Samuel Ladapo",
    description: "Developer, writer, and creator.",
    url: "https://electrode.dev",
    siteName: "Samuel Ladapo",
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Samuel Ladapo",
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://electrode.dev/api/blog/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        "text-black bg-white dark:text-white dark:bg-[#111010]",
        jetbrainsMono.variable
      )}
    >
      <body className="antialiased max-w-4xl mb-40 flex flex-col md:flex-row mx-4 mt-8 md:mt-20 lg:mt-32 lg:mx-auto">
        <Sidebar />
        <main className="flex-auto min-w-0 mt-6 md:mt-0 flex flex-col px-2 md:px-0">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
