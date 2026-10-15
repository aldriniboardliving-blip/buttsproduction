'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from './login/actions';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
    >
      Logout
    </button>
  );
}
