// J'attends que le DOM soit complètement chargé avant d'exécuter mon script
document.addEventListener('DOMContentLoaded', function() {
    // Je récupère tous les éléments du DOM dont j'ai besoin
    const convertToLatLongButton = document.getElementById('convertToLatLong');
    const convertToXYButton = document.getElementById('convertToXY');
    const resetXYButton = document.getElementById('resetXY');
    const resetLatLongButton = document.getElementById('resetLatLong');

    // J'ajoute des écouteurs d'événements pour mes boutons de conversion
    convertToLatLongButton.addEventListener('click', () => convertCoordinates('EPSG:20350', 'EPSG:4326', 'x-input', 'y-input', 'lat-result', 'long-result'));
    convertToXYButton.addEventListener('click', () => convertCoordinates('EPSG:4326', 'EPSG:20350', 'lat-input', 'long-input', 'x-result', 'y-result'));

    // J'ajoute des écouteurs d'événements pour mes boutons de réinitialisation
    resetXYButton.addEventListener('click', () => resetFields('x-input', 'y-input', 'lat-result', 'long-result'));
    resetLatLongButton.addEventListener('click', () => resetFields('lat-input', 'long-input', 'x-result', 'y-result'));

    // Je charge l'historique des conversions au démarrage de la page
    loadConversionHistory();
});

// Ma fonction pour convertir les coordonnées
function convertCoordinates(fromCRS, toCRS, inputId1, inputId2, resultId1, resultId2) {
    // Je récupère les valeurs saisies par l'utilisateur
    const value1 = document.getElementById(inputId1).value;
    const value2 = document.getElementById(inputId2).value;

    // Je vérifie que les champs ne sont pas vides
    if (!value1 || !value2) {
        alert("Veuillez entrer des valeurs pour les deux champs.");
        return;
    }

    // Je détermine les types d'entrée et de sortie
    const inputType1 = fromCRS === 'EPSG:20350' ? 'X' : 'Longitude';
    const inputType2 = fromCRS === 'EPSG:20350' ? 'Y' : 'Latitude';
    const outputType1 = toCRS === 'EPSG:20350' ? 'X' : 'Longitude';
    const outputType2 = toCRS === 'EPSG:20350' ? 'Y' : 'Latitude';

    // J'envoie une requête à mon serveur pour effectuer la conversion
    fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: parseFloat(value1),
            y: parseFloat(value2),
            fromCRS: fromCRS,
            toCRS: toCRS
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error);
        
        // J'affiche les résultats de la conversion
        document.getElementById(resultId1).value = data.x.toFixed(6);
        document.getElementById(resultId2).value = data.y.toFixed(6);

        // J'ajoute cette conversion à mon historique
        addToHistory(
            fromCRS, 
            toCRS, 
            { type: inputType1, value: value1 },
            { type: inputType2, value: value2 },
            { type: outputType1, value: data.x.toFixed(6) },
            { type: outputType2, value: data.y.toFixed(6) }
        );
    })
    .catch((error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la conversion: ' + error.message);
    });
}

// Ma fonction pour ajouter une conversion à l'historique
function addToHistory(from, to, input1, input2, output1, output2) {
    // Je récupère l'historique existant ou je crée un tableau vide
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    // J'ajoute la nouvelle conversion à l'historique
    history.push({ from, to, input1, input2, output1, output2, date: new Date().toISOString() });
    // Je sauvegarde l'historique mis à jour dans le localStorage
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    // Je mets à jour l'affichage de mon tableau d'historique
    updateHistoryTable();
}

// Ma fonction pour charger et afficher l'historique des conversions
function loadConversionHistory() {
    updateHistoryTable();
}

// Ma fonction pour mettre à jour le tableau d'historique
function updateHistoryTable() {
    // Je récupère l'historique depuis le localStorage
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const tableBody = document.querySelector('#conversionHistory tbody');
    tableBody.innerHTML = ''; // Je vide le contenu actuel du tableau

    // Je crée une nouvelle ligne pour chaque entrée de l'historique
    history.forEach(entry => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${entry.from}</td>
            <td>${entry.to}</td>
            <td>${entry.input1.type}: ${entry.input1.value}</td>
            <td>${entry.input2.type}: ${entry.input2.value}</td>
            <td>${entry.output1.type}: ${entry.output1.value}</td>
            <td>${entry.output2.type}: ${entry.output2.value}</td>
        `;
    });
}

// Ma fonction pour réinitialiser les champs
function resetFields(...fieldIds) {
    // Je vide la valeur de chaque champ spécifié
    fieldIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}
