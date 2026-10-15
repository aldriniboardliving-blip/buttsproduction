'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateLoginCredentials, createLoginSession, auditLog } from '@/lib/auth/service';
import { SESSION_COOKIE } from '@/lib/auth/session';
import { failure, success, type ActionResult } from '@/lib/action-result';

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await validateLoginCredentials(normalizedEmail, password);

    if (!user) {
      await auditLog('login_failed', 'AdminUser', '000000000000000000000000', {
        email: normalizedEmail,
      }, normalizedEmail);
      return failure({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    await createLoginSession(user._id.toString(), rememberMe);
    await auditLog('login', 'AdminUser', user._id.toString(), { rememberMe });

    return success({ redirectTo: '/admin' });
  } catch (err) {
    if (err instanceof Error && err.message === 'ACCOUNT_LOCKED') {
      return failure({
        code: 'ACCOUNT_LOCKED',
        message: 'Too many failed attempts. Please try again later.',
      });
    }
    return failure({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const { destroySession } = await import('@/lib/auth/service');
    await destroySession();
    await auditLog('logout', 'AdminUser', '000000000000000000000000');
  }

  redirect('/admin/login');
}
