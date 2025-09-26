var menu = document.querySelector("#nav i")
var cross = document.querySelector("#full i")


var tl = gsap.timeline()

tl.to("#full", {
  right: 0,
  duration: 0.5,
})

tl.from("#full li", {
  x: 150,
  duration: 0.6,
  stagger: 0.28,
  opacity: 0
})

tl.from("#full i", {
  opacity: 0,
})

tl.pause()

menu.addEventListener("click", function () {
  tl.play()
})

cross.addEventListener("click", function () {
  tl.reverse()
})



//Animation for analyzer page
// Fade in animation for cards
window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
      card.style.transition = "all 0.6s ease-out";
    }, index * 200);
  });
});

// Populate years dynamically
const pyqGrid = document.querySelector(".pyq-grid");
for (let year = 2000; year <= 2024; year++) {
  // JEE and NEET cards
  const jeeCard = document.createElement("div");
  jeeCard.className = "pyq-card";
  jeeCard.innerHTML = `<div class="pyq-year">${year}</div><div class="pyq-type">JEE PYQ</div>`;
  pyqGrid.appendChild(jeeCard);

  const neetCard = document.createElement("div");
  neetCard.className = "pyq-card";
  neetCard.innerHTML = `<div class="pyq-year">${year}</div><div class="pyq-type">NEET PYQ</div>`;
  pyqGrid.appendChild(neetCard);

}