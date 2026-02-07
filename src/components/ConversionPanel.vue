<script setup lang="ts">
import { ref } from "vue";

type Format = "PDF" | "Word (DOCX)";

const textInput = ref("");
const outputFormat = ref<Format>("PDF");
const pageSize = ref("A4");
const includeToc = ref(false);
const fileName = ref("ouru-document");
const isConverting = ref(false);
const statusMessage = ref("");

const MAX_TEXT_LENGTH = 10_000_000;

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
  const maxLineWidth = width - margin * 2;
  
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      const wordWidth = font.widthOfTextAtSize(word, fontSize);
      if (wordWidth > maxLineWidth && line) {
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
        line = "";
      }
      
      if (testWidth > maxLineWidth) {
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
        if (wordWidth > maxLineWidth) {
          let remainingWord = word;
          while (remainingWord.length > 0) {
            if (cursorY <= margin) {
              page = pdfDoc.addPage([width, height]);
              cursorY = height - margin;
            }
            let charIndex = 0;
            let charLine = "";
            while (charIndex < remainingWord.length) {
              const testCharLine = charLine + remainingWord[charIndex];
              if (font.widthOfTextAtSize(testCharLine, fontSize) > maxLineWidth && charLine) {
                break;
              }
              charLine = testCharLine;
              charIndex++;
            }
            if (!charLine && charIndex < remainingWord.length) {
              charLine = remainingWord[0];
              charIndex = 1;
            }
            page.drawText(charLine, {
              x: margin,
              y: cursorY,
              size: fontSize,
              font,
              color: rgb(0.12, 0.12, 0.12)
            });
            cursorY -= lineHeight;
            remainingWord = remainingWord.slice(charIndex);
          }
          line = "";
        } else {
          line = word;
        }
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

  const pdfBytes = await pdfDoc.save();
  const arrayBuffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
  downloadBlob(new Blob([arrayBuffer], { type: "application/pdf" }), `${name}.pdf`);
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

  if (textInput.value.length > MAX_TEXT_LENGTH) {
    statusMessage.value = `Text is too large (${(textInput.value.length / 1_000_000).toFixed(1)}MB). Maximum size is ${(MAX_TEXT_LENGTH / 1_000_000).toFixed(0)}MB. Please split your text into smaller chunks.`;
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("memory") || errorMessage.includes("allocation") || errorMessage.includes("size")) {
      statusMessage.value = "Text is too large to process. Please try splitting it into smaller chunks or reduce the content size.";
    } else if (errorMessage.includes("timeout") || errorMessage.includes("time")) {
      statusMessage.value = "Conversion timed out. The text may be too large. Please try a smaller chunk.";
    } else {
      statusMessage.value = `Conversion failed: ${errorMessage}. Please try again or split your text into smaller chunks.`;
    }
    console.error("Conversion error:", error);
  } finally {
    isConverting.value = false;
  }
};
</script>

<template>
  <UCard
    class="hero-panel"
    :ui="{
      body: { base: 'p-0 bg-white' },
      header: { base: 'p-0 bg-white' },
      ring: 'ring-0',
      divide: 'divide-y divide-[var(--line)]'
    }"
  >
    <div class="panel-body">
      <UFormGroup label="Paste Ouru text">
        <UTextarea
          v-model="textInput"
          :rows="7"
          variant="outline"
          placeholder="Paste your Ouru text here..."
          :maxlength="MAX_TEXT_LENGTH"
        />
        <p v-if="textInput.length > 0" class="mt-1 text-xs text-gray-500">
          {{ (textInput.length / 1_000_000).toFixed(2) }}MB / {{ (MAX_TEXT_LENGTH / 1_000_000).toFixed(0) }}MB
          <span v-if="textInput.length > MAX_TEXT_LENGTH * 0.9" class="text-orange-600 font-medium">
            (approaching limit)
          </span>
        </p>
      </UFormGroup>
      <div class="field-row">
        <UFormGroup label="Output format">
          <USelect v-model="outputFormat" :options="formatOptions" variant="outline" />
        </UFormGroup>
        <UFormGroup label="Page size">
          <USelect v-model="pageSize" :options="pageOptions" variant="outline" />
        </UFormGroup>
      </div>
      <div class="toggle-row">
        <UCheckbox v-model="includeToc" label="Include table of contents" />
      </div>
      <UFormGroup label="File name">
        <UInput v-model="fileName" variant="outline" placeholder="ouru-report-q1" />
      </UFormGroup>
      <UButton
        color="primary"
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
