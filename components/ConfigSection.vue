<template>
  <section id="configure" class="section muted">
    <div class="container config-grid">
      <div class="config-copy">
        <p class="eyebrow">Configuration</p>
        <h2>Dial in every detail.</h2>
        <p class="section-sub">
          Control margins, page grids, headers, and output metadata. Save presets to keep
          your team aligned.
        </p>
        <div class="config-chips">
          <span class="chip">Header and footer templates</span>
          <span class="chip">Metadata fields and revision tags</span>
          <span class="chip">Typography scale and spacing</span>
        </div>
      </div>

      <div class="config-panel">
        <div class="config-row spotlight">
          <div class="config-row-copy">
            <p class="config-label">Active profile</p>
            <p class="config-value">Client Proposal v2</p>
            <p class="config-note">Sets spacing, typographic rhythm, and output metadata.</p>
          </div>
          <UButton color="neutral" variant="solid" size="xs">Apply</UButton>
        </div>
        <div class="config-row">
          <div class="config-row-copy">
            <p class="config-label">Header style</p>
            <p class="config-value">Minimal (logo left)</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Edit</UButton>
        </div>
        <div class="config-row">
          <div class="config-row-copy">
            <p class="config-label">Export quality</p>
            <p class="config-value">Print-ready 300 DPI</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Tune</UButton>
        </div>
        <div class="config-row">
          <div class="config-row-copy">
            <p class="config-label">Security</p>
            <p class="config-value">Password + watermark</p>
          </div>
          <UButton color="neutral" variant="ghost" size="xs">Manage</UButton>
        </div>
      </div>
    </div>
  </section>
</template>
