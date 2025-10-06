import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // React + JS usage of Intl.Segmenter
    const seg = new Intl.Segmenter('en', { granularity: 'word' });
    for (const { segment } of seg.segment('React JSX demo for Baseline Guard')) {
      console.log('JSX segment:', segment);
    }
  }, []);

  return (
    <div>
      <h2>Baseline Guard Demo (JSX)</h2>
      {/* inert attribute used in JSX */}
      <div inert>
        <button>Unclickable due to inert</button>
      </div>

      {/* Native HTML <dialog> in JSX */}
      <dialog open>
        <p>Dialog rendered in JSX</p>
      </dialog>
    </div>
  );
}