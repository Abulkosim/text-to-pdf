<template>
  <section id="configure" class="section muted">
    <div class="container config-grid">
      <div>
        <p class="eyebrow">Configuration</p>
        <h2>Dial in every detail.</h2>
        <p class="section-sub">
          Control margins, page grids, headers, and output metadata. Save presets to keep
          your team aligned.
        </p>
        <div class="list">
          <div class="list-item">
            <span class="dot"></span>
            <span>Editable header and footer templates</span>
          </div>
          <div class="list-item">
            <span class="dot"></span>
            <span>Metadata fields for authors, tags, and revisions</span>
          </div>
          <div class="list-item">
            <span class="dot"></span>
            <span>Line-height control with typographic scale</span>
          </div>
        </div>
      </div>

      <div class="config-panel">
        <div class="config-row">
          <div>
            <p class="config-label">Margin preset</p>
            <p class="config-value">Compact</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Change</UButton>
        </div>
        <div class="config-row">
          <div>
            <p class="config-label">Header style</p>
            <p class="config-value">Minimal (logo left)</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Edit</UButton>
        </div>
        <div class="config-row">
          <div>
            <p class="config-label">Export quality</p>
            <p class="config-value">Print-ready 300 DPI</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Tune</UButton>
        </div>
        <div class="config-row">
          <div>
            <p class="config-label">Security</p>
            <p class="config-value">Password + watermark</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Manage</UButton>
        </div>
      </div>
    </div>
  </section>
</template>
