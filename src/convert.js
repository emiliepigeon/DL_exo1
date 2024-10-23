// src/convert.js

// Importation des modules nécessaires
const proj4 = require('proj4'); // Bibliothèque pour la conversion de coordonnées géographiques
const fs = require('fs'); // Module pour interagir avec le système de fichiers
const path = require('path'); // Permet de gérer correctement les chemins vers les fichiers
const { parse } = require('csv-parse'); // Module pour parser des fichiers CSV

// Définition des systèmes de coordonnées que j'utilise dans mon projet
proj4.defs("EPSG:20350", "+proj=utm +zone=50 +south +ellps=aust_SA +units=m +no_defs"); // Système de coordonnées UTM Zone 50S
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs"); // Système de coordonnées WGS 84 (longitude/latitude)

// Fonction pour convertir les coordonnées de mon fichier CSV
function convertCoordinates(data) {
  return data.map(item => {
    // Conversion de X/Y (EPSG:20350) vers longitude/latitude (EPSG:4326)
    const [lon, lat] = proj4("EPSG:20350", "EPSG:4326", [parseFloat(item.X), parseFloat(item.Y)]);
    
    // Retourne un nouvel objet avec les coordonnées converties et arrondies à 6 décimales
    return {
      ...item, // Conserve les autres propriétés de l'objet d'origine
      lon: parseFloat(lon.toFixed(6)), // Arrondi la longitude à 6 décimales
      lat: parseFloat(lat.toFixed(6))  // Arrondi la latitude à 6 décimales
    };
  });
}

// Utilisation de path.join pour créer un chemin correct vers le fichier input.csv
const csvFilePath = path.join(__dirname, '..', 'data', 'input.csv');

// Lecture et traitement du fichier CSV
fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier:", err); // Affiche une erreur si le fichier ne peut pas être lu
    return;
  }

  // Parsing du CSV pour obtenir un tableau d'objets
  parse(data, {
    columns: true, // Indique que la première ligne contient les noms des colonnes
    skip_empty_lines: true // Ignore les lignes vides dans le fichier CSV
  }, (err, records) => {
    if (err) {
      console.error("Erreur lors du parsing CSV:", err); // Affiche une erreur si le parsing échoue
      return;
    }

    // Conversion des coordonnées et affichage du résultat dans la console
    const outputData = convertCoordinates(records);
    console.log(JSON.stringify(outputData, null, 2)); // Affiche le résultat au format JSON avec indentation
  });
});
