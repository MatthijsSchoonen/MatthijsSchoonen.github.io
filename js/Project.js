const createElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([name, value]) => {
    if (name === 'class') {
      element.className = value;
      return;
    }
    if (name === 'text') {
      element.textContent = value;
      return;
    }
    if (name === 'html') {
      element.innerHTML = value;
      return;
    }
    element.setAttribute(name, value);
  });

  if (typeof children === 'string') {
    element.innerHTML = children;
  } else if (children instanceof Node) {
    element.appendChild(children);
  } else if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.insertAdjacentHTML('beforeend', child);
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  }

  return element;
};

const JSCarousel = ({
  carouselSelector,
  slideSelector,
  enablePagination = true,
  enableAutoplay = true,
  autoplayInterval = 6000,
}) => {
  const carousel = document.querySelector(carouselSelector);
  if (!carousel) {
    console.error('Specify a valid selector for the carousel.');
    return null;
  }

  const slides = Array.from(carousel.querySelectorAll(slideSelector));
  if (!slides.length) {
    console.error('Specify a valid selector for slides.');
    return null;
  }

  let currentSlideIndex = 0;
  let prevButton = null;
  let nextButton = null;
  let paginationContainer = null;
  let paginationButtons = [];
  let autoplayTimer = null;

  const handlePrevButtonClick = () => moveSlide('prev');
  const handleNextButtonClick = () => moveSlide('next');
  const handleMouseEnter = () => stopAutoplay();
  const handleMouseLeave = () => startAutoplay();
  const handleKeyboardNav = (event) => {
    if (!carousel.contains(event.target)) return;
    if (event.defaultPrevented) return;

    switch (event.key) {
      case 'ArrowLeft':
        moveSlide('prev');
        break;
      case 'ArrowRight':
        moveSlide('next');
        break;
      default:
        return;
    }

    event.preventDefault();
  };

  const addElement = (tag, attributes = {}, children = []) => {
    return createElement(tag, attributes, children);
  };

  const setInitialSlidePositions = () => {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
    });
  };

  const tweakStructure = () => {
    carousel.setAttribute('tabindex', '0');

    const carouselInner =
      carousel.querySelector('.carousel-inner') ||
      addElement('div', { class: 'carousel-inner' });

    if (!carousel.contains(carouselInner)) {
      carousel.insertBefore(carouselInner, carousel.firstChild);
    }

    slides.forEach((slide) => {
      carouselInner.appendChild(slide);
    });

    prevButton = addElement(
      'button',
      {
        type: 'button',
        class: 'carousel-btn carousel-btn--prev-next carousel-btn--prev',
        'aria-label': 'Previous Slide',
      },
      '&#x2039;'
    );

    nextButton = addElement(
      'button',
      {
        type: 'button',
        class: 'carousel-btn carousel-btn--prev-next carousel-btn--next',
        'aria-label': 'Next Slide',
      },
      '&#x203A;'
    );

    carouselInner.appendChild(prevButton);
    carouselInner.appendChild(nextButton);

    if (enablePagination) {
      paginationContainer = addElement('nav', {
        class: 'carousel-pagination',
        role: 'tablist',
        'aria-label': 'Project slide navigation',
      });

      slides.forEach((_, index) => {
        const paginationButton = addElement(
          'button',
          {
            type: 'button',
            class: 'carousel-btn carousel-pagination-btn',
            role: 'tab',
            'aria-label': `Go to slide ${index + 1}`,
            'aria-selected': index === 0 ? 'true' : 'false',
            'data-slide-index': index,
          },
          ''
        );

        if (index === 0) {
          paginationButton.classList.add('carousel-btn--active');
        }

        const handlePageClick = () => {
          handlePaginationBtnClick(index);
        };

        paginationButton.addEventListener('click', handlePageClick);
        paginationButtons.push({ button: paginationButton, listener: handlePageClick });
        paginationContainer.appendChild(paginationButton);
      });

      carousel.appendChild(paginationContainer);
    }
  };

  const adjustSlidePosition = () => {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - currentSlideIndex)}%)`;
    });
  };

  const updatePaginationBtns = () => {
    if (!paginationContainer) return;

    paginationButtons.forEach(({ button }, index) => {
      button.classList.toggle('carousel-btn--active', index === currentSlideIndex);
      button.setAttribute('aria-selected', index === currentSlideIndex ? 'true' : 'false');
    });
  };

  const updateCarouselState = () => {
    adjustSlidePosition();
    if (enablePagination) {
      updatePaginationBtns();
    }
  };

  const moveSlide = (direction) => {
    currentSlideIndex =
      direction === 'next'
        ? (currentSlideIndex + 1) % slides.length
        : (currentSlideIndex - 1 + slides.length) % slides.length;
    updateCarouselState();
  };

  const handlePaginationBtnClick = (index) => {
    currentSlideIndex = index;
    updateCarouselState();
  };

  const startAutoplay = () => {
    if (!enableAutoplay || autoplayInterval === null) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      moveSlide('next');
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const attachEventListeners = () => {
    prevButton.addEventListener('click', handlePrevButtonClick);
    nextButton.addEventListener('click', handleNextButtonClick);

    if (enableAutoplay && autoplayInterval !== null) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
    }

    carousel.addEventListener('keydown', handleKeyboardNav);
  };

  const detachEventListeners = () => {
    prevButton.removeEventListener('click', handlePrevButtonClick);
    nextButton.removeEventListener('click', handleNextButtonClick);

    if (enableAutoplay && autoplayInterval !== null) {
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    }

    carousel.removeEventListener('keydown', handleKeyboardNav);

    paginationButtons.forEach(({ button, listener }) => {
      button.removeEventListener('click', listener);
    });
  };

  const create = () => {
    tweakStructure();
    setInitialSlidePositions();
    attachEventListeners();
    updateCarouselState();
    if (enableAutoplay && autoplayInterval !== null) {
      startAutoplay();
    }
  };

  const destroy = () => {
    detachEventListeners();
    stopAutoplay();
  };

  return { create, destroy };
};

const buildSlideFromProject = (project, index) => {
  const slide = createElement('div', {
    class: 'slide',
    role: 'tabpanel',
    'aria-labelledby': `carousel-1-slide-${index + 1}-title`,
  });

  const slideContent = createElement('div', { class: 'slide-content' });
  const image = createElement('img', {
    src: project.image,
    alt: `${project.titleKey} project screenshot`,
  });
  const overlay = createElement('div', { class: 'slide-overlay' });

  const caption = createElement('div', { class: 'slide-caption' });
  const title = createElement(
    'h3',
    {
      id: `carousel-1-slide-${index + 1}-title`,
      class: 'slide-caption-title',
    },
    project.titleKey
  );

  const description = createElement('p', { class: 'slide-description', 'data-translate': project.titleKey });

  const meta = createElement('div', { class: 'slide-meta' }, []);
  const date = createElement('span', {}, `Released: ${project.date}`);
  meta.append(date);

  const actions = createElement('div', { class: 'slide-actions' });
  let actionElement;

  if (project.type === 'link') {
    actionElement = createElement(
      'a',
      {
        href: project.url,
        class: 'carousel-slide-link',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'View project'
    );
  } else if (project.type === 'download') {
    actionElement = createElement(
      'a',
      {
        href: project.url,
        class: 'carousel-slide-link',
        download: '',
      },
      'Download demo'
    );
  } else {
    actionElement = createElement(
      'button',
      {
        type: 'button',
        class: 'carousel-slide-link disabled',
        disabled: 'disabled',
        title: project.tooltip || 'Project unavailable',
      },
      'Unavailable'
    );
  }

  const tooltip = createElement('span', { class: 'slide-meta' }, project.tooltip || '');

  actions.append(actionElement);
  caption.append(title,description, meta, actions);
  slideContent.append(image, overlay, caption);
  slide.appendChild(slideContent);

  return slide;
};

const renderProjectCarousel = async () => {
  const target = document.querySelector('#carousel-1 .carousel-inner');
  if (!target) return;

  try {
    const response = await fetch('data/projects.json');
    const projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      target.textContent = 'No projects available at the moment.';
      return;
    }

    projects.forEach((project, index) => {
      const slide = buildSlideFromProject(project, index);
      target.appendChild(slide);
    });

    const carousel = JSCarousel({
      carouselSelector: '#carousel-1',
      slideSelector: '.slide',
      enablePagination: true,
      enableAutoplay: true,
      autoplayInterval: 7000,
    });

    carousel.create();
    window.addEventListener('unload', () => {
      carousel.destroy();
    });
  } catch (error) {
    target.textContent = 'Unable to load project carousel.';
    console.error('Failed to load projects.json', error);
  }
};

document.addEventListener('DOMContentLoaded', renderProjectCarousel);
