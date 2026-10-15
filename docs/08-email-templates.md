# Butts Productions — Email Templates (Resend)

**Version**: 1.0  
**Phase**: 2 Deliverable  
**Status**: For Approval

---

## Email Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        EMAIL FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Server Action / Route Handler                                  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐     ┌──────────────────┐                  │
│  │ Email Service   │────▶│ Resend API       │                  │
│  │ (sendEmail)     │     │                  │                  │
│  └─────────────────┘     └──────────────────┘                  │
│         │                       │                               │
│         │  1. Select template    │                               │
│         │  2. Render with data   │                               │
│         │  3. Send via Resend    │                               │
│         │                       │                               │
│         ▼                       ▼                               │
│  ┌─────────────────┐     ┌──────────────────┐                  │
│  │ Audit Log       │     │ Customer/        │                  │
│  │ (email_sent)    │     │ Admin Inbox      │                  │
│  └─────────────────┘     └──────────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Base Email Service

```typescript
// src/server/email/service.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { auditLog } from '@/lib/audit';

const resend = new Resend(config.email.apiKey);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  text?: string;
  tags?: Array<{ name: string; value: string }>;
}

export async function sendEmail({
  to,
  subject,
  react,
  text,
  tags = [],
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const html = await render(react);
    const textContent = text || await render(react, { plainText: true });

    const { data, error } = await resend.emails.send({
      from: `${config.email.fromName} <${config.email.fromEmail}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: textContent,
      replyTo: config.email.replyTo,
      tags: [
        { name: 'environment', value: config.app.nodeEnv },
        ...tags,
      ],
    });

    if (error) {
      await auditLog('email_failed', 'Email', new Types.ObjectId(), {
        to, subject, error: error.message,
      });
      return { success: false, error: error.message };
    }

    await auditLog('email_sent', 'Email', new Types.ObjectId(), {
      to, subject, resendId: data?.id,
    });

    return { success: true, id: data?.id };
  } catch (err) {
    await auditLog('email_failed', 'Email', new Types.ObjectId(), {
      to, subject, error: String(err),
    });
    return { success: false, error: String(err) };
  }
}
```

---

## Template Components (React Email)

### Base Layout
```tsx
// src/server/email/components/Layout.tsx
import { Html, Head, Body, Container, Section, Text, Link, Img } from '@react-email/components';

interface LayoutProps {
  children: React.ReactNode;
  preheader?: string;
  title: string;
}

export function EmailLayout({ children, preheader, title }: LayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <style>{`
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; }
          .btn-primary { background-color: #1e40af; color: white; }
          .btn-secondary { background-color: #6b7280; color: white; }
          .card { background: white; border-radius: 8px; padding: 24px; margin: 16px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .footer { font-size: 12px; color: #9ca3af; text-align: center; padding: 24px; }
        `}</style>
      </Head>
      <Body style={{ margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ background: 'white', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
            <Img
              src={`${config.app.url}/logo-email.png`}
              alt={config.app.name}
              width="180"
              style={{ display: 'block', margin: '24px auto 16px' }}
            />
          </Section>
          
          <Section style={{ background: 'white', padding: '24px', borderRadius: '0 0 8px 8px' }}>
            {children}
          </Section>

          <Section>
            <Text style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
              © {new Date().getFullYear()} {config.app.name}. All rights reserved.<br />
              848 Granby St. Suite 203, Norfolk, VA 23510<br />
              <Link href={`${config.app.url}/privacy-policy`} style={{ color: '#9ca3af' }}>Privacy Policy</Link> | 
              <Link href={`${config.app.url}/terms-conditions`} style={{ color: '#9ca3af' }}>Terms</Link> | 
              <Link href={`${config.app.url}/unsubscribe`} style={{ color: '#9ca3af' }}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 1. Booking Confirmation (Customer)

**Trigger**: Public form submission → Booking created with status `new`  
**Template**: `BookingConfirmationEmail`

```tsx
// src/server/email/templates/BookingConfirmationEmail.tsx
import { EmailLayout } from '@/components/Layout';
import { Section, Heading, Text, Link, Hr } from '@react-email/components';

interface Props {
  customerName: string;
  bookingId: string;
  serviceName: string;
  businessName: string;
  submittedAt: Date;
  formSummary: Record<string, string>;
  adminContactEmail: string;
  adminContactPhone: string;
}

export function BookingConfirmationEmail(props: Props) {
  const { customerName, bookingId, serviceName, businessName, submittedAt, formSummary, adminContactEmail, adminContactPhone } = props;

  return (
    <EmailLayout title="Booking Request Received" preheader="Your request has been received and is being reviewed.">
      <Heading as="h1" style={{ fontSize: '24px', marginBottom: '16px' }}>
        Thank you, {customerName}!
      </Heading>
      
      <Text style={{ marginBottom: '16px' }}>
        We've received your request for <strong>{serviceName}</strong> through <strong>{businessName}</strong>. 
        Your request is now being reviewed by our team.
      </Text>

      <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
        <Text style={{ fontWeight: '600', marginBottom: '8px' }}>Request Details</Text>
        <Text style={{ fontSize: '14px', marginBottom: '4px' }}>
          <strong>Booking ID:</strong> {bookingId}
        </Text>
        <Text style={{ fontSize: '14px', marginBottom: '4px' }}>
          <strong>Submitted:</strong> {submittedAt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={{ fontSize: '14px', marginBottom: '4px' }}>
          <strong>Status:</strong> <span style={{ color: '#1e40af' }}>Under Review</span>
        </Text>
      </div>

      <Text style={{ marginBottom: '16px' }}>
        <strong>What happens next:</strong> Our team will review your request and contact you within 24 hours 
        to confirm details and next steps.
      </Text>

      <Text style={{ marginBottom: '16px' }}>
        If you have any questions, please reply to this email or contact us at:
      </Text>

      <Text style={{ marginBottom: '24px' }}>
        📧 {adminContactEmail}<br />
        📞 {adminContactPhone}
      </Text>

      <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
      
      <Text style={{ fontSize: '14px', color: '#6b7280' }}>
        This is an automated confirmation. Please do not reply directly to this email address 
        for urgent matters.
      </Text>
    </EmailLayout>
  );
}
```

---

## 2. Admin Notification (New Booking)

**Trigger**: Same as above, sent to admin  
**Template**: `AdminBookingNotificationEmail`

```tsx
// src/server/email/templates/AdminBookingNotificationEmail.tsx
import { EmailLayout } from '@/components/Layout';
import { Section, Heading, Text, Link, Hr } from '@react-email/components';

interface Props {
  bookingId: string;
  serviceName: string;
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  submittedAt: Date;
  formData: Record<string, string>;
  adminDashboardUrl: string;
}

export function AdminBookingNotificationEmail(props: Props) {
  const { bookingId, serviceName, businessName, customerName, customerEmail, customerPhone, submittedAt, formData, adminDashboardUrl } = props;

  return (
    <EmailLayout title="New Booking Request" preheader={`New ${serviceName} request from ${customerName}`}>
      <Heading as="h1" style={{ fontSize: '24px', marginBottom: '16px', color: '#dc2626' }}>
        New Booking Request
      </Heading>

      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <Text style={{ fontWeight: '600', marginBottom: '8px' }}>🔔 Action Required</Text>
        <Text style={{ fontSize: '14px' }}>
          A new booking requires review. <Link href={adminDashboardUrl} style={{ color: '#1e40af' }}>Open in Dashboard</Link>
        </Text>
      </div>

      <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <Text style={{ fontWeight: '600', marginBottom: '12px' }}>Booking Summary</Text>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td style={{ padding: '4px 0', fontWeight: '600', width: '120px' }}>Booking ID:</td><td>{bookingId}</td></tr>
            <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Service:</td><td>{serviceName}</td></tr>
            <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Business:</td><td>{businessName}</td></tr>
            <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Customer:</td><td>{customerName}</td></tr>
            <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Email:</td><td><Link href={`mailto:${customerEmail}`}>{customerEmail}</Link></td></tr>
            {customerPhone && <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Phone:</td><td><Link href={`tel:${customerPhone}`}>{customerPhone}</Link></td></tr>}
            <tr><td style={{ padding: '4px 0', fontWeight: '600' }}>Submitted:</td><td>{submittedAt.toLocaleString()}</td></tr>
          </tbody>
        </table>
      </div>

      <Text style={{ fontWeight: '600', marginBottom: '8px' }}>Form Data</Text>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', fontSize: '14px' }}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '8px' }}>
            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}:</strong> {value}
          </div>
        ))}
      </div>

      <Link href={adminDashboardUrl} style={{ display: 'inline-block', marginTop: '24px' }}>
        <a style={{ background: '#1e40af', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>
          Review in Dashboard
        </a>
      </Link>
    </EmailLayout>
  );
}
```

---

## 3. Booking Status Change (Customer)

**Trigger**: Admin updates booking status  
**Template**: `BookingStatusUpdateEmail`

```tsx
// src/server/email/templates/BookingStatusUpdateEmail.tsx
import { EmailLayout } from '@/components/Layout';
import { Section, Heading, Text, Link } from '@react-email/components';

const STATUS_MESSAGES: Record<string, { label: string; color: string; message: string }> = {
  pending_review: { label: 'Under Review', color: '#1e40af', message: 'Your request is being reviewed by our team.' },
  contacted: { label: 'Contacted', color: '#ca8a04', message: 'We\'ve reached out to you. Please check your phone/email.' },
  confirmed: { label: 'Confirmed', color: '#16a34a', message: 'Your booking has been confirmed! Details below.' },
  in_progress: { label: 'In Progress', color: '#1e40af', message: 'Your service is currently in progress.' },
  completed: { label: 'Completed', color: '#16a34a', message: 'Your service has been completed. Thank you for choosing us!' },
  cancelled: { label: 'Cancelled', color: '#dc2626', message: 'Your booking has been cancelled.' },
  rejected: { label: 'Not Approved', color: '#dc2626', message: 'We\'re unable to accommodate your request at this time.' },
};

interface Props {
  customerName: string;
  bookingId: string;
  serviceName: string;
  businessName: string;
  oldStatus: string;
  newStatus: string;
  adminNote?: string;
  adminContactEmail: string;
  adminContactPhone: string;
}

export function BookingStatusUpdateEmail(props: Props) {
  const { customerName, bookingId, serviceName, businessName, oldStatus, newStatus, adminNote, adminContactEmail, adminContactPhone } = props;
  const statusInfo = STATUS_MESSAGES[newStatus] || { label: newStatus, color: '#6b7280', message: 'Your booking status has been updated.' };

  return (
    <EmailLayout title={`Booking ${statusInfo.label}`} preheader={`Your ${serviceName} booking is now ${statusInfo.label.toLowerCase()}`}>
      <Heading as="h1" style={{ fontSize: '24px', marginBottom: '16px' }}>
        Hello {customerName},
      </Heading>

      <Text style={{ marginBottom: '16px' }}>
        Your booking for <strong>{serviceName}</strong> through <strong>{businessName}</strong> has been updated.
      </Text>

      <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
        <Text style={{ fontWeight: '600', marginBottom: '8px' }}>Status Change</Text>
        <Text style={{ marginBottom: '4px' }}>
          <strong>From:</strong> <span style={{ color: '#6b7280' }}>{STATUS_MESSAGES[oldStatus]?.label || oldStatus}</span>
        </Text>
        <Text style={{ marginBottom: '4px' }}>
          <strong>To:</strong> <span style={{ color: statusInfo.color, fontWeight: '600' }}>{statusInfo.label}</span>
        </Text>
        <Text style={{ fontSize: '14px', color: '#6b7280' }}>{statusInfo.message}</Text>
      </div>

      {adminNote && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', margin: '16px 0' }}>
          <Text style={{ fontWeight: '600', marginBottom: '8px' }}>Note from our team:</Text>
          <Text style={{ fontSize: '14px' }}>{adminNote}</Text>
        </div>
      )}

      {newStatus === 'confirmed' && (
        <Text style={{ marginBottom: '16px' }}>
          We'll be in touch soon with any additional details. If you have questions, contact us:
        </Text>
      )}

      <Text style={{ marginBottom: '24px' }}>
        📧 {adminContactEmail}<br />
        📞 {adminContactPhone}
      </Text>
    </EmailLayout>
  );
}
```

---

## 4. Newsletter Confirmation (Double Opt-in)

**Trigger**: Newsletter signup → creates unconfirmed subscriber  
**Template**: `NewsletterConfirmationEmail`

```tsx
// src/server/email/templates/NewsletterConfirmationEmail.tsx
import { EmailLayout } from '@/components/Layout';
import { Section, Heading, Text, Link } from '@react-email/components';

interface Props {
  email: string;
  confirmUrl: string;
  source: string;
}

export function NewsletterConfirmationEmail(props: Props) {
  const { confirmUrl } = props;

  return (
    <EmailLayout title="Confirm your subscription" preheader="Please confirm your email to join our newsletter">
      <Heading as="h1" style={{ fontSize: '24px', marginBottom: '16px' }}>
        Welcome to Butts Productions!
      </Heading>

      <Text style={{ marginBottom: '16px' }}>
        Thanks for signing up for our newsletter. Please confirm your email address to start receiving updates.
      </Text>

      <Link href={confirmUrl} style={{ display: 'inline-block', margin: '24px 0' }}>
        <a style={{ background: '#1e40af', color: 'white', padding: '14px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>
          Confirm Subscription
        </a>
      </Link>

      <Text style={{ fontSize: '14px', color: '#6b7280' }}>
        If the button doesn't work, copy this link:<br />
        <Link href={confirmUrl} style={{ color: '#1e40af', wordBreak: 'break-all' }}>{confirmUrl}</Link>
      </Text>

      <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px' }}>
        This link expires in 24 hours. If you didn't sign up, please ignore this email.
      </Text>
    </EmailLayout>
  );
}
```

---

## 5. Newsletter Welcome (Post-Confirmation)

**Trigger**: Subscriber clicks confirmation link  
**Template**: `NewsletterWelcomeEmail`

```tsx
// Similar structure, thanks them and sets expectations
```

---

## 6. Admin Setup Complete (Internal)

**Trigger**: Initial admin setup completes  
**Template**: `AdminSetupCompleteEmail`

---

## 7. Password Reset (Future)

**Template**: `PasswordResetEmail`

---

## Email Sending Functions

```typescript
// src/server/email/booking.ts
import { sendEmail } from './service';
import { BookingConfirmationEmail } from './templates/BookingConfirmationEmail';
import { AdminBookingNotificationEmail } from './templates/AdminBookingNotificationEmail';
import { BookingStatusUpdateEmail } from './templates/BookingStatusUpdateEmail';

export async function sendBookingConfirmation(booking: Booking, service: Service, business: Business) {
  const formSummary = extractFormSummary(booking.formData, booking.formKey);
  
  // Customer
  await sendEmail({
    to: booking.customerEmail,
    subject: `Request Received: ${service.name} - ${business.name}`,
    react: BookingConfirmationEmail({
      customerName: booking.customerName,
      bookingId: booking._id.toString(),
      serviceName: service.name,
      businessName: business.name,
      submittedAt: booking.submittedAt,
      formSummary,
      adminContactEmail: config.email.fromEmail,
      adminContactPhone: config.app.contact.phone,
    }),
    tags: [{ name: 'type', value: 'booking_confirmation' }],
  });

  // Admin
  await sendEmail({
    to: config.email.fromEmail, // or dedicated admin email
    subject: `[New Booking] ${service.name} - ${booking.customerName}`,
    react: AdminBookingNotificationEmail({
      bookingId: booking._id.toString(),
      serviceName: service.name,
      businessName: business.name,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      submittedAt: booking.submittedAt,
      formData: booking.formData,
      adminDashboardUrl: `${config.app.url}/admin/bookings/${booking._id}`,
    }),
    tags: [{ name: 'type', value: 'admin_booking_notification' }],
  });
}

export async function sendBookingStatusUpdate(
  booking: Booking,
  service: Service,
  business: Business,
  oldStatus: BookingStatus,
  adminNote?: string
) {
  await sendEmail({
    to: booking.customerEmail,
    subject: `Update on your ${service.name} request: ${STATUS_MESSAGES[booking.status]?.label || booking.status}`,
    react: BookingStatusUpdateEmail({
      customerName: booking.customerName,
      bookingId: booking._id.toString(),
      serviceName: service.name,
      businessName: business.name,
      oldStatus,
      newStatus: booking.status,
      adminNote,
      adminContactEmail: config.email.fromEmail,
      adminContactPhone: config.app.contact.phone,
    }),
    tags: [{ name: 'type', value: 'booking_status_update' }],
  });
}
```

---

## Resend Template IDs (Production)

Create in Resend Dashboard → Templates:

| Template Name | Resend ID | Variables |
|---------------|-----------|-----------|
| `booking-confirmation` | `tmpl_xxx` | customerName, bookingId, serviceName, businessName, submittedAt, formSummary |
| `admin-booking-notification` | `tmpl_yyy` | bookingId, serviceName, businessName, customerName, customerEmail, customerPhone, submittedAt, formData, adminDashboardUrl |
| `booking-status-update` | `tmpl_zzz` | customerName, bookingId, serviceName, businessName, oldStatus, newStatus, adminNote |
| `newsletter-confirmation` | `tmpl_aaa` | confirmUrl |
| `newsletter-welcome` | `tmpl_bbb` | - |

**Usage with Resend Templates**:
```typescript
await resend.emails.send({
  from: `${config.email.fromName} <${config.email.fromEmail}>`,
  to: booking.customerEmail,
  template_id: 'tmpl_xxx',
  data: { customerName: booking.customerName, ... },
});
```

---

## Deliverability Checklist

- [ ] Domain authenticated (DKIM, SPF, DMARC) in Resend
- [ ] `noreply@buttsproductions.com` verified sender
- [ ] `info@buttsproductions.com` as reply-to
- [ ] Unsubscribe header: `List-Unsubscribe: <https://buttsproductions.com/unsubscribe?email=...>`
- [ ] Text version for all emails
- [ ] Preheader text on all emails
- [ ] Test with Litmus/Email on Acid
- [ ] Monitor bounce/complaint rates via Resend webhooks

---

## Approval

**Phase 2 Email Templates Deliverable** — Reply "Approved" to complete Phase 2 and proceed to Phase 3 (Design System), or request revisions.