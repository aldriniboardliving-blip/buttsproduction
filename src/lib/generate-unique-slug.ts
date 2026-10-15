export async function generateUniqueSlug(
  model: { exists: (query: Record<string, unknown>) => Promise<unknown> },
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: Record<string, unknown> = { slug, archivedAt: { $exists: false } };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await model.exists(query);
    if (!exists) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}