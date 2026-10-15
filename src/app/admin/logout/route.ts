import { redirect } from 'next/navigation';
import { destroySession } from '@/lib/auth/service';

export async function GET() {
  await destroySession();
  redirect('/admin/login');
}
