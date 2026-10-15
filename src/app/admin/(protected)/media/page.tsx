import { config } from '@/config/env';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader, AdminAlert } from '@/components/admin/AdminPrimitives';
import { MediaLibrary } from './MediaLibrary';

export const instant = false;

export default function MediaPage() {
  // Only non-secret upload settings cross to the client bundle.
  const cloudName = config.cloudinary.cloudName;
  const uploadFolder = `${config.cloudinary.folderPrefix}/admin/uploads`;
  const allowedTypes = config.upload.allowedTypes;

  if (!cloudName) {
    return (
      <Container size="full">
        <AdminPageHeader title="Media" />
        <AdminAlert>
          Cloudinary is not configured. Set <code className="font-mono">CLOUDINARY_CLOUD_NAME</code>{' '}
          and the related credentials to enable uploads.
        </AdminAlert>
      </Container>
    );
  }

  return (
    <Container size="full">
      <AdminPageHeader
        title="Media"
        description="Images uploaded here can be attached to businesses, services, products and events."
        breadcrumb={[{ label: 'Admin', href: '/admin/dashboard' }]}
      />
      <MediaLibrary
        cloudName={cloudName}
        uploadFolder={uploadFolder}
        allowedTypes={allowedTypes}
      />
    </Container>
  );
}