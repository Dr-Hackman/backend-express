const db = require('../config/db');

module.exports = {
    create: async ({ title, description, image_url, author_id, published_at }) => {
        //title = article.title
        const [result] = await db.query(
            'INSERT INTO articles (title, description, image_url, author_id, published_at ) VALUES (?, ?, ?, ?, ?)',
            [title, description, image_url, author_id, published_at]
        );
        return { id: result.insertId };
    },

    find: async () => {
        const [rows] = await db.query(
            'SELECT * FROM articles',
        );
        return [rows];
    },

    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM articles WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    findByIdByUser: async (id, uid) => {
        const [rows] = await db.query(
            'SELECT * FROM articles WHERE id = ? AND author_id = ?',
            [id, uid]
        );
        return rows[0];
    },

    findByUserId: async (uid) => {
        const [rows] = await db.query(
            'SELECT * FROM articles WHERE author_id = ?',
            [uid]
        );
        return [rows];
    },

    updateArticle: async (id, newtitle, newdescription, newimage_url) => {
        const [result] = await db.query(
            'UPDATE articles SET title = ?, description = ?, image_url = ? WHERE id = ?',
            [newtitle, newdescription, newimage_url, id]
        );
        return { result };
    },

    deleteArticle: async(id) => {
        const result = await db.query('DELETE FROM articles WHERE id = ?', [id]);
        return result;
    }
}