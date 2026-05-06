const track = document.querySelector(".cards");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let projects = [];
let index = 0;
let isAnimating = false;
const step = 1;
let cloneCount = step;

// =======================
// LOAD PROJECTS
// =======================
async function loadProjects() {
  const res = await fetch("data/projects.json");
  projects = await res.json();

  renderProjects();
  initCarousel(); // IMPORTANT: run AFTER render
}

// =======================
// RENDER INTO CAROUSEL
// =======================
function renderProjects() {
  track.innerHTML = "";

  projects.forEach(project => {
    track.appendChild(createProjectCard(project));
  });
}

// =======================
// CREATE CARD (li.card)
// =======================
function createProjectCard(project) {
  const li = document.createElement("li");
  li.className = "card";

  const skills = project.skills
    .map(skill => `<span class="skillBadge">${skill}</span>`)
    .join("");

  let actionButton = "";

  if (project.type === "link") {
    actionButton = `
      <a class="redBubble" href="${project.url}" target="_blank">
        <i class="fa-solid fa-arrow-right"></i>
      </a>`;
  } 
  else if (project.type === "download") {
    actionButton = `
      <a class="redBubble" href="${project.url}" download>
        <i class="fa-solid fa-download"></i>
      </a>`;
  } 
  else {
    actionButton = `
      <span class="redBubble disabled">
        <i class="fa-solid fa-lock"></i>
      </span>`;
  }

  li.innerHTML = `
    <img class="project-img cover" src="${project.image}" />
    <div class="project-info">
    <div class="skillBadgeContainer">${skills}</div>
    <div class="projectDescriptionContainer">
      <p class="projectDescription">${project.title}</p>
      ${actionButton}
    </div>
    </div>
  `;

  return li;
}

// =======================
// CAROUSEL LOGIC
// =======================
function initCarousel() {
  let cards = Array.from(track.children);

  // clone edges
  for (let i = 0; i < cloneCount; i++) {
    const firstClone = cards[i].cloneNode(true);
    const lastClone = cards[cards.length - 1 - i].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);
  }

  let allCards = Array.from(track.children);

  index = cloneCount;

  function getCardWidth() {
    return allCards[0].getBoundingClientRect().width + 16; // include gap
  }

  function updatePosition(animate = true) {
    const offset = -(index * getCardWidth());

    track.style.transition = animate ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${offset}px)`;
  }

  function fixLoop() {
    const realCount = cards.length;

    if (index >= realCount + cloneCount) {
      index = cloneCount;
      updatePosition(false);
    }

    if (index < cloneCount) {
      index = realCount + cloneCount - 1;
      updatePosition(false);
    }
  }

  nextBtn.onclick = () => {
    if (isAnimating) return;
    isAnimating = true;

    index += step;
    updatePosition();

    setTimeout(() => {
      fixLoop();
      isAnimating = false;
    }, 500);
  };

  prevBtn.onclick = () => {
    if (isAnimating) return;
    isAnimating = true;

    index -= step;
    updatePosition();

    setTimeout(() => {
      fixLoop();
      isAnimating = false;
    }, 500);
  };

  updatePosition(false);
}

// =======================
// INIT
// =======================
loadProjects();