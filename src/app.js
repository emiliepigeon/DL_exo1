/*
Ma logique pour ce fichier app.js :

Ce fichier est le cerveau de mon serveur. Il a pour mission de :
1. Configurer mon application Express pour qu'elle soit prête à recevoir des requêtes
2. Définir les routes pour que mon application sache quoi faire quand on lui demande quelque chose
3. Gérer la conversion des coordonnées quand on le lui demande
4. Lire et servir les données CSV converties pour les afficher dans mon tableau sur la page web
5. Démarrer le serveur et le faire écouter sur un port spécifique

C'est comme si je créais un petit robot qui sait répondre à différentes questions et demandes !
*/

// J'importe tous les outils dont j'ai besoin pour mon serveur
const express = require('express'); // Mon framework web préféré pour créer des serveurs
const bodyParser = require('body-parser'); // Pour comprendre facilement les données envoyées par les utilisateurs
const path = require('path'); // Pour gérer les chemins de fichiers facilement
const proj4 = require('proj4'); // Ma boîte à outils magique pour convertir les coordonnées
const fs = require('fs').promises; // Pour lire et écrire des fichiers de manière moderne
const { convertCSVData } = require('./convert'); // Ma fonction spéciale pour convertir les données CSV

// Je crée mon application serveur
const app = express();
const port = 3000; // Le numéro de la porte où mon serveur va écouter

// Je dis à mon serveur comment comprendre les données qu'on lui envoie
app.use(bodyParser.json());

// Je dis à mon serveur où trouver mes fichiers HTML, CSS et JavaScript
app.use(express.static(path.join(__dirname, '..', 'public')));

// Je définis les systèmes de coordonnées que je vais utiliser
proj4.defs("EPSG:20350", "+proj=utm +zone=50 +south +ellps=aust_SA +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

// Ma fonction pour convertir les coordonnées d'un système à un autre
function convertCoordinates(x, y, fromCRS, toCRS) {
    return proj4(fromCRS, toCRS, [parseFloat(x), parseFloat(y)]);
}

// Quand quelqu'un demande de convertir des coordonnées, mon serveur fait ça
app.post('/convert', (req, res) => {
    const { x, y, fromCRS, toCRS } = req.body;

    if (x === undefined || y === undefined || !fromCRS || !toCRS) {
        return res.status(400).json({ error: 'Il me manque des informations pour faire la conversion' });
    }

    try {
        const [newX, newY] = convertCoordinates(x, y, fromCRS, toCRS);
        res.json({ x: newX, y: newY });
    } catch (error) {
        console.error('Oups, je n\'ai pas réussi à faire la conversion:', error);
        res.status(500).json({ error: 'Désolé, je n\'ai pas pu faire la conversion: ' + error.message });
    }
});

// Nouvelle route pour servir les données converties
app.get('/converted-data', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, '..', 'data', 'converted_data.json');
        const data = await fs.readFile(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Oh non ! Je n'arrive pas à lire les données converties :", error);
        res.status(500).json({ error: 'Impossible de lire les données converties' });
    }
});

// Je lance la conversion des données CSV au démarrage du serveur
convertCSVData().then(() => {
    console.log("Super ! J'ai converti les données CSV avec succès !");
    app.listen(port, () => {
        console.log(`Super ! Mon serveur est prêt sur http://localhost:${port}`);
    });
}).catch((error) => {
    console.error("Oh non ! Il y a eu un problème lors de la conversion des données CSV :", error);
});
