function loadJSONData(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadJSONData('schools_data.json').then(data => {
        console.log(data); // This is just for testing to see if data loads
    });
});
