<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const siteUrl = config.public.siteUrl.replace(/\/$/, "");
const canonicalUrl = computed(() => {
  const path = route.path === "/" ? "/" : route.path;
  return `${siteUrl}${path}`;
});

useSeoMeta({
  title: "Ouru Text to PDF",
  description: config.public.siteDescription,
  applicationName: config.public.siteName,
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogType: "website",
  ogSiteName: config.public.siteName,
  ogTitle: "Ouru Text to PDF",
  ogDescription: config.public.siteDescription,
  ogUrl: canonicalUrl,
  ogImageAlt: "Ouru Text to PDF interface preview",
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
  twitterTitle: "Ouru Text to PDF",
  twitterDescription: config.public.siteDescription
});

useHead({
  link: [
    { rel: "canonical", href: canonicalUrl },
    { rel: "alternate", hreflang: "en", href: canonicalUrl }
  ],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            name: "Ouru",
            url: siteUrl
          },
          {
            "@type": "WebSite",
            name: config.public.siteName,
            url: siteUrl,
            inLanguage: "en-US"
          },
          {
            "@type": "SoftwareApplication",
            name: "Ouru Text to PDF",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            },
            description: config.public.siteDescription,
            url: siteUrl
          }
        ]
      })
    }
  ]
});
</script>

<template>
  <UApp>
    <div class="tool-page">
      <header class="tool-header">
        <div class="tool-brand">
          <span class="tool-mark">O</span>
          <div>
            <p class="tool-name">Ouru</p>
            <p class="tool-subtitle">Text to PDF / Word</p>
          </div>
        </div>
      </header>
      <main class="tool-main">
        <section class="tool-intro">
          <h1>Convert text to PDF or DOCX</h1>
          <p>Paste your content, choose format and page size, then download instantly.</p>
        </section>
        <section class="tool-card-wrap">
          <ConversionPanel />
        </section>
      </main>
      <footer class="tool-footer">
        <p>Client-side conversion. Nothing is uploaded.</p>
      </footer>
    </div>
  </UApp>
</template>
