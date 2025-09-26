const quizData = [
  { question: "Normal human body temperature in Celsius?", options: ["37", "35", "36", "38"], answer: "37", category: "neet", level: "Easy" },
  { question: "Chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O", category: "neet", level: "Easy" },
  { question: "Formula for force?", options: ["F=ma", "E=mc²", "P=mv", "V=IR"], answer: "F=ma", category: "jee", level: "Medium" },
  { question: "Solve integral ∫x dx", options: ["x²/2 + C", "x² + C", "1/x + C", "ln(x) + C"], answer: "x²/2 + C", category: "jee", level: "Hard" }
];

let filteredQuiz = [...quizData];
let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const questionNumberEl = document.getElementById("question-number");
const questionLevelEl = document.getElementById("question-level");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const categorySelect = document.getElementById("categorySelect");

function loadQuestion() {
  const currentQuiz = filteredQuiz[currentQuestion];
  questionNumberEl.innerText = `Question ${currentQuestion + 1} of ${filteredQuiz.length}`;
  questionLevelEl.innerText = `Level: ${currentQuiz.level}`;
  questionEl.innerText = currentQuiz.question;
  optionsEl.innerHTML = "";
  nextBtn.disabled = true;

  currentQuiz.options.forEach(option => {
    const li = document.createElement("li");
    li.innerText = option;
    li.addEventListener("click", () => selectOption(li, currentQuiz.answer));
    optionsEl.appendChild(li);
  });

  prevBtn.disabled = currentQuestion === 0;
}

function selectOption(selectedLi, correctAnswer) {
  if (selectedLi.innerText === correctAnswer) {
    score++;
    selectedLi.style.backgroundColor = "#10b981"; // green
  } else {
    selectedLi.style.backgroundColor = "#ef4444"; // red
    Array.from(optionsEl.children).forEach(li => {
      if (li.innerText === correctAnswer) li.style.backgroundColor = "#10b981";
    });
  }
  Array.from(optionsEl.children).forEach(li => li.style.pointerEvents = 'none');
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < filteredQuiz.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

prevBtn.addEventListener("click", () => {
  currentQuestion--;
  if (currentQuestion >= 0) {
    loadQuestion();
  }
});

function showResult() {
  document.getElementById("quiz").classList.add("hide");
  resultEl.classList.remove("hide");
  scoreEl.innerText = score;
  totalEl.innerText = filteredQuiz.length;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  document.getElementById("quiz").classList.remove("hide");
  resultEl.classList.add("hide");
  loadQuestion();
}

// Filter by category
categorySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;
  if (selectedCategory === "all") {
    filteredQuiz = [...quizData];
  } else {
    filteredQuiz = quizData.filter(q => q.category === selectedCategory);
  }
  currentQuestion = 0;
  score = 0;
  document.getElementById("quiz").classList.remove("hide");
  resultEl.classList.add("hide");
  loadQuestion();
});

loadQuestion();