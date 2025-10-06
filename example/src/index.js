// JS demo: use Intl.Segmenter, <dialog>, and Element.inert
const dlg = document.createElement('dialog');
dlg.innerHTML = '<p>JS-created dialog</p><button id="jsClose">Close</button>';
document.body.appendChild(dlg);
dlg.showModal();

document.body.inert = true;
setTimeout(() => { document.body.inert = false; }, 300);

const segmenter = new Intl.Segmenter('en', { granularity: 'word' });
const text = 'Baseline Guard demo file for JS';
for (const s of segmenter.segment(text)) {
  console.log('JS segment:', s.segment);
}