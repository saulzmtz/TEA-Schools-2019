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




  // Display the bar chart for School 1
  const school1StudentsChart = document.getElementById('school1-students-chart');
  const school1StudentsCount = parseInt(school1Data["Number of\nStudents"], 10);
  school1StudentsChart.innerHTML = `
      <p>Number of Students: ${school1StudentsCount}</p>
      <div class="bar-chart">
          <div class="bar" style="width: ${school1StudentsCount / 10}%; background-color: #007bff;"></div>
      </div>
  `;

  // Display the bar chart for School 2
  const school2StudentsChart = document.getElementById('school2-students-chart');
  const school2StudentsCount = parseInt(school2Data["Number of\nStudents"], 10);
  school2StudentsChart.innerHTML = `
      <p>Number of Students: ${school2StudentsCount}</p>
      <div class="bar-chart">
          <div class="bar" style="width: ${school2StudentsCount / 10}%; background-color: #28a745;"></div>
      </div>
  `;




  