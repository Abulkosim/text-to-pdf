<script setup lang="ts">
import { ref } from "vue";

type Format = "PDF" | "Word (DOCX)";

const textInput = ref("");
const outputFormat = ref<Format>("PDF");
const pageSize = ref("A4");
const embedFonts = ref(true);
const includeToc = ref(false);
const fileName = ref("ouru-document");
const isConverting = ref(false);
const statusMessage = ref("");

const pageSizes: Record<string, { width: number; height: number }> = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 }
};

const sanitizeFileName = (value: string) =>
  value.trim().replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-+|-+$/g, "");

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const convertToPdf = async (content: string, name: string) => {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const { width, height } = pageSizes[pageSize.value] ?? pageSizes.A4;
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 48;
  const lineHeight = 16;

  let page = pdfDoc.addPage([width, height]);
  let cursorY = height - margin;

  const paragraphs = content.split("\n");
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > width - margin * 2) {
        if (cursorY <= margin) {
          page = pdfDoc.addPage([width, height]);
          cursorY = height - margin;
        }
        page.drawText(line, {
          x: margin,
          y: cursorY,
          size: fontSize,
          font,
          color: rgb(0.12, 0.12, 0.12)
        });
        cursorY -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      if (cursorY <= margin) {
        page = pdfDoc.addPage([width, height]);
        cursorY = height - margin;
      }
      page.drawText(line, {
        x: margin,
        y: cursorY,
        size: fontSize,
        font,
        color: rgb(0.12, 0.12, 0.12)
      });
      cursorY -= lineHeight;
    }
    cursorY -= lineHeight * 0.4;
  }

  if (!embedFonts.value) {
    // Placeholder for toggling font embedding; PDF-lib embeds standard fonts by default.
  }

  const pdfBytes = await pdfDoc.save();
  downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), `${name}.pdf`);
};

const convertToDocx = async (content: string, name: string) => {
  const { Document, Packer, Paragraph, TextRun, TableOfContents } = await import("docx");
  const paragraphs = content.split("\n").map((line) =>
    new Paragraph({
      children: [new TextRun({ text: line })]
    })
  );

  const children = includeToc.value
    ? [
        new Paragraph({ text: "Contents", heading: "Heading1" }),
        new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-5" }),
        ...paragraphs
      ]
    : paragraphs;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(
    blob,
    `${name}.docx`
  );
};

const handleConvert = async () => {
  if (!textInput.value.trim()) {
    statusMessage.value = "Add your Ouru text before converting.";
    return;
  }

  const safeName = sanitizeFileName(fileName.value || "ouru-document") || "ouru-document";
  statusMessage.value = "Converting...";
  isConverting.value = true;

  try {
    if (outputFormat.value === "PDF") {
      await convertToPdf(textInput.value, safeName);
    } else {
      await convertToDocx(textInput.value, safeName);
    }
    statusMessage.value = "Conversion complete. Your download should begin.";
  } catch (error) {
    statusMessage.value = "Conversion failed. Please try again.";
    console.error(error);
  } finally {
    isConverting.value = false;
  }
};
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="container topbar-inner">
        <div class="brand">
          <div class="brand-mark">O</div>
          <div class="brand-text">
            <span class="brand-name">Ouru</span>
            <span class="brand-sub">Text to PDF</span>
          </div>
        </div>
        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#configure">Configure</a>
          <a href="#security">Security</a>
        </nav>
        <button class="btn ghost">Sign in</button>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="pill">Precision conversion for Ouru text</div>
            <h1>
              Turn Ouru text into
              <span class="accent">pixel-clean PDFs</span>
              or Word files.
            </h1>
            <p>
              A minimal workspace for configuring fonts, layout, and metadata while keeping
              output consistent across teams.
            </p>
            <div class="hero-actions">
              <button class="btn primary">Start converting</button>
              <button class="btn ghost">View sample</button>
            </div>
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

          <div class="hero-panel">
            <div class="panel-header">
              <span>Conversion Studio</span>
              <div class="panel-status">Live</div>
            </div>
            <div class="panel-body">
              <label class="field">
                <span>Paste Ouru text</span>
                <textarea
                  v-model="textInput"
                  rows="7"
                  placeholder="Paste your Ouru text here..."
                ></textarea>
              </label>
              <div class="field-row">
                <label class="field">
                  <span>Output format</span>
                  <select v-model="outputFormat">
                    <option>PDF</option>
                    <option>Word (DOCX)</option>
                  </select>
                </label>
                <label class="field">
                  <span>Page size</span>
                  <select v-model="pageSize">
                    <option>A4</option>
                    <option>Letter</option>
                    <option>Legal</option>
                  </select>
                </label>
              </div>
              <div class="field-row">
                <label class="toggle">
                  <input v-model="embedFonts" type="checkbox" />
                  <span>Embed fonts</span>
                </label>
                <label class="toggle">
                  <input v-model="includeToc" type="checkbox" />
                  <span>Include table of contents</span>
                </label>
              </div>
              <label class="field">
                <span>File name</span>
                <input v-model="fileName" type="text" placeholder="ouru-report-q1" />
              </label>
              <button class="btn primary wide" :disabled="isConverting" @click="handleConvert">
                {{ isConverting ? "Converting..." : "Convert now" }}
              </button>
              <p class="status" role="status">{{ statusMessage }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="section">
        <div class="container">
          <div class="section-head">
            <div>
              <p class="eyebrow">Made for clarity</p>
              <h2>Professional output without the clutter.</h2>
            </div>
            <p class="section-sub">
              Set typography rules, spacing, and metadata once, then export consistently across
              client deliverables.
            </p>
          </div>

          <div class="card-grid">
            <div class="card">
              <h3>Layout presets</h3>
              <p>Curated templates for reports, briefs, and documentation.</p>
            </div>
            <div class="card">
              <h3>Brand typography</h3>
              <p>Lock fonts, sizes, and spacing with versioned profiles.</p>
            </div>
            <div class="card">
              <h3>Fast approvals</h3>
              <p>Generate shareable proofs with highlights and comments.</p>
            </div>
            <div class="card">
              <h3>Secure exports</h3>
              <p>Encrypted downloads with optional watermarking.</p>
            </div>
          </div>
        </div>
      </section>

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
              <button class="btn ghost small">Change</button>
            </div>
            <div class="config-row">
              <div>
                <p class="config-label">Header style</p>
                <p class="config-value">Minimal (logo left)</p>
              </div>
              <button class="btn ghost small">Edit</button>
            </div>
            <div class="config-row">
              <div>
                <p class="config-label">Export quality</p>
                <p class="config-value">Print-ready 300 DPI</p>
              </div>
              <button class="btn ghost small">Tune</button>
            </div>
            <div class="config-row">
              <div>
                <p class="config-label">Security</p>
                <p class="config-value">Password + watermark</p>
              </div>
              <button class="btn ghost small">Manage</button>
            </div>
          </div>
        </div>
      </section>

      <section id="security" class="section">
        <div class="container security">
          <div>
            <p class="eyebrow">Trust</p>
            <h2>Designed for sensitive documentation.</h2>
            <p class="section-sub">
              Files are processed in isolated environments with automatic purge policies and
              audit-ready logs.
            </p>
            <button class="btn primary">Request security overview</button>
          </div>
          <div class="security-card">
            <div>
              <p class="config-label">Data retention</p>
              <p class="config-value">30 min ephemeral storage</p>
            </div>
            <div>
              <p class="config-label">Encryption</p>
              <p class="config-value">AES-256 at rest</p>
            </div>
            <div>
              <p class="config-label">Availability</p>
              <p class="config-value">99.98% uptime SLA</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <p class="brand-name">Ouru</p>
          <p class="muted-text">Precision conversion for modern documentation.</p>
        </div>
        <div class="footer-links">
          <a href="#features">Features</a>
          <a href="#configure">Configuration</a>
          <a href="#security">Security</a>
        </div>
      </div>
    </footer>
  </div>
</template>
