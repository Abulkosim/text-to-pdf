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

const formatOptions: Format[] = ["PDF", "Word (DOCX)"];
const pageOptions = ["A4", "Letter", "Legal"];

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
    // PDF-lib embeds standard fonts by default; keep for future custom font toggle.
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
  downloadBlob(blob, `${name}.docx`);
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
  <UCard class="hero-panel" :ui="{ body: 'p-0', header: 'p-0' }">
    <template #header>
      <div class="panel-header">
        <span>Conversion Studio</span>
        <UBadge color="emerald" variant="soft">Live</UBadge>
      </div>
    </template>
    <div class="panel-body">
      <UFormGroup label="Paste Ouru text">
        <UTextarea v-model="textInput" :rows="7" placeholder="Paste your Ouru text here..." />
      </UFormGroup>
      <div class="field-row">
        <UFormGroup label="Output format">
          <USelect v-model="outputFormat" :options="formatOptions" />
        </UFormGroup>
        <UFormGroup label="Page size">
          <USelect v-model="pageSize" :options="pageOptions" />
        </UFormGroup>
      </div>
      <div class="toggle-row">
        <UCheckbox v-model="embedFonts" label="Embed fonts" />
        <UCheckbox v-model="includeToc" label="Include table of contents" />
      </div>
      <UFormGroup label="File name">
        <UInput v-model="fileName" placeholder="ouru-report-q1" />
      </UFormGroup>
      <UButton
        color="neutral"
        :loading="isConverting"
        block
        size="lg"
        @click="handleConvert"
      >
        {{ isConverting ? "Converting..." : "Convert now" }}
      </UButton>
      <p class="status" role="status">{{ statusMessage }}</p>
    </div>
  </UCard>
</template>
