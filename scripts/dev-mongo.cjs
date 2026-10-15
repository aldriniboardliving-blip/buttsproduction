const { MongoMemoryServer } = require('mongodb-memory-server');

// Dev-only: runs a real MongoDB on the standard port so the app's
// MONGODB_URI resolves during end-to-end verification.
(async () => {
  const server = await MongoMemoryServer.create({
    instance: { port: 27017, dbName: 'buttsproductions' },
  });
  console.log('MONGO_LISTENING ' + server.getUri());

  const stop = async () => {
    await server.stop();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  setInterval(() => {}, 1 << 30);
})();