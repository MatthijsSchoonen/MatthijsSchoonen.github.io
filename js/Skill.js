const SkillContainer = document.getElementById("FeaturedSkills");
let skills = [];

async function loadFeaturedSkills() {
  const res = await fetch("data/skills.json");
  skills = await res.json();
  renderFeaturedSkills();
}

function renderFeaturedSkills() {
  SkillContainer.innerHTML = "";

  const featured = skills.filter(skill => skill.featured === true);

  featured.forEach(skill => {
    SkillContainer.appendChild(createSkillCard(skill));
  });

  // re-run translations on dynamic content
  changeLanguage(currentLanguage);
}

function createSkillCard(skill) {
  const card = document.createElement("div");
  card.className = "skillCard hide";

  card.innerHTML = `
    <div class="cornerDecor top-right"></div>
    <div class="cornerDecor bottom-left"></div>

    <img class="redPlaceholder" src="${skill.image}" alt="${skill.title}" />

    <p class="skillTitle">${skill.title}</p>

    <p class="skillDescription" data-translate="${skill.descriptionKey}">
      ${skill.descriptionFallback || ""}
    </p>
  `;

  return card;
}
