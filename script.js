document.addEventListener('DOMContentLoaded', function () {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const slideItems = document.querySelectorAll('.slide-item');
  
  dropdownMenu.innerHTML = '';
  slideItems.forEach((slide, idx) => {
    let navLabel = slide.getAttribute('data-navigation') || slide.id || `Page ${idx + 1}`;
    let slideNum = idx + 1;
    let a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-slide', slideNum);
    a.textContent = navLabel;
    dropdownMenu.appendChild(a);
  });

  // Initial highlight
  highlightCurrentDropdownLink(1);



  // Utility to highlight active dropdown link
  function highlightCurrentDropdownLink(slideNumber) {
    const links = dropdownMenu.querySelectorAll('a');
    links.forEach(link => {
      if (parseInt(link.getAttribute('data-slide')) === slideNumber) {
        link.classList.add('current-page');
      } else {
        link.classList.remove('current-page');
      }
    });
  }

  function updateDropdownButtonLabel(slideNumber) {
  // Get label from the respective slide
  const slideItems = document.querySelectorAll('.slide-item');
  const slide = slideItems[slideNumber - 1];
  let navLabel = slide.getAttribute('data-navigation') || slide.id || `Page ${slideNumber}`;
  // Update the button text
  const dropdownBtn = document.getElementById('dropdownToggle');
  if (dropdownBtn) {
    dropdownBtn.querySelector('.dropdown-selected-title').textContent = navLabel;
  }
}

// Call this on initial script run and whenever the slide changes:
updateDropdownButtonLabel(1);

// In your dropdown click handler:
dropdownMenu.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    e.preventDefault();
    const targetSlide = parseInt(e.target.getAttribute('data-slide'));
    scrollToSlide(targetSlide);
    highlightCurrentDropdownLink(targetSlide);
    updateDropdownButtonLabel(targetSlide); // <-- update the button title!

    dropdownMenu.classList.remove('show');
    dropdownToggle.classList.remove('active');
  }
});

// Make sure to call `updateDropdownButtonLabel(currentSlide)` in any arrow or input navigation updates too.

  // Add public function so your scrollToSlide logic can trigger highlight (if slide changes via arrow/input)
  window.setDropdownHighlight = highlightCurrentDropdownLink;
});
