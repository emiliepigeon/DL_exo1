/*
Ma logique pour ce fichier convert.js :

Ce fichier est mon assistant personnel pour la conversion des données CSV.
Il a pour mission de :
1. Lire mon fichier CSV d'entrée qui contient plein de coordonnées
2. Transformer ces coordonnées d'un système à un autre (comme par magie !)
3. Sauvegarder le résultat dans un nouveau fichier JSON pour que je puisse l'utiliser facilement après

C'est un peu comme si je prenais une liste de lieux écrits en français et que je les traduisais en anglais,
puis que je gardais cette nouvelle liste pour plus tard.
*/

// J'importe tous les outils dont j'ai besoin pour mon travail de conversion
const fs = require('fs'); // Pour lire et écrire des fichiers
const csv = require('csv-parser'); // Pour comprendre les fichiers CSV
const path = require('path'); // Pour gérer les chemins de fichiers facilement
const proj4 = require('proj4'); // Mon outil magique pour convertir les coordonnées

// Je définis les systèmes de coordonnées que je vais utiliser
proj4.defs("EPSG:20350", "+proj=utm +zone=50 +south +ellps=aust_SA +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

// Ma fonction pour convertir les coordonnées de mon fichier CSV
async function convertCSVData() {
    const results = []; // Je prépare un tableau pour stocker mes résultats
    const inputPath = path.join(__dirname, '..', 'data', 'input.csv'); // Le chemin vers mon fichier CSV d'entrée
    const outputPath = path.join(__dirname, '..', 'data', 'converted_data.json'); // Là où je vais sauvegarder mes données converties

    return new Promise((resolve, reject) => {
        // Lecture du fichier CSV avec csv-parser
        fs.createReadStream(inputPath) // Je commence à lire mon fichier CSV
            .pipe(csv()) // J'utilise csv-parser pour lire le fichier ligne par ligne
            .on('data', (data) => {
                // Pour chaque ligne de mon CSV...
                const [lon, lat] = proj4("EPSG:20350", "EPSG:4326", [parseFloat(data.X), parseFloat(data.Y)]);
                
                // Je crée un nouvel objet avec toutes les infos, y compris les nouvelles coordonnées
                results.push({
                    ...data,
                    lon: parseFloat(lon.toFixed(6)), // J'arrondis la longitude à 6 chiffres après la virgule
                    lat: parseFloat(lat.toFixed(6))  // J'arrondis la latitude à 6 chiffres après la virgule
                });
            })
            .on('end', async () => {
                try {
                    // J'écris les résultats dans mon fichier JSON
                    await fs.promises.writeFile(outputPath, JSON.stringify(results, null, 2));
                    console.log("Youpi ! J'ai converti et sauvegardé les données avec succès !");
                    resolve(results);
                } catch (error) {
                    console.error("Oh non ! Je n'ai pas pu sauvegarder les données converties :", error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error("Aïe ! Il y a eu un problème pendant la lecture du CSV :", error);
                reject(error);
            });
    });
}

// J'exporte ma fonction pour pouvoir l'utiliser dans d'autres fichiers
module.exports = { convertCSVData };
