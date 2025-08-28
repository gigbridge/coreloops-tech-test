'use client';

import { useEffect, useState } from 'react';

export function useGridColumns() {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const qXL = window.matchMedia('(min-width: 1280px)');
    const qLG = window.matchMedia('(min-width: 1024px)');
    const qSM = window.matchMedia('(min-width: 640px)');

    const update = () => {
      if (qXL.matches) setCols(4);
      else if (qLG.matches) setCols(3);
      else if (qSM.matches) setCols(2);
      else setCols(1);
    };

    update();
    qXL.addEventListener('change', update);
    qLG.addEventListener('change', update);
    qSM.addEventListener('change', update);
    return () => {
      qXL.removeEventListener('change', update);
      qLG.removeEventListener('change', update);
      qSM.removeEventListener('change', update);
    };
  }, []);

  return cols;
}


