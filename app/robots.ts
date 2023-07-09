export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: 'https://electrode.dev/sitemap.xml',
    host: 'https://electrode.dev',
  };
}
