const db = require('./db');

(async () => {
  try {
    await db.initializeDatabase();
    console.log('DB init succeeded');
  } catch (err) {
    console.error('FULL ERROR OBJECT:');
    console.error(err);
    console.error('STACK:');
    console.error(err && err.stack);
  }
  process.exit(0);
})();
