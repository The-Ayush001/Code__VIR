const courses = [];
    const scores = {};
    const studyHours = [];

    const coursesDiv = document.getElementById("courses");
    const scoresUl = document.getElementById("scores");

    // Chart.js instance
    const ctx = document.getElementById("studyChart");
    const studyChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "Study Hours",
          data: [],
          backgroundColor: "#4f46e5"
        }]
      }
    });

    // Form handler
    document.getElementById("studentForm").addEventListener("submit", e => {
      e.preventDefault();

      const name = document.getElementById("courseName").value;
      const completion = parseInt(document.getElementById("courseCompletion").value);
      const hours = parseInt(document.getElementById("studyHours").value);
      const quiz = parseInt(document.getElementById("quizScore").value);

      // Update courses
      courses.push({ name, completion });
      renderCourses();

      // Update scores
      scores[name] = quiz;
      renderScores();

      // Update study chart
      studyChart.data.labels.push(name);
      studyChart.data.datasets[0].data.push(hours);
      studyChart.update();

      // Reset form
      e.target.reset();
    });

    // Render functions
    function renderCourses() {
      coursesDiv.innerHTML = "";
      courses.forEach(c => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
          <div class="course-title">${c.name}</div>
          <div class="progress-bar">
            <div class="progress" style="width:${c.completion}%"></div>
          </div>
          <div class="percent">${c.completion}%</div>
        `;
        coursesDiv.appendChild(card);
      });
    }

    function renderScores() {
      scoresUl.innerHTML = "";
      for (let subj in scores) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${subj}:</strong> ${scores[subj]}%`;
        scoresUl.appendChild(li);
      }
    }