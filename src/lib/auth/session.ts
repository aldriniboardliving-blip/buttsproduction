import { cookies } from 'next/headers';
import { config } from '@/config/env';
import { hashToken, generateSecureToken } from './password';

export const SESSION_COOKIE = 'bp_session';
export const CSRF_COOKIE = 'bp_csrf';
export const CSRF_HEADER = 'x-csrf-token';

export async function createSessionToken(): Promise<string> {
  return generateSecureToken(32);
}

export async function setSessionCookie(token: string, rememberMe: boolean): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: config.app.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: rememberMe
      ? config.auth.rememberMeTtlMs / 1000
      : config.auth.defaultTtlMs / 1000,
    ...(config.auth.cookieDomain ? { domain: config.auth.cookieDomain } : {}),
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionTokenHash(): Promise<string | undefined> {
  const token = await getSessionToken();
  if (!token) return undefined;
  return hashToken(token);
}

export async function generateCsrfToken(): Promise<string> {
  const token = generateSecureToken(32);
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: config.app.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60,
    ...(config.auth.cookieDomain ? { domain: config.auth.cookieDomain } : {}),
  });
  return token;
}

export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  const encoder = new TextEncoder();
  const a = encoder.encode(cookieToken);
  const b = encoder.encode(headerToken);

  const hashA = await crypto.subtle.digest('SHA-256', a);
  const hashB = await crypto.subtle.digest('SHA-256', b);

  const arrA = new Uint8Array(hashA);
  const arrB = new Uint8Array(hashB);

  if (arrA.length !== arrB.length) return false;

  let result = 0;
  for (let i = 0; i < arrA.length; i++) {
    result |= arrA[i] ^ arrB[i];
  }
  return result === 0;
}
