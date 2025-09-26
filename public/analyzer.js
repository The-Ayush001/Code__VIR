// Global variables
let topicCount = 1;

// DOM elements
const topicsContainer = document.getElementById('topics-container');
const addTopicBtn = document.getElementById('add-topic-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const resultsSection = document.getElementById('results-section');
const resultsSubject = document.getElementById('results-subject');
const weaknessList = document.getElementById('weakness-list');
const weakTopicsCount = document.getElementById('weak-topics-count');
const recommendationsList = document.getElementById('recommendations-list');
const resetBtn = document.getElementById('reset-btn');

// Add event listeners
addTopicBtn.addEventListener('click', addTopic);
analyzeBtn.addEventListener('click', analyzeSyllabus);
resetBtn.addEventListener('click', resetApp);

// Function to add a new topic row
function addTopic() {
  topicCount++;

  const topicRow = document.createElement('div');
  topicRow.className = 'topic-row';
  topicRow.innerHTML = `
                <div class="topic-name">
                    <label for="topic-${topicCount}">Topic Name</label>
                    <input type="text" id="topic-${topicCount}" placeholder="e.g., Quadratic Equations">
                </div>
                <div class="topic-difficulty">
                    <label for="difficulty-${topicCount}">Understanding Level</label>
                    <select id="difficulty-${topicCount}" class="difficulty-select">
                        <option value="5">Excellent</option>
                        <option value="4">Good</option>
                        <option value="3">Average</option>
                        <option value="2">Weak</option>
                        <option value="1">Very Weak</option>
                    </select>
                </div>
                <div class="topic-actions">
                    <label>&nbsp;</label>
                    <button class="remove-btn" onclick="removeTopic(${topicCount})"></button>
                </div>
            `;

  topicsContainer.appendChild(topicRow);
}

// Function to remove a topic row
function removeTopic(id) {
  const topicElement = document.getElementById(`topic-${id}`).parentElement.parentElement;
  topicsContainer.removeChild(topicElement);
}

// Function to analyze the syllabus
function analyzeSyllabus() {
  const subjectName = document.getElementById('subject-name').value;
  if (!subjectName) {
    alert('Please enter a subject name');
    return;
  }

  // Collect all topics and their difficulty levels
  const topics = [];
  for (let i = 1; i <= topicCount; i++) {
    const topicInput = document.getElementById(`topic-${i}`);
    const difficultySelect = document.getElementById(`difficulty-${i}`);

    // Skip if the topic row was removed
    if (!topicInput || !topicInput.parentElement.parentElement.parentElement) continue;

    const topicName = topicInput.value;
    if (!topicName) continue; // Skip empty topics

    const difficulty = parseInt(difficultySelect.value);
    topics.push({ name: topicName, difficulty });
  }

  if (topics.length === 0) {
    alert('Please add at least one topic');
    return;
  }

  // Update results subject name
  resultsSubject.textContent = subjectName;

  // Calculate weak topics (difficulty <= 2)
  const weakTopics = topics.filter(topic => topic.difficulty <= 2);
  weakTopicsCount.textContent = weakTopics.length;

  // Generate weakness list
  weaknessList.innerHTML = '';
  topics.forEach(topic => {
    const weaknessItem = document.createElement('div');
    weaknessItem.className = 'weakness-item';

    let priorityClass = '';
    if (topic.difficulty <= 2) priorityClass = 'priority-high';
    else if (topic.difficulty === 3) priorityClass = 'priority-medium';
    else priorityClass = 'priority-low';

    const difficultyLabels = ['Very Weak', 'Weak', 'Average', 'Good', 'Excellent'];

    weaknessItem.innerHTML = `
                    <div class="weakness-info">
                        <span class="weakness-name">${topic.name}</span>
                        <span class="weakness-value ${priorityClass}">${difficultyLabels[topic.difficulty - 1]}</span>
                    </div>
                    <div class="weakness-meter">
                        <div class="meter-fill" style="width: ${topic.difficulty * 20}%; background-color: ${getDifficultyColor(topic.difficulty)};"></div>
                    </div>
                `;

    weaknessList.appendChild(weaknessItem);
  });

  // Generate recommendations
  generateRecommendations(weakTopics);

  // Draw chart
  drawChart(topics);

  // Show results section
  resultsSection.style.display = 'block';

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to get color based on difficulty
function getDifficultyColor(difficulty) {
  const colors = [
    '#ef476f', // Very Weak - red
    '#ffd166', // Weak - yellow
    '#06d6a0', // Average - green
    '#118ab2', // Good - blue
    '#073b4c'  // Excellent - dark blue
  ];
  return colors[difficulty - 1];
}

// Function to generate study recommendations
function generateRecommendations(weakTopics) {
  recommendationsList.innerHTML = '';

  if (weakTopics.length === 0) {
    const recommendationItem = document.createElement('div');
    recommendationItem.className = 'recommendation-item';
    recommendationItem.innerHTML = `
                    <h4>Great job!</h4>
                    <p>You don't have any weak topics identified. Keep up the good work and consider reviewing topics you rated as "Average" to strengthen your understanding further.</p>
                `;
    recommendationsList.appendChild(recommendationItem);
    return;
  }

  // Recommendation for weak topics
  const recommendationItem = document.createElement('div');
  recommendationItem.className = 'recommendation-item';

  let topicsHTML = '';
  weakTopics.forEach(topic => {
    topicsHTML += `<li>${topic.name}</li>`;

  });

  recommendationItem.innerHTML = `
                <h4>Focus on These Topics First</h4>
                <p>Based on your self-assessment, these topics need the most attention:</p>
                <ul class="topic-list">
                    ${topicsHTML}
                </ul>
                <p>Allocate more study time to these areas and consider seeking additional resources or help.</p>
            `;

  recommendationsList.appendChild(recommendationItem);

  // Additional general recommendations
  const generalRecommendation = document.createElement('div');
  generalRecommendation.className = 'recommendation-item';
  generalRecommendation.innerHTML = `
                <h4>Study Strategy Tips</h4>
                <ul class="topic-list">
                    <li>Focus on understanding core concepts before memorizing details</li>
                    <li>Use active recall techniques rather than passive reading</li>
                    <li>Practice with past exam questions related to weak topics</li>
                    <li>Form or join a study group to discuss difficult concepts</li>
                    <li>Schedule regular review sessions to reinforce learning</li>
                </ul>
            `;

  recommendationsList.appendChild(generalRecommendation);
}

// Function to draw chart
function drawChart(topics) {
  const canvas = document.getElementById('understanding-chart');
  const ctx = canvas.getContext('2d');

  // Clear previous chart
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set canvas dimensions
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 300;

  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const barWidth = (width - padding * 2) / topics.length;

  // Draw bars
  topics.forEach((topic, index) => {
    const x = padding + index * barWidth;
    const barHeight = (topic.difficulty / 5) * (height - padding * 2);
    const y = height - padding - barHeight;

    ctx.fillStyle = getDifficultyColor(topic.difficulty);
    ctx.fillRect(x, y, barWidth - 10, barHeight);

    // Draw topic name
    ctx.fillStyle = '#212529';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Rotate text if too many topics
    if (topics.length > 8) {
      ctx.save();
      ctx.translate(x + (barWidth - 10) / 2, height - 5);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(topic.name, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(topic.name, x + (barWidth - 10) / 2, height - 10);
    }
  });

  // Draw Y-axis labels
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (i / 5) * (height - padding * 2);
    ctx.fillText(i, padding - 5, y);
  }

  // Draw axis lines
  ctx.strokeStyle = '#dee2e6';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw chart title
  ctx.textAlign = 'center';
  ctx.font = '16px Arial';
  ctx.fillText('Understanding Level by Topic', width / 2, 20);
}

// Function to reset the app
function resetApp() {
  // Reset form
  document.getElementById('subject-name').value = '';

  // Remove all but the first topic row
  while (topicsContainer.children.length > 1) {
    topicsContainer.removeChild(topicsContainer.lastChild);
  }

  // Reset first topic row
  document.getElementById('topic-1').value = '';
  document.getElementById('difficulty-1').value = '5';

  // Hide results section
  resultsSection.style.display = 'none';

  // Reset topic count
  topicCount = 1;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}