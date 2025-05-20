const admin = require("firebase-admin");

// Vérifie le token Firebase
module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Accès refusé");

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = { uid: decoded.uid, email: decoded.email };
        next();
    } catch (error) {
       res.status(400).send("Token invalide");
    }
};
