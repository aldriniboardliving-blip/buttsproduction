/*
 * Dev-only seed: creates the first superadmin and the default categories so
 * the admin UI can be exercised. Content itself is created through the UI in
 * the end-to-end test, not here.
 */
const mongoose = require('mongoose');
const argon2 = require('@node-rs/argon2');

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME;

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'superadmin' },
    permissions: [String],
    loginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: String,
    displayOrder: { type: Number, default: 0 },
    serviceCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CATEGORIES = [
  { name: 'Cleaning', slug: 'cleaning' },
  { name: 'Consulting', slug: 'consulting' },
  { name: 'Transport', slug: 'transport' },
  { name: 'Creative', slug: 'creative' },
  { name: 'Community', slug: 'community' },
];

(async () => {
  if (!URI || !DB_NAME) {
    console.error('MONGODB_URI / MONGODB_DB_NAME not set');
    process.exit(1);
  }

  await mongoose.connect(URI, { dbName: DB_NAME });
  console.log('connected');

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

  const email = 'admin@buttsproductions.com';
  const password = 'ChangeMe123!';

  const existing = await AdminUser.findOne({ email });
  if (!existing) {
    const passwordHash = await argon2.hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
    await AdminUser.create({ email, passwordHash, name: 'Site Administrator', role: 'superadmin', permissions: [] });
    console.log('admin created');
  } else {
    console.log('admin already exists');
  }

  for (const category of CATEGORIES) {
    await Category.updateOne({ slug: category.slug }, { $set: category }, { upsert: true });
  }
  console.log('categories ensured');

  await mongoose.disconnect();
  console.log('SEED_OK');
})().catch((error) => {
  console.error('SEED_FAILED', error.message);
  process.exit(1);
});