import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/service';
import { AdminSidebar } from './AdminSidebar';

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar session={session} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-neutral-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">{session.name}</span>
              <form action="/admin/logout">
                <button
                  type="submit"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Suspense>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
