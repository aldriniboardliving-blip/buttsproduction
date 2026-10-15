/** The admin is a light, utilitarian tool. This shell exists only to set the
 *  surface, so unauthenticated routes (login, setup) are not forced into the
 *  dark public canvas. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-surface="light" className="min-h-svh bg-neutral-50 text-neutral-900">
      {children}
    </div>
  );
}