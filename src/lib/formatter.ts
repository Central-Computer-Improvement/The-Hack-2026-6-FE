// format angka menjadi string dengan pemisah ribuan, Contoh: 1250 → "1.250"
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Memformat tanggal ISO menjadi string yang ramah anak.
 * Contoh: "2026-08-11T12:00:00Z" → "Selasa, 11 Agustus 2026"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

/**
 * Menghitung poin berdasarkan aktivitas.
 * - Selesai video: 50 poin
 * - Kuis sempurna: 100 poin
 */
export function calculatePoints(type: "video" | "quiz_perfect"): number {
  const POINTS_MAP = { video: 50, quiz_perfect: 100 };
  return POINTS_MAP[type];
}

/**
 * Mengecek apakah streak masih valid (reset tiap 00:00).
 */
export function isStreakAlive(lastActive: string): boolean {
  const last = new Date(lastActive);
  const now = new Date();
  const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  return diffHours < 24;
}
