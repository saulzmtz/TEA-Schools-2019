let schoolsData = [];
let chartInstances = {}; // Object to hold chart instances


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


function createPieChart(chartId, data, label) {

      // If a chart instance already exists for this ID, destroy it
      if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
    }

     const ctx = document.getElementById(chartId).getContext('2d');
    chartInstances[chartId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [label, 'Other'],
            datasets: [{
                label: label,
                data: [data, 100 - data],
                backgroundColor: ['#36a2eb', '#ddd'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false, // This can help control the aspect ratio
            //added tooltips below
            
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        let label = data.labels[tooltipItem.index];
                        let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return label + ': ' + value + '%';
                    }
                }
            },

            //end of tooltips
            layout: {
                padding: {
                    top: 5,   // Adjust top padding
                    bottom: 5 // Adjust bottom padding
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        boxWidth: 20,
                        padding: 10 // Adjust label padding if needed
                    }
                }
            }
        }
    });
}


// Function to create a bar chart
function createBarChart(chartId, scores) {
    // Debugging: Print chartId and scores
    console.log("Creating chart:", chartId, scores);

    // Check if a chart instance already exists and destroy it
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
    }

    // Get the canvas element, clear it, and get its context
    const canvas = document.getElementById(chartId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Create a new chart on the cleared canvas
    chartInstances[chartId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(scores),
            datasets: [{
                label: 'scores',
                data: Object.values(scores),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100 // Assuming score is out of 100
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


function displayDistinctionsTable(containerId, schoolData) {
    const container = document.getElementById(containerId);
    let tableHTML = '<table><tr><th>Distinction</th><th>Status</th></tr>';

    const distinctions = [
        "Distinction\nELA/Reading",
        "Distinction\nMathematics",
        "Distinction\nScience",
        "Distinction\nSoc Studies",
        "Distinction\nProgress",
        "Distinction\nClosing the Gaps",
        "Distinction\nPostsecondary\nReadiness"
    ];

    distinctions.forEach(distinction => {
        const displayName = distinction.replace(/Distinction\n/, '').replace(/\n/g, ' ');
        const status = schoolData[distinction];
        const statusClass = status === "Earned" ? 'earned' : 'not-earned';

        tableHTML += `
            <tr>
                <td>${displayName}</td>
                <td class="${statusClass}">${status}</td>
            </tr>
        `;
    });

    tableHTML += '</table>';
    container.innerHTML = tableHTML;
}






function displaySchoolData(school1Data, school2Data) {
    // Check if both school data are available
    if (!school1Data || !school2Data) {
        console.error('Missing data for one or both schools');
        return;
    }


      // Remove 'hidden' class from elements to make them visible
      document.querySelectorAll('.hidden').forEach(element => {
        element.classList.remove('hidden');
    });

   





    // Display basic information for School 1
    const school1Demo = document.getElementById('school1-demographics');
    school1Demo.innerHTML = `
        <h3>${school1Data.Campus}</h3>
        <p>District: ${school1Data.District}</p>
        <p>County: ${school1Data.County}</p>
        <p>${school1Data.Region}</p>
        <p>${school1Data["School\nType"]}</p>
        <p>${school1Data["Grades\nServed"]}</p>
        <p>Charter: ${school1Data.Charter}</p>
    `;

    // Display basic information for School 2
    const school2Demo = document.getElementById('school2-demographics');
    school2Demo.innerHTML = `
        <h3>${school2Data.Campus}</h3>
        <p>District: ${school2Data.District}</p>
        <p>County: ${school2Data.County}</p>
        <p>${school2Data.Region}</p>
        <p>${school2Data["School\nType"]}</p>
        <p>${school2Data["Grades\nServed"]}</p>
        <p>Charter: ${school2Data.Charter}</p>
    `;

    // Create pie charts for School 1
    const school1EconomicPercentage = parseFloat(school1Data["%\nEconomically\nDisadvantaged"].replace('%', ''));
    const school1EbelPercentage = parseFloat(school1Data["% EB/EL\nStudents"].replace('%', ''));

    createPieChart('school1-economic-chart', school1EconomicPercentage, 'Economically Disadvantaged');
    createPieChart('school1-ebel-chart', school1EbelPercentage, 'EB/EL Students');

    // Create pie charts for School 2
    const school2EconomicPercentage = parseFloat(school2Data["%\nEconomically\nDisadvantaged"].replace('%', ''));
    const school2EbelPercentage = parseFloat(school2Data["% EB/EL\nStudents"].replace('%', ''));

    createPieChart('school2-economic-chart', school2EconomicPercentage, 'Economically Disadvantaged');
    createPieChart('school2-ebel-chart', school2EbelPercentage, 'EB/EL Students');

     // Display demographics for School 1
     displayDemographics('school1-demographics', school1Data);

     // Display demographics for School 2
     displayDemographics('school2-demographics', school2Data);

      // Extract scores for School 1 and School 2
    const school1Scores = {
        'Overall Score': parseFloat(school1Data["Overall\nScore"]),
        'Student Achievement Score': parseFloat(school1Data["Student\nAchievement\nScore"]),
        'School Progress Score': parseFloat(school1Data["School\nProgress\nScore"]),
        'Academic Growth Score': parseFloat(school1Data["Academic\nGrowth\nScore"]),

        // ... other scores, ensure to use the exact key as in JSON ...
    };

    const school2Scores = {
        'Overall Score': parseFloat(school2Data["Overall\nScore"]),
        'Student Achievement Score': parseFloat(school2Data["Student\nAchievement\nScore"]),
        'School Progress Score': parseFloat(school2Data["School\nProgress\nScore"]),
        'Academic Growth Score': parseFloat(school2Data["Academic\nGrowth\nScore"]),
        // ... other scores ...
    };

    
    // Create bar charts for School 1 and School 2
    createBarChart('school1-bar-chart', school1Scores);
    createBarChart('school2-bar-chart', school2Scores);

    // Display distinctions table for School 1 and School 2
    displayDistinctionsTable('school1-distinctions-table', school1Data);
    displayDistinctionsTable('school2-distinctions-table', school2Data);


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


function displayNumberOfStudents(containerId, schoolData) {
    const container = document.getElementById(containerId);
    // Ensure the key matches the format in your JSON file
    const numberOfStudents = schoolData["Number of\nStudents"];

    // Update the innerHTML of the container
    container.innerHTML = `
        <h3>Number of Students</h3>
        <p class="student-count">${numberOfStudents}</p>
    `;
}

function displayDemographics(containerId, schoolData) {
    const container = document.getElementById(containerId);
    const numberOfStudents = schoolData["Number of\nStudents"];
    const overallGrade = schoolData["Overall\nRating"]; // Ensure this key matches your JSON data

    container.innerHTML = `
    <h3 class="school-name">${schoolData.Campus}</h3>
    <p>District: ${schoolData.District}</p>
    <p>County: ${schoolData.County}</p>
    <p>${schoolData.Region}</p>
    <p>${schoolData["School\nType"]}</p>
    <p>${schoolData["Grades\nServed"]}</p>
    <p>Charter: ${schoolData.Charter}</p>
    <h3>Number of Students</h3>
    <p class="student-count">${numberOfStudents}</p>
`;
    // Append the number of students beneath the demographic data
    // container.innerHTML += `
    //     <h3>Number of Students</h3>
    //     <p class="student-count">${numberOfStudents}</p>
    // `;
    // Append the overall grade beneath the number of students
    container.innerHTML += `
        <h3>Overall Grade</h3>
        <p class="overall-grade">${overallGrade}</p>
    `;
}