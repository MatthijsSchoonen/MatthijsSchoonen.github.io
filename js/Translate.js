let translations = {};

function applyTranslation(element, translatedValue) {
  const withYear = translatedValue.replaceAll('{year}', String(new Date().getFullYear()));

  if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.hasAttribute('placeholder')) {
    element.placeholder = withYear;
    return;
  }

  element.textContent = withYear;
}


async function loadTranslations() {
  const response = await fetch('translations/translations.json');
  translations = await response.json();
}

function changeLanguage(language) {
  document.querySelectorAll("[data-translate]").forEach(element => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      applyTranslation(element, translations[language][key]);
    }
  });

  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.style.display = btn.getAttribute('data-lang') === language ? 'none' : 'inline-block';
  });
}

