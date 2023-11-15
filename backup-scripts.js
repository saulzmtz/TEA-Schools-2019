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
    const limitedSchools = filteredSchools.slice(0, 3);

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
