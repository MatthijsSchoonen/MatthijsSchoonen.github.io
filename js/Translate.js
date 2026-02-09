let translations = {};


async function loadTranslations() {
  const response = await fetch('translations/translations.json');
  translations = await response.json();
}

function changeLanguage(language) {
  document.querySelectorAll("[data-translate]").forEach(element => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.style.display = btn.getAttribute('data-lang') === language ? 'none' : 'inline-block';
  });
}

window.onload = async () => {
  await loadTranslations();


  changeLanguage(currentLanguage);

  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedLanguage = btn.getAttribute('data-lang');
      if (selectedLanguage !== currentLanguage) {
        currentLanguage = selectedLanguage;
        changeLanguage(currentLanguage);
      }
    });
  });
}