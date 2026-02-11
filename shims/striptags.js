// Lightweight ESM-compatible shim for `striptags` to avoid CJS default-export issues
export default function stripTags(input) {
  if (input === undefined || input === null) return '';
  return String(input).replace(/<[^>]*>/g, '');
}

export { stripTags };
