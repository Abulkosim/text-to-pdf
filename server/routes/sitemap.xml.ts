export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const now = new Date().toISOString();

  const pages = [{ loc: `${siteUrl}/`, changefreq: "weekly", priority: "1.0" }];

  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return xml;
});
