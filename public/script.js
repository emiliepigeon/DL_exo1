/*
Ma logique pour ce fichier script.js :

Ce script est le cerveau de mon application côté client. Il doit :
1. Attendre que la page soit chargée avant de commencer à travailler.
2. Configurer tous les boutons pour qu'ils fassent ce que je veux quand on clique dessus.
3. Gérer les conversions de coordonnées quand l'utilisateur le demande.
4. Afficher l'historique des conversions et le mettre à jour.
5. Charger et afficher les données CSV converties dans un joli tableau.

C'est comme si je créais un assistant virtuel qui aide l'utilisateur à utiliser mon application !
*/

// J'attends que le DOM soit complètement chargé avant d'exécuter mon script.
document.addEventListener('DOMContentLoaded', function () {
    // Je récupère tous les éléments du DOM dont j'ai besoin.
    const convertToLatLongButton = document.getElementById('convertToLatLong');
    const convertToXYButton = document.getElementById('convertToXY');
    const resetXYButton = document.getElementById('resetXY');
    const resetLatLongButton = document.getElementById('resetLatLong');
    const resetHistoryButton = document.getElementById('resetHistory');

    // J'ajoute des écouteurs d'événements pour mes boutons de conversion.
    convertToLatLongButton.addEventListener('click', () => convertCoordinates('EPSG:20350', 'EPSG:4326', 'x-input', 'y-input', 'lat-result', 'long-result'));
    convertToXYButton.addEventListener('click', () => convertCoordinates('EPSG:4326', 'EPSG:20350', 'lat-input', 'long-input', 'x-result', 'y-result'));

    // J'ajoute des écouteurs d'événements pour mes boutons de réinitialisation.
    resetXYButton.addEventListener('click', () => resetFields('x-input', 'y-input', 'lat-result', 'long-result'));
    resetLatLongButton.addEventListener('click', () => resetFields('lat-input', 'long-input', 'x-result', 'y-result'));

    // J'ajoute un écouteur d'événements pour le bouton de réinitialisation de l'historique.
    resetHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('conversionHistory');
        updateHistoryTable();
    });

    // Je charge l'historique des conversions au démarrage de la page.
    loadConversionHistory();

    // Je charge et affiche les données converties au démarrage de la page.
    loadConvertedData();
});

// Ma nouvelle fonction pour charger et afficher les données converties.
function loadConvertedData() {
    fetch('/converted-data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const table = document.getElementById('convertedDataTable');
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');

            thead.innerHTML = ''; 
            tbody.innerHTML = '';

            // Créer les en-têtes du tableau
            const headerRow = thead.insertRow();
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });

            // Remplir le tableau avec toutes les données converties
            data.forEach(row => {
                const tr = tbody.insertRow();
                Object.values(row).forEach(value => {
                    const td = tr.insertCell();
                    td.textContent = value;
                });
            });
        })
        .catch(error => {
            console.error('Oh non ! Je n\'ai pas réussi à charger les données converties:', error);
            alert('Désolé, je n\'ai pas pu charger les données converties');
        });
}

// Ma fonction pour convertir les coordonnées entre différents systèmes de référence spatiale.
function convertCoordinates(fromCRS, toCRS, inputId1, inputId2, resultId1, resultId2) {
    const value1 = document.getElementById(inputId1).value;
    const value2 = document.getElementById(inputId2).value;

    if (!value1 || !value2) {
        alert("Veuillez entrer des valeurs pour les deux champs.");
        return;
    }

    // Déterminer le type d'entrée et sortie en fonction du système CRS utilisé :
    const inputType1 = fromCRS === 'EPSG:20350' ? 'X' : 'Longitude';
    const inputType2 = fromCRS === 'EPSG:20350' ? 'Y' : 'Latitude';
    const outputType1 = toCRS === 'EPSG:20350' ? 'X' : 'Longitude';
    const outputType2 = toCRS === 'EPSG:20350' ? 'Y' : 'Latitude';

    fetch('/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x: parseFloat(value1),
            y: parseFloat(value2),
            fromCRS,
            toCRS
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);

            document.getElementById(resultId1).value = data.x.toFixed(6);
            document.getElementById(resultId2).value = data.y.toFixed(6);

            addToHistory(fromCRS, toCRS, { type: inputType1, value: value1 }, { type: inputType2, value: value2 }, { type: outputType1, value: data.x.toFixed(6) }, { type: outputType2, value: data.y.toFixed(6) });
        })
        .catch((error) => {
            console.error('Erreur:', error);
            alert('Erreur lors de la conversion : ' + error.message);
        });
}

// Ma fonction pour ajouter une conversion à l'historique stocké dans localStorage   
function addToHistory(from, to, input1, input2, output1, output2) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    history.push({ from, to, input1, input2, output1, output2, date: new Date().toISOString() });
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistoryTable();
}

// Ma fonction pour charger et afficher l'historique des conversions depuis localStorage   
function loadConversionHistory() {
    updateHistoryTable();
}

// Ma fonction pour mettre à jour le tableau d'historique affiché sur la page    
function updateHistoryTable() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    const tableBody = document.querySelector('#conversionHistory tbody');
    tableBody.innerHTML = '';

    history.forEach(entry => {
        const row = tableBody.insertRow();
        row.innerHTML = `<td>${entry.from}</td><td>${entry.to}</td><td>${entry.input1.type}:${entry.input1.value}</td><td>${entry.input2.type}:${entry.input2.value}</td><td>${entry.output1.type}:${entry.output1.value}</td><td>${entry.output2.type}:${entry.output2.value}</td>`;
    });
}

// Ma fonction pour réinitialiser les champs d'entrée et de résultat sur demande    
function resetFields(...fieldIds) {
    fieldIds.forEach(id => {
        document.getElementById(id).value = '';
    });
}
