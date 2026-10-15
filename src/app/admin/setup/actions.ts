'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '@/config/env';
import { createInitialAdmin, getAdminCount, auditLog } from '@/lib/auth/service';
import { failure, success, type ActionResult } from '@/lib/action-result';

export async function setupAction(
  token: string,
  email: string,
  password: string,
  name: string,
): Promise<ActionResult<{ redirectTo: string }>> {
  if (token !== config.auth.setupToken) {
    return failure({
      code: 'INVALID_TOKEN',
      message: 'Invalid setup token',
    });
  }

  try {
    const adminCount = await getAdminCount();

    if (adminCount > 0) {
      return failure({
        code: 'SETUP_COMPLETE',
        message: 'Admin user already exists',
      });
    }

    if (password.length < 8) {
      return failure({
        code: 'VALIDATION_ERROR',
        message: 'Password must be at least 8 characters',
      });
    }

    const admin = await createInitialAdmin(email, password, name);

    await auditLog('setup_complete', 'AdminUser', admin._id.toString(), {
      email: admin.email,
    });

    redirect('/admin/login');
  } catch (err) {
    if (err instanceof Error && err.message === 'An admin with this email already exists') {
      return failure({
        code: 'SETUP_COMPLETE',
        message: 'Admin user already exists',
      });
    }
    return failure({
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}
