import crypto from 'crypto';

/**
 * Generates a unique ticket code.
 * @returns {string} A unique ticket code.
 */
export function generateTicketCode() {
  return "TKT-" + crypto.randomBytes(5).toString("hex").toUpperCase();
}

// TKT-A9F3D2B1C4