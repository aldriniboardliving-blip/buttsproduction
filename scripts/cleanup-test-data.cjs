const mongoose = require('mongoose');
(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/buttsproductions', { dbName: 'buttsproductions' });
  const db = mongoose.connection.db;
  const b = await db.collection('businesses').deleteMany({ $or: [
    { name: /^Granby Street Cleaning Co/ }, { name: /^Debug Co/ }
  ]});
  const a = await db.collection('auditlogs').deleteMany({ $or: [
    { targetSlug: /^granby-street-cleaning-co/ }, { targetSlug: /^debug-co/ }
  ]});
  await db.collection('sessions').deleteMany({});
  console.log('removed businesses:', b.deletedCount, '| audit rows:', a.deletedCount);
  for (const name of ['businesses','services','events','faqs','products','teammembers','categories','auditlogs']) {
    console.log(name, await db.collection(name).countDocuments());
  }
  await mongoose.disconnect();
})();