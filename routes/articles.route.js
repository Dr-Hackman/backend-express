const express = require('express');
const router = express.Router();
require('dotenv').config();
ArticleModel = require('../models/article.model');
const ArticleService = require('../services/article.service');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Articles endpoints
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Test Articles route
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Returns a test message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Articles service is running"
 */
router.get("/", async (req, res) => {
    try {
        const [result] = await ArticleService.find();

        res.status(200).json({
            status: 'success',
            data :result
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:author_id", async (req, res) => {
    try {
        const author_id = req.params.author_id;
        const [result] = await ArticleService.findByUserId(author_id);

        res.status(200).json({
            status: 'success',
            data :result
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/ajouter', upload.single('image'), async (req, res) => {
    try {
        const { title, description, author_id, published_at } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        await ArticleService.create({title, description, image_url, author_id, published_at: new Date()  });

        res.status(201).json({
            status: 'success',
            data: {
                title: title,
                description: description,
                image_url: image_url,
                author_id: author_id,
                published_at: published_at
            }
        });
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async(req, res) => {
    try{
        const articleId = req.params.id;
        const author_id = req.user.uid;
        const { title, description, image_url } = req.body;

        const article = await ArticleService.findByIdByUser({ articleId, author_id });
        if (!article) {
            return res.status(404).json({ error: 'Article non trouvé ou accès refusé' });
        }

        await ArticleService.updateArticle({id, title, description, image_url, author_id, published_at });

        res.status(201).json({
            status: 'success',
            data: {
                id: updatedArticle.id,
                title: updatedArticle.title,
                description: updatedArticle.description,
                image_url: updatedArticle.image_url,
                updated_at: updatedArticle.updated_at
            }
        });

    }catch(error){
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async(req, res) => {
    try{
        const articleId = req.params.id;

        await ArticleService.deleteArticle(articleId);

        res.status(200).json({
            status: 'success',
            message: 'Deleted successfully'
        });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router

