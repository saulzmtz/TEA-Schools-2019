let schoolsData = [];

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
        schoolsData = data.SCHOOLS; // Assuming the JSON structure has a top-level key "SCHOOLS"
        console.log(schoolsData); // Check if data is loaded
    });
});


document.getElementById('school1-search').addEventListener('input', function() {
    updateSuggestions(this.value, 'school1-suggestions');
});

document.getElementById('school2-search').addEventListener('input', function() {
    updateSuggestions(this.value, 'school2-suggestions');
});

function updateSuggestions(inputValue, suggestionsElementId) {
    if (!schoolsData || schoolsData.length === 0) {
        console.error('Schools data is not loaded');
        return;
    }

    const inputLower = inputValue.toLowerCase();
    const filteredSchools = schoolsData.filter(school => 
        school.Campus.toLowerCase().includes(inputLower)
    );

    // Limiting the number of suggestions to 3
    const limitedSchools = filteredSchools.slice(0, 5);

    const suggestionsElement = document.getElementById(suggestionsElementId);
    suggestionsElement.innerHTML = ''; // Clear previous suggestions

    limitedSchools.forEach(school => {
        const div = document.createElement('div');
        div.textContent = school.Campus;
        div.onclick = function() {
            document.getElementById(suggestionsElementId.replace('suggestions', 'search')).value = school.Campus;
            suggestionsElement.innerHTML = ''; // Clear suggestions after selection
        };
        suggestionsElement.appendChild(div);
    });
}
