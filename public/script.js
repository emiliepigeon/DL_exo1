document.addEventListener('DOMContentLoaded', function() {
    const convertButton = document.getElementById('convertButton');
    convertButton.addEventListener('click', convertCoordinates);
});

function convertCoordinates() {
    const x = document.getElementById('x').value;
    const y = document.getElementById('y').value;

    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coordinates: [{ lon: parseFloat(x), lat: parseFloat(y) }],
            sourceCRS: "EPSG:20350",
            targetCRS: "EPSG:4326"
        }),
    })
    .then(response => response.json())
    .then(data => {
        const result = data.convertedCoordinates[0];
        document.getElementById('latitude').value = result.y.toFixed(6);
        document.getElementById('longitude').value = result.x.toFixed(6);
    })
    .catch((error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la conversion');
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    });
}
