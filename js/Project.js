const featuredContainer = document.getElementById("featuredProjects");
let projects = [];

async function loadProjects() {
  const res = await fetch("data/projects.json");
  projects = await res.json();
  renderFeaturedProjects();
}

function renderFeaturedProjects() {
  featuredContainer.innerHTML = "";

  const featured = projects.filter(p => p.featured === true);

  featured.forEach(project => {
    featuredContainer.appendChild(createProjectCard(project));
  });

  // re-run translations on dynamic content
  changeLanguage(currentLanguage);
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "projectCard";

  const skills = project.skills
    .map(skill => `<p class="skillBadge">${skill}</p>`)
    .join("");

  let actionButton = "";

  if (project.type === "link") {
    actionButton = `
      <a class="redBubble" href="${project.url}" target="_blank" data-tooltip="${project.tooltip}">
        <i class="fa-solid fa-arrow-right"></i>
      </a>`;
  } 
  else if (project.type === "download") {
    actionButton = `
      <a class="redBubble" href="${project.url}" download data-tooltip="${project.tooltip}">
        <i class="fa-solid fa-download"></i>
      </a>`;
  } 
  else {
    actionButton = `
      <a class="redBubble disabled" data-tooltip="${project.tooltip}">
        <i class="fa-solid fa-lock"></i>
      </a>`;
  }

  card.innerHTML = `
    <img class="ProjectImg cover" src="${project.image}" />
    <div class="skillBadgeContainer">${skills}</div>
    <div class="projectDescriptionContainer">
      <p class="projectDescription" data-translate="${project.titleKey}"></p>
      ${actionButton}
    </div>
  `;

  return card;
}
