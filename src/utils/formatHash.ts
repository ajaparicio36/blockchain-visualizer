/**
 * Truncate a hex hash for display.
 * @param hash  Full SHA-256 hex string.
 * @param chars Number of leading characters to keep (default 10).
 * @returns     Truncated string, e.g. `"a4f3bc91d2…"`.
 */
export function formatHash(hash: string, chars = 10): string {
  if (hash.length <= chars) return hash;
  return `${hash.slice(0, chars)}…`;
}

/**
 * Format a Unix-ms timestamp as a human-readable date string.
 */
export function formatTimestamp(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Truncate a data string for 3D display.
 */
export function truncateData(data: string, max = 20): string {
  if (data.length <= max) return data;
  return `${data.slice(0, max)}…`;
}
