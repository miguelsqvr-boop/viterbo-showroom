'use client';

import { Suspense, useEffect } from 'react';
import { AttractLoop } from '@/components/AttractLoop';
import { DevOverlay } from '@/components/DevOverlay';
import { NavBar } from '@/components/NavBar';
import { IdleProvider } from '@/lib/idle';
import { LocaleProvider } from '@/lib/locale';
import { registerServiceWorker } from '@/lib/sw';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerServiceWorker();
  }, []);

  return (
    <LocaleProvider>
      <IdleProvider>
        <div className="relative h-full w-full overflow-hidden">
          {children}
          <NavBar />
          <AttractLoop />
          <Suspense fallback={null}>
            <DevOverlay />
          </Suspense>
        </div>
      </IdleProvider>
    </LocaleProvider>
  );
}
