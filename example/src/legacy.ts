// TS demo: use non-Baseline features with TypeScript types
const dialogEl = document.createElement('dialog') as HTMLDialogElement;
dialogEl.showModal();

// Use inert via type cast to avoid global augmentation errors
(document.body as any).inert = true;
setTimeout(() => { (document.body as any).inert = false; }, 200);

const seg = new Intl.Segmenter('en', { granularity: 'word' });
for (const part of seg.segment('TypeScript demo for Baseline Guard')) {
  console.log('TS segment:', (part as any).segment);
}