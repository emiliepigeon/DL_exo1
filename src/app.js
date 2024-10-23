// src/app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const proj4 = require('proj4');

const app = express(); // Correction pour ma première erreur de console : 
//créer l'application Express et initialise correctement mon app.js comme API Express
const port = 3000; //localhost

app.use(bodyParser.json());

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/convert', (req, res) => {
    // Votre logique de conversion ici
    // ...
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
