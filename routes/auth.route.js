const express = require('express');
const router = express.Router();
require('dotenv').config();
const admin = require('../config/firebase');
UserModel = require('../models/user.model');
const UserService = require('../services/user.service');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Test authentication route
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns a test message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Authentication service is running"
 */
router.get("/", (req, res) => {
  res.send("Authentication service is running");
});

// Inscription
router.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Créer l'utilisateur dans Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password
      });

      firebase_uid = userRecord.uid
      const user = new UserModel(null, null, firebase_uid, email)
      // 2. Enregistrer en base MySQL
      await UserService.create(user);

      res.status(201).json({
        status: 'success',
        data: {
          uid: userRecord.uid,
          email: userRecord.email
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Connexion (génère un token JWT)
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Authentifier avec l'API REST Firebase
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error.message);

      // 2. Récupérer les infos utilisateur
      const user = await UserService.findByFirebaseUid(data.localId);

      res.status(200).json({
        token: data.idToken,
        user: {
          uid: data.localId,
          email: data.email
        }
      });
    } catch (error) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  });

module.exports = router

