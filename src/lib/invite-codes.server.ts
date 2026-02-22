import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CODES_FILE = join(process.cwd(), 'data', 'invite-codes.json');

interface CodeEntry {
  used: boolean;
  usedAt: string | null;
  swapId: string | null;
}

interface CodesDB {
  [code: string]: CodeEntry;
}

function readCodes(): CodesDB {
  if (!existsSync(CODES_FILE)) return {};
  return JSON.parse(readFileSync(CODES_FILE, 'utf-8'));
}

function writeCodes(codes: CodesDB): void {
  writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
}

export function validateCode(code: string): { valid: boolean; used: boolean } {
  const codes = readCodes();
  const normalized = code.toUpperCase().trim();
  const entry = codes[normalized];
  if (!entry) return { valid: false, used: false };
  return { valid: true, used: entry.used };
}

export function consumeCode(code: string, swapId: string): boolean {
  const codes = readCodes();
  const normalized = code.toUpperCase().trim();
  const entry = codes[normalized];
  if (!entry || entry.used) return false;
  entry.used = true;
  entry.usedAt = new Date().toISOString();
  entry.swapId = swapId;
  writeCodes(codes);
  return true;
}