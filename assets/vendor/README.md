# Enquiry PDF Dependencies

These files are loaded from this site only when Download PDF is selected. Customer data is never sent to a font or PDF service.

- `jspdf-4.2.1.umd.min.js`: jsPDF 4.2.1, MIT license. Source: https://github.com/parallax/jsPDF/releases/tag/v4.2.1
  SHA-256: `e6551fcdc32f09d6853b2c5126d18d01d9447e0da618a41a11ebeee0f6c20d54`
- `noto-sans-regular.js`: generated base64 wrapper of Noto Sans Regular, SIL Open Font License. Source: https://github.com/notofonts/noto-fonts/blob/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf
  Original TTF SHA-256: `b85c38ecea8a7cfb39c24e395a4007474fa5a4fc864f6ee33309eb4948d232d5`

License texts are included beside the dependencies. The bundled font supports Latin, Greek and Cyrillic text; it is not a universal multilingual font. The renderer rejects unsupported glyphs rather than silently dropping customer text. WhatsApp text handoff remains available in that case.

No AutoTable, HTML screenshot renderer, upload service, or runtime CDN is used by the PDF feature.
