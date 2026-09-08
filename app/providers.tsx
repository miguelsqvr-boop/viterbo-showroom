'use client';

import { Suspense, useEffect } from 'react';
import { AttractLoop } from '@/components/AttractLoop';
import { LoadingBar } from '@/components/LoadingBar';
import { DevOverlay } from '@/components/DevOverlay';
import { FullscreenButton } from '@/components/FullscreenButton';
import { NavBar } from '@/components/NavBar';
import { IdleProvider } from '@/lib/idle';
import { LoadingProvider } from '@/lib/loading';
import { LocaleProvider } from '@/lib/locale';
import { registerServiceWorker } from '@/lib/sw';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerServiceWorker();
  }, []);

  return (
    <LocaleProvider>
      <IdleProvider>
        <LoadingProvider>
          <div className="relative h-full w-full overflow-hidden">
            {children}
            <NavBar />
            <LoadingBar />
            <AttractLoop />
            <FullscreenButton />
            <Suspense fallback={null}>
              <DevOverlay />
            </Suspense>
          </div>
        </LoadingProvider>
      </IdleProvider>
    </LocaleProvider>
  );
}
