require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    console.log("Trying:", process.env.DB_URL);
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected!");
    await mongoose.disconnect();
  } catch (e) {
    console.error("❌ Failed:", e.message);
  }
})();
