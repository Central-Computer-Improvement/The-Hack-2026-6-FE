// file: src/hooks/useQuizTimer.ts
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Countdown timer.
 * Reset otomatis setiap kali `resetKey` berubah.
 * Memanggil `onExpire` sekali saat hitungan mencapai 0 (waktu habis).
 * `isActive` = false akan menjeda hitungan (misal setelah quiz selesai).
 */
export function useQuizTimer(
  durationSeconds: number,
  onExpire: () => void,
  resetKey: string | number,
  isActive: boolean = true
) {
  const [remaining, setRemaining] = useState(durationSeconds);

  // Simpan callback terbaru. Ref TIDAK BOLEH ditulis langsung saat render
  // (eslint: react-hooks/refs), jadi assignment-nya dipindah ke useEffect.
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Reset hitungan setiap kali soal berganti (resetKey berubah).
  // Dipakai pola "adjust state during render" (sama seperti sinkronisasi
  // prevPathname di SideBar.tsx), BUKAN setState di dalam useEffect,
  // supaya tidak kena warning react-hooks/set-state-in-effect.
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setRemaining(durationSeconds);
  }

  useEffect(() => {
    if (!isActive) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setTimeout(() => setRemaining((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining, isActive]);

  return remaining;
}