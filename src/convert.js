// src/convert.js

const proj4 = require('proj4');
const fs = require('fs');
const path = require('path'); // permet de gérer correctement les chemins vers les fichiers
const { parse } = require('csv-parse');

// Définition des systèmes de coordonnées
proj4.defs("EPSG:20350", "+proj=utm +zone=50 +south +ellps=aust_SA +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

function convertCoordinates(data) {
  return data.map(item => {
    const [lon, lat] = proj4("EPSG:20350", "EPSG:4326", [parseFloat(item.X), parseFloat(item.Y)]);
    return {
      ...item,
      lon: parseFloat(lon.toFixed(6)),
      lat: parseFloat(lat.toFixed(6))
    };
  });
}

// Utilisation de path.join pour créer un chemin correct vers le fichier input.csv
const csvFilePath = path.join(__dirname, '..', 'data', 'input.csv');

fs.readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Erreur lors de la lecture du fichier:", err);
    return;
  }

  parse(data, {
    columns: true,
    skip_empty_lines: true
  }, (err, records) => {
    if (err) {
      console.error("Erreur lors du parsing CSV:", err);
      return;
    }

    const outputData = convertCoordinates(records);
    console.log(JSON.stringify(outputData, null, 2));
  });
});
