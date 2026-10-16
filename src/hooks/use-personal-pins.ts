import { useCallback, useEffect, useState } from "react";
import {
  loadMyMapOnlyPref,
  loadPersonalPinsFromStorage,
  saveMyMapOnlyPref,
  savePersonalPinsToStorage,
  type PersonalPin,
} from "@/lib/personal-pins";

/**
 * Device-local personal pins. Community sync (`refreshShared`) never touches this
 * list — only explicit upsert/remove/import/clear-via-delete mutate storage.
 */
export function usePersonalPins() {
  const [pins, setPins] = useState<PersonalPin[]>([]);
  const [myMapOnly, setMyMapOnlyState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPins(loadPersonalPinsFromStorage());
    setMyMapOnlyState(loadMyMapOnlyPref());
    setReady(true);
  }, []);

  const persist = useCallback((next: PersonalPin[]) => {
    savePersonalPinsToStorage(next);
    setPins(next);
  }, []);

  const upsert = useCallback(
    (pin: PersonalPin) => {
      setPins((prev) => {
        const next = [pin, ...prev.filter((p) => p.id !== pin.id)];
        savePersonalPinsToStorage(next);
        return next;
      });
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setPins((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePersonalPinsToStorage(next);
      return next;
    });
  }, []);

  const removeBySharedId = useCallback((sharedId: string) => {
    setPins((prev) => {
      const next = prev.filter((p) => p.sharedId !== sharedId);
      savePersonalPinsToStorage(next);
      return next;
    });
  }, []);

  const replaceAll = useCallback(
    (next: PersonalPin[]) => {
      persist(next);
    },
    [persist],
  );

  const setMyMapOnly = useCallback((on: boolean) => {
    saveMyMapOnlyPref(on);
    setMyMapOnlyState(on);
  }, []);

  const get = useCallback((id: string) => pins.find((p) => p.id === id), [pins]);

  const sharedIdSet = useCallback(() => {
    const s = new Set<string>();
    for (const p of pins) {
      if (p.sharedId) s.add(p.sharedId);
    }
    return s;
  }, [pins]);

  return {
    pins,
    ready,
    myMapOnly,
    setMyMapOnly,
    upsert,
    remove,
    removeBySharedId,
    replaceAll,
    get,
    sharedIdSet,
    count: pins.length,
  };
}
