'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/**
 * How much of what the screen has asked for has actually arrived.
 *
 * The panel is on a showroom network and most frames are 300–600KB, so there
 * is a real moment — a second, sometimes three on a cold cache — where a
 * visitor is looking at a blur placeholder and cannot tell whether the screen
 * is working. The studio asked for a loading bar, and this is what feeds it.
 *
 * Counted rather than faked: every MediaFrame registers the image it is about
 * to fetch and reports when it lands, so the bar measures real progress and
 * not a timer pretending to be one. Registration is keyed by src, because
 * React mounts a frame twice in development and the same photograph can be on
 * screen twice (a hero repeated as an attract frame).
 */
type Actions = {
  register: (src: string) => void;
  settle: (src: string) => void;
};

type Progress = {
  /** 0 to 1, and 1 when there is nothing outstanding. */
  progress: number;
  pending: number;
};

/*
 * Two contexts, not one, and the split is the whole point.
 *
 * Every frame on screen consumes the actions, and the numbers change on every
 * image that lands. Behind a single context that meant one photograph
 * finishing re-rendered all twelve MediaFrames on a project screen, dozens of
 * times per screenful — which showed up as frames arriving late and the suite
 * reporting blank slides. The actions never change identity, so frames now
 * re-render when their own props do and not otherwise; only the bar watches
 * the numbers.
 */
const ActionsContext = createContext<Actions | null>(null);
const ProgressContext = createContext<Progress>({ progress: 1, pending: 0 });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [{ done, total }, setCount] = useState({ done: 0, total: 0 });
  /*
   * The sets live in a ref, not in state: a frame registers during render-time
   * effects and settles from an event handler, and routing both through state
   * would queue an update per image on a screen that can mount twelve at once.
   * State carries the two numbers the bar draws, and nothing else.
   */
  const seen = useRef(new Set<string>());
  const settled = useRef(new Set<string>());

  const register = useCallback((src: string) => {
    if (seen.current.has(src)) return;
    seen.current.add(src);
    setCount({ done: settled.current.size, total: seen.current.size });
  }, []);

  const settle = useCallback((src: string) => {
    if (settled.current.has(src)) return;
    settled.current.add(src);
    /*
     * Everything outstanding has landed, so the next screen starts from a
     * clean slate rather than inheriting a bar that is already nine tenths
     * full. Without this the counter only ever grows and the bar stops moving
     * enough to read.
     */
    if (settled.current.size === seen.current.size) {
      seen.current = new Set();
      settled.current = new Set();
      setCount({ done: 0, total: 0 });
      return;
    }
    setCount({ done: settled.current.size, total: seen.current.size });
  }, []);

  const actions = useMemo<Actions>(() => ({ register, settle }), [register, settle]);
  const progress = useMemo<Progress>(
    () => ({ progress: total === 0 ? 1 : done / total, pending: total - done }),
    [done, total],
  );

  return (
    <ActionsContext.Provider value={actions}>
      <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
    </ActionsContext.Provider>
  );
}

/** Null outside the provider, so a frame can be rendered on its own. */
export function useLoadingActions(): Actions | null {
  return useContext(ActionsContext);
}

export function useLoadingProgress(): Progress {
  return useContext(ProgressContext);
}
