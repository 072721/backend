import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

function readLocalServiceAccount() {
  const localFile = path.resolve(process.cwd(), 'serviceAccount.json');
  if (!fs.existsSync(localFile)) {
    throw new Error('Local serviceAccount.json not found');
  }

  try {
    return JSON.parse(fs.readFileSync(localFile, 'utf-8'));
  } catch (error) {
    throw new Error(`Failed to read local serviceAccount.json: ${error}`);
  }
}

function parseServiceAccount(payload: string) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT env var, falling back to serviceAccount.json:', error);
    return null;
  }
}

function validateServiceAccount(account: any, source: string) {
  try {
    admin.credential.cert(account);
    return account;
  } catch (error) {
    console.warn(`Invalid Firebase service account from ${source}, trying fallback if available:`, error);
    return null;
  }
}

let serviceAccount: any | null = null;

const localFile = path.resolve(process.cwd(), 'serviceAccount.json');
if (fs.existsSync(localFile)) {
  const localAccount = readLocalServiceAccount();
  serviceAccount = validateServiceAccount(localAccount, 'serviceAccount.json');
}

if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  const parsed = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (parsed) {
    serviceAccount = validateServiceAccount(parsed, 'FIREBASE_SERVICE_ACCOUNT env var');
  }
}

if (!serviceAccount) {
  throw new Error('No valid Firebase service account available. Set FIREBASE_SERVICE_ACCOUNT correctly or provide a valid local serviceAccount.json file.');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
