// J'attends que le DOM soit complètement chargé avant d'exécuter mon script
document.addEventListener('DOMContentLoaded', function () {
    // Je récupère tous les éléments du DOM dont j'ai besoin
    const convertToLatLongButton = document.getElementById('convertToLatLong'); // Bouton pour convertir X/Y vers Lat/Long
    const convertToXYButton = document.getElementById('convertToXY'); // Bouton pour convertir Lat/Long vers X/Y
    const resetXYButton = document.getElementById('resetXY'); // Bouton pour réinitialiser les champs X/Y
    const resetLatLongButton = document.getElementById('resetLatLong'); // Bouton pour réinitialiser les champs Lat/Long
    const resetHistoryButton = document.getElementById('resetHistory'); // Bouton pour effacer l'historique

    // J'ajoute des écouteurs d'événements pour mes boutons de conversion
    convertToLatLongButton.addEventListener('click', () => convertCoordinates('EPSG:20350', 'EPSG:4326', 'x-input', 'y-input', 'lat-result', 'long-result'));

    convertToXYButton.addEventListener('click', () => convertCoordinates('EPSG:4326', 'EPSG:20350', 'lat-input', 'long-input', 'x-result', 'y-result'));

    // J'ajoute des écouteurs d'événements pour mes boutons de réinitialisation
    resetXYButton.addEventListener('click', () => resetFields('x-input', 'y-input', 'lat-result', 'long-result'));

    resetLatLongButton.addEventListener('click', () => resetFields('lat-input', 'long-input', 'x-result', 'y-result'));

    // J'ajoute un écouteur d'événements pour le bouton de réinitialisation de l'historique
    resetHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('conversionHistory'); // Efface l'historique du localStorage
        updateHistoryTable(); // Met à jour l'affichage du tableau d'historique après suppression
    });

    // Je charge l'historique des conversions au démarrage de la page
    loadConversionHistory();
});

// Ma fonction pour convertir les coordonnées entre différents systèmes de référence spatiale
function convertCoordinates(fromCRS, toCRS, inputId1, inputId2, resultId1, resultId2) {
    // Je récupère les valeurs saisies par l'utilisateur dans les champs d'entrée
    const value1 = document.getElementById(inputId1).value; // Valeur de la coordonnée X ou Latitude
    const value2 = document.getElementById(inputId2).value; // Valeur de la coordonnée Y ou Longitude

    // Je vérifie que les champs ne sont pas vides avant de procéder à la conversion
    if (!value1 || !value2) {
        alert("Veuillez entrer des valeurs pour les deux champs."); // Alerte si des champs sont vides
        return; // Sortie de la fonction si les champs sont vides
    }

    // Je détermine le type d'entrée et de sortie en fonction du système de référence spatial utilisé
    const inputType1 = fromCRS === 'EPSG:20350' ? 'X' : 'Longitude'; // Détermine si c'est X ou Longitude
    const inputType2 = fromCRS === 'EPSG:20350' ? 'Y' : 'Latitude';  // Détermine si c'est Y ou Latitude
    const outputType1 = toCRS === 'EPSG:20350' ? 'X' : 'Longitude';   // Détermine le type de sortie 1
    const outputType2 = toCRS === 'EPSG:20350' ? 'Y' : 'Latitude';     // Détermine le type de sortie 2

    // J'envoie une requête à mon serveur pour effectuer la conversion des coordonnées
    fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Indique que le corps de la requête est en JSON
        body: JSON.stringify({
            x: parseFloat(value1),  // Convertit la valeur X en nombre flottant
            y: parseFloat(value2),  // Convertit la valeur Y en nombre flottant
            fromCRS: fromCRS,       // Système de référence source
            toCRS: toCRS            // Système de référence cible
        }),
    })
        .then(response => response.json()) // Convertit la réponse en JSON
        .then(data => {
            if (data.error) throw new Error(data.error); // Lève une erreur si une erreur est renvoyée par le serveur

            // J'affiche les résultats de la conversion dans les champs correspondants
            document.getElementById(resultId1).value = data.x.toFixed(6); // Affiche le résultat X ou Longitude arrondi à 6 décimales
            document.getElementById(resultId2).value = data.y.toFixed(6); // Affiche le résultat Y ou Latitude arrondi à 6 décimales

            // J'ajoute cette conversion à mon historique pour un suivi ultérieur
            addToHistory(
                fromCRS,
                toCRS,
                { type: inputType1, value: value1 },  // Information sur l'entrée 1 (type et valeur)
                { type: inputType2, value: value2 },  // Information sur l'entrée 2 (type et valeur)
                { type: outputType1, value: data.x.toFixed(6) },  // Information sur la sortie 1 (type et valeur)
                { type: outputType2, value: data.y.toFixed(6) }   // Information sur la sortie 2 (type et valeur)
            );
        })
        .catch((error) => {
            console.error('Erreur:', error); // Affiche l'erreur dans la console pour le débogage
            alert('Erreur lors de la conversion: ' + error.message); // Alerte utilisateur en cas d'erreur lors de la conversion
        });
}

// Ma fonction pour ajouter une conversion à l'historique stocké dans localStorage
function addToHistory(from, to, input1, input2, output1, output2) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]'); // Récupère l'historique existant ou crée un tableau vide

    history.push({ from, to, input1, input2, output1, output2, date: new Date().toISOString() }); // Ajoute la nouvelle conversion à l'historique

    localStorage.setItem('conversionHistory', JSON.stringify(history)); // Sauvegarde l'historique mis à jour dans localStorage

    updateHistoryTable(); // Met à jour l'affichage du tableau d'historique avec les nouvelles données ajoutées
}

// Ma fonction pour charger et afficher l'historique des conversions depuis localStorage
function loadConversionHistory() {
    updateHistoryTable(); // Appelle la fonction qui met à jour le tableau d'historique au chargement de la page
}

// Ma fonction pour mettre à jour le tableau d'historique affiché sur la page
function updateHistoryTable() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]'); // Récupère l'historique depuis localStorage

    const tableBody = document.querySelector('#conversionHistory tbody');
    tableBody.innerHTML = ''; // Vide le contenu actuel du tableau avant de le remplir avec les nouvelles données

    history.forEach(entry => {  // Pour chaque entrée dans l'historique...
        const row = tableBody.insertRow();  // Crée une nouvelle ligne dans le tableau

        row.innerHTML = `
            <td>${entry.from}</td> <!-- Colonne "De", affiche d'où provient cette conversion -->
            <td>${entry.to}</td> <!-- Colonne "Vers", affiche vers où va cette conversion -->
            <td>${entry.input1.type}: ${entry.input1.value}</td> <!-- Colonne "Entrée 1", affiche son type et sa valeur -->
            <td>${entry.input2.type}: ${entry.input2.value}</td> <!-- Colonne "Entrée 2", affiche son type et sa valeur -->
            <td>${entry.output1.type}: ${entry.output1.value}</td> <!-- Colonne "Sortie 1", affiche son type et sa valeur -->
            <td>${entry.output2.type}: ${entry.output2.value}</td> <!-- Colonne "Sortie 2", affiche son type et sa valeur -->
        `;
    });
}

// Ma fonction pour réinitialiser les champs d'entrée et de résultat sur demande.
function resetFields(...fieldIds) {
    fieldIds.forEach(id => {  // Pour chaque ID passé en argument...
        document.getElementById(id).value = '';  // Vide le champ correspondant.
    });
}
