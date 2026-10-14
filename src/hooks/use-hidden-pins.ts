import { useCallback, useEffect, useState } from "react";

const KEY = "gfl-hidden-pins-v1";

export function useHiddenPins() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string"));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
  }, []);

  const hide = useCallback(
    (id: string) => {
      setIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const unhide = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, hide, unhide, clearAll, has, count: ids.length };
}
