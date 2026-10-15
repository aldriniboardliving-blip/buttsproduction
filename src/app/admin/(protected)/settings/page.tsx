import { Container } from '@/components/ui/Container';
import { AdminPageHeader, AdminAlert } from '@/components/admin/AdminPrimitives';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSettingsFormValue } from '@/server/actions/settings';
import { submitSaveSettings } from '@/server/actions/form-handlers';

export const instant = false;

export default async function SettingsPage() {
  const result = await getSettingsFormValue();

  return (
    <Container size="full">
      <AdminPageHeader
        title="Settings"
        description="Site-wide contact details, social profiles and default SEO."
        breadcrumb={[{ label: 'Admin', href: '/admin/dashboard' }]}
      />

      {result.success ? (
        <SettingsForm
          action={submitSaveSettings}
          values={Object.fromEntries(
            Object.entries(result.data).map(([key, value]) => [key, String(value ?? '')]),
          )}
        />
      ) : (
        <AdminAlert>{result.error.message}</AdminAlert>
      )}
    </Container>
  );
}