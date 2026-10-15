export type Permission =
  | 'business:create' | 'business:read' | 'business:update' | 'business:delete'
  | 'business:publish' | 'business:reorder'
  | 'service:create' | 'service:read' | 'service:update' | 'service:delete'
  | 'service:publish' | 'service:reorder' | 'service:assign'
  | 'category:create' | 'category:read' | 'category:update' | 'category:delete'
  | 'page:create' | 'page:read' | 'page:update' | 'page:delete'
  | 'page:publish' | 'block:manage'
  | 'navigation:create' | 'navigation:read' | 'navigation:update' | 'navigation:delete'
  | 'navigation:reorder'
  | 'media:upload' | 'media:read' | 'media:update' | 'media:delete'
  | 'booking:read' | 'booking:update' | 'booking:note' | 'booking:export'
  | 'event:create' | 'event:read' | 'event:update' | 'event:delete' | 'event:publish'
  | 'faq:create' | 'faq:read' | 'faq:update' | 'faq:delete' | 'faq:publish'
  | 'testimonial:create' | 'testimonial:read' | 'testimonial:update' | 'testimonial:delete'
  | 'settings:read' | 'settings:update'
  | 'legal:create' | 'legal:read' | 'legal:update' | 'legal:delete'
  | 'team:create' | 'team:read' | 'team:update' | 'team:delete'
  | 'statistic:create' | 'statistic:read' | 'statistic:update' | 'statistic:delete'
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  superadmin: [
    'business:create', 'business:read', 'business:update', 'business:delete',
    'business:publish', 'business:reorder',
    'service:create', 'service:read', 'service:update', 'service:delete',
    'service:publish', 'service:reorder', 'service:assign',
    'category:create', 'category:read', 'category:update', 'category:delete',
    'page:create', 'page:read', 'page:update', 'page:delete',
    'page:publish', 'block:manage',
    'navigation:create', 'navigation:read', 'navigation:update', 'navigation:delete',
    'navigation:reorder',
    'media:upload', 'media:read', 'media:update', 'media:delete',
    'booking:read', 'booking:update', 'booking:note', 'booking:export',
    'event:create', 'event:read', 'event:update', 'event:delete', 'event:publish',
    'faq:create', 'faq:read', 'faq:update', 'faq:delete', 'faq:publish',
    'testimonial:create', 'testimonial:read', 'testimonial:update', 'testimonial:delete',
    'settings:read', 'settings:update',
    'legal:create', 'legal:read', 'legal:update', 'legal:delete',
    'team:create', 'team:read', 'team:update', 'team:delete',
    'statistic:create', 'statistic:read', 'statistic:update', 'statistic:delete',
    'user:create', 'user:read', 'user:update', 'user:delete',
    'audit:read',
  ],
  content_manager: [
    'business:read', 'business:update', 'business:publish', 'business:reorder',
    'service:read', 'service:update', 'service:publish', 'service:reorder', 'service:assign',
    'category:read', 'category:update',
    'page:read', 'page:update', 'page:publish', 'block:manage',
    'navigation:read', 'navigation:update', 'navigation:reorder',
    'media:upload', 'media:read', 'media:update',
    'event:read', 'event:update', 'event:publish',
    'faq:read', 'faq:update', 'faq:publish',
    'testimonial:read', 'testimonial:update',
    'legal:read', 'legal:update',
    'team:read', 'team:update',
    'statistic:read', 'statistic:update',
    'settings:read',
  ],
  booking_manager: [
    'business:read',
    'service:read',
    'media:read',
    'booking:read', 'booking:update', 'booking:note', 'booking:export',
    'event:read',
    'faq:read',
    'settings:read',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function requirePermission(role: string, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}
