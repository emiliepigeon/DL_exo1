/*
Ma logique pour ce fichier dataManager.js :

Ce fichier est comme mon assistant personnel pour gérer les données de mon application.
Il a pour mission de :
1. Lire les données converties depuis le fichier JSON
2. Les préparer pour qu'elles soient faciles à utiliser dans mon tableau
3. Fournir une fonction pour récupérer ces données quand j'en ai besoin

C'est un peu comme si j'avais un bibliothécaire qui organise mes livres (données) 
et me les apporte quand je lui demande !
*/

// J'importe les outils dont j'ai besoin
const fs = require('fs').promises; // Pour lire des fichiers de manière asynchrone
const path = require('path'); // Pour gérer les chemins de fichiers facilement

// Je définis le chemin vers mon fichier de données converties
const dataFilePath = path.join(__dirname, '..', 'data', 'converted_data.json');

// Ma fonction pour lire et préparer les données
async function getConvertedData() {
    try {
        // Je lis le contenu de mon fichier JSON
        const rawData = await fs.readFile(dataFilePath, 'utf8');
        
        // Je transforme le contenu JSON en un objet JavaScript
        const data = JSON.parse(rawData);

        // Je vérifie si j'ai bien des données
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Oups ! Mes données ne sont pas dans le bon format ou le fichier est vide.");
        }

        // Je retourne mes données toutes propres et prêtes à l'emploi
        return data;

    } catch (error) {
        // Si quelque chose ne va pas, je le signale
        console.error("Oh non ! Il y a eu un problème pour lire mes données :", error);
        throw error; // Je relance l'erreur pour que celui qui utilise cette fonction sache qu'il y a eu un souci
    }
}

// J'exporte ma fonction pour pouvoir l'utiliser dans d'autres fichiers
module.exports = {
    getConvertedData
};
