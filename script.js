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


function displaySchoolData(school1Data, school2Data) {
    // Check if both school data are available
    if (!school1Data || !school2Data) {
        console.error('Missing data for one or both schools');
        return;
    }

    // Display basic information for School 1
    const school1Demo = document.getElementById('school1-demographics');
    school1Demo.innerHTML = `
        <h3>${school1Data.Campus}</h3>
        <p>District: ${school1Data.District}</p>
        <p>County: ${school1Data.County}</p>
        <p>${school1Data.Region}</p>
    `;

    // Display basic information for School 2
    const school2Demo = document.getElementById('school2-demographics');
    school2Demo.innerHTML = `
        <h3>${school2Data.Campus}</h3>
        <p>District: ${school2Data.District}</p>
        <p>County: ${school2Data.County}</p>
        <p>${school2Data.Region}</p>
    `;
}

document.getElementById('compare-button').addEventListener('click', () => {
    const school1Name = document.getElementById('school1-search').value.trim();
    const school2Name = document.getElementById('school2-search').value.trim();

    const school1Data = schoolsData.find(school => school.Campus.toLowerCase() === school1Name.toLowerCase());
    const school2Data = schoolsData.find(school => school.Campus.toLowerCase() === school2Name.toLowerCase());

    if (school1Data && school2Data) {
        displaySchoolData(school1Data, school2Data);
    } else {
        console.error('One or both schools not found');
    }
});
