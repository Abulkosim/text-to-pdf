<template>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <UBadge color="gray" variant="soft" class="pill">Precision conversion for Ouru text</UBadge>
        <h1>
          Turn Ouru text into
          <span class="text-primary">pixel-clean PDFs</span>
          or Word files.
        </h1>
        <p>
          Convert Your Ouru text into polished PDF or Word files with clean, professional settings.
        </p>
        <div class="hero-meta">
          <div>
            <div class="meta-label">Formats</div>
            <div class="meta-value">PDF, DOCX</div>
          </div>
          <div>
            <div class="meta-label">Avg render</div>
            <div class="meta-value">0.8s</div>
          </div>
          <div>
            <div class="meta-label">Compliance</div>
            <div class="meta-value">SOC 2 ready</div>
          </div>
        </div>
      </div>

      <ConversionPanel ref="conversionPanelRef" />
    </div>
  </section>
</template>
