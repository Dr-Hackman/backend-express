const db = require('../config/db');

module.exports = {
  create: async (user) => {
    firebase_uid = user.firebase_uid
    email = user.email
    const [result] = await db.query(
      'INSERT INTO users (firebase_uid, email ) VALUES (?, ?)',
      [firebase_uid, email]
    );
    return { id: result.insertId };
  },

  findByFirebaseUid: async (uid) => {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [uid]
    );
    return rows[0];
  }
};