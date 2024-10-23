// src/app.js

// Importation des modules nécessaires pour mon application Express
const express = require('express'); // Framework web pour Node.js
const bodyParser = require('body-parser'); // Middleware pour parser le corps des requêtes HTTP en JSON
const path = require('path'); // Permet de gérer les chemins vers les fichiers
const proj4 = require('proj4'); // Bibliothèque pour la conversion de systèmes de coordonnées géographiques

// Création de mon application Express
const app = express();
const port = 3000; // Port sur lequel mon serveur va écouter

// Middleware pour parser le JSON dans les requêtes entrantes
app.use(bodyParser.json());

// Configuration pour servir mes fichiers statiques depuis le dossier public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', 'public'))); // Sert tous les fichiers dans le dossier public

// Définition des systèmes de coordonnées que j'utilise dans mon API
proj4.defs("EPSG:20350", "+proj=utm +zone=50 +south +ellps=aust_SA +units=m +no_defs"); // Système UTM Zone 50S
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // Système WGS 84 (longitude/latitude)

// Fonction générique pour convertir des coordonnées entre différents systèmes de référence spatiale
function convertCoordinates(x, y, fromCRS, toCRS) {
    return proj4(fromCRS, toCRS, [parseFloat(x), parseFloat(y)]); // Retourne les coordonnées converties
}

// Route API pour la conversion des coordonnées via une requête POST
app.post('/convert', (req, res) => {
    const { x, y, fromCRS, toCRS } = req.body; // Récupération des données envoyées dans la requête

    // Vérification que tous les paramètres nécessaires sont présents dans la requête
    if (x === undefined || y === undefined || !fromCRS || !toCRS) {
        return res.status(400).json({ error: 'Paramètres manquants ou invalides' }); // Retourne une erreur si les paramètres sont invalides
    }

    try {
        // Conversion des coordonnées en appelant ma fonction générique et en renvoyant le résultat au client
        const [newX, newY] = convertCoordinates(x, y, fromCRS, toCRS);
        res.json({ x: newX, y: newY }); // Envoie les nouvelles coordonnées au format JSON en réponse à la requête
    } catch (error) {
        console.error('Erreur de conversion:', error); // Affiche une erreur dans la console si une exception est levée lors de la conversion
        res.status(500).json({ error: 'Erreur lors de la conversion: ' + error.message }); // Retourne une erreur serveur au client
    }
});

// Gestion des erreurs liées au parsing JSON par body-parser
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'JSON invalide' }); // Retourne une erreur si le JSON est malformé dans la requête
    }
    next(); // Passe à l'étape suivante si aucune erreur n'est détectée
});

// Démarrage de mon serveur sur le port spécifié et affichage d'un message dans la console indiquant que le serveur est opérationnel
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`); 
});
