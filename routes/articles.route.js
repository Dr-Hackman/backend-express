const express = require('express');
const router = express.Router();
require('dotenv').config();
ArticleModel = require('../models/article.model');
const ArticleService = require('../services/article.service');

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
router.get("/", (req, res) => {
    res.send("Articles service is running");
});

router.post('/ajouter', async (req, res) => {
    try {
        const { title, description, image_url, author_id, published_at } = req.body;

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
        const { title, description, image_url } = req.body;

        await ArticleService.updateArticle({id, title, description, image_url, author_id, published_at });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
});

module.exports = router

