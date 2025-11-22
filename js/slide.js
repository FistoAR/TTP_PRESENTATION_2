// slide.js - full replacement
// console.clear();
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let mainScroller = document.querySelector('.viewport-container');
let allSlides = gsap.utils.toArray(".slide-item");
let currentPanelInput = document.querySelector('.current-panel-input');
let totalPanelCount = allSlides.length || 0;
let panelCount = document.querySelector('.panel-count');
if (panelCount) panelCount.innerHTML = totalPanelCount;

// Set max attribute dynamically
if (currentPanelInput) currentPanelInput.setAttribute('max', totalPanelCount);

let prevArrow = document.querySelector(".prev-arrow");
let nextArrow = document.querySelector(".next-arrow");

// Ensure slides are in normal flow (no fixed)
allSlides.forEach((slide, index) => {
  slide.style.position = 'relative';
  slide.style.zIndex = 100 - index;
});

// Create ScrollTriggers for each slide
allSlides.forEach((eachSlide, index) => {
  let realIndex = (index + 1);
  ScrollTrigger.create({
    trigger: eachSlide,
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => refreshSlideCounter(realIndex),
    onEnterBack: () => refreshSlideCounter(realIndex)
  });
});

// =========================================================================
// CORE NAVIGATION & DISPLAY FUNCTIONS
// =========================================================================
function refreshSlideCounter(currentNumber) {
  if (!currentPanelInput) return;
  currentPanelInput.value = currentNumber;
  
  let followingIndex = currentNumber + 1;
  let precedingIndex = currentNumber - 1;
  
  if (nextArrow) nextArrow.setAttribute('data-down', followingIndex);
  if (prevArrow) prevArrow.setAttribute('data-up', precedingIndex);
  
  refreshNavigationControls(precedingIndex, followingIndex);
  refreshDropdownActivePage(currentNumber);
  
  // Update dropdown button title (index.html exposes this)
  if (window.updateDropdownTitle) {
    window.updateDropdownTitle(currentNumber);
  }
}

function refreshNavigationControls(upIndex, downIndex) {
  if (prevArrow) {
    if (upIndex >= 1) prevArrow.classList.remove('disabled');
    else prevArrow.classList.add('disabled');
  }

  if (nextArrow) {
    if (downIndex <= totalPanelCount) nextArrow.classList.remove('disabled');
    else nextArrow.classList.add('disabled');
  }
}

/**
 * Smooth-scroll to a given slide (1-based).
 */
function navigateToSlide(destinationSlide) {
  let destinationElement = allSlides[destinationSlide - 1];
  
  if (destinationElement) {
    gsap.to(mainScroller, {
      ease: "power2.inOut",
      duration: 0.8,
      scrollTo: {
        y: destinationElement,
        autoKill: false
      },
      onComplete: () => {
        // Ensure dropdown highlight and title reflect final state
        refreshDropdownActivePage(destinationSlide);
        if (window.updateDropdownTitle) {
          window.updateDropdownTitle(destinationSlide);
        }
      }
    });
  }
}

// Expose navigation helper (index.html uses this)
window.navigateToSlide = navigateToSlide;
window.scrollToSlide = navigateToSlide; // alias

// =========================================================================
// ARROW & INPUT HANDLERS
// =========================================================================

if (nextArrow) {
  nextArrow.addEventListener("click", function(e) {
    e.preventDefault();
    let activeSlide = parseInt(currentPanelInput.value) || 1;
    let targetNext = activeSlide + 1;
    if (targetNext <= totalPanelCount) navigateToSlide(targetNext);
  });
}

if (prevArrow) {
  prevArrow.addEventListener("click", function(e) {
    e.preventDefault();
    let activeSlide = parseInt(currentPanelInput.value) || 1;
    let targetPrev = activeSlide - 1;
    if (targetPrev >= 1) navigateToSlide(targetPrev);
  });
}

if (currentPanelInput) {
  currentPanelInput.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) { // Enter
      e.preventDefault();
      let desiredSlide = parseInt(this.value);
      if (desiredSlide >= 1 && desiredSlide <= totalPanelCount) {
        navigateToSlide(desiredSlide);
        this.blur();
      } else {
        this.value = parseInt(currentPanelInput.value);
      }
    }
  });

  currentPanelInput.addEventListener('blur', function() {
    let desiredSlide = parseInt(this.value);
    if (desiredSlide >= 1 && desiredSlide <= totalPanelCount) {
      navigateToSlide(desiredSlide);
    } else {
      this.value = parseInt(currentPanelInput.value);
    }
  });

  currentPanelInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value === '') return;
    if (parseInt(this.value) > totalPanelCount) this.value = totalPanelCount;
    if (parseInt(this.value) < 1) this.value = 1;
  });

  currentPanelInput.addEventListener('click', function() { this.select(); });
}

// Keyboard nav
document.addEventListener('keydown', function(e) {
  if (!currentPanelInput) return;
  if (document.activeElement === currentPanelInput) return;
  let visibleSlide = parseInt(currentPanelInput.value) || 1;
  if (e.keyCode === 40 || e.keyCode === 34) { e.preventDefault(); if (visibleSlide + 1 <= totalPanelCount) navigateToSlide(visibleSlide + 1); }
  if (e.keyCode === 38 || e.keyCode === 33) { e.preventDefault(); if (visibleSlide - 1 >= 1) navigateToSlide(visibleSlide - 1); }
  if (e.keyCode === 36) { e.preventDefault(); navigateToSlide(1); }
  if (e.keyCode === 35) { e.preventDefault(); navigateToSlide(totalPanelCount); }
});

// =========================================================================
// DROPDOWN HANDLERS (IMPROVED)
// =========================================================================

let dropdownToggle = document.getElementById('dropdownToggle');
let dropdownMenu = document.getElementById('dropdownMenu');

// When opening the dropdown ensure current item is highlighted and scrolled into view
if (dropdownToggle && dropdownMenu) {
  dropdownToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    dropdownToggle.classList.toggle('active');

    // Immediately re-apply active highlight when dropdown opens
    const current = parseInt(currentPanelInput ? currentPanelInput.value : 1) || 1;
    refreshDropdownActivePage(current);

    // If opened, scroll the highlighted item into view
    if (dropdownMenu.classList.contains('show')) {
      const highlighted = dropdownMenu.querySelector('a.current-page');
      if (highlighted) highlighted.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  });
}

// Delegated click handler for dropdown menu items
if (dropdownMenu) {
  dropdownMenu.addEventListener('click', function(e) {
    const targetLink = e.target.closest('a');
    if (!targetLink) return;

    // must have data-slide-index
    const idxAttr = targetLink.getAttribute('data-slide-index');
    if (!idxAttr) return;

    e.preventDefault();

    const targetSlide = parseInt(idxAttr);

    // close dropdown visually
    dropdownMenu.classList.remove('show');
    if (dropdownToggle) dropdownToggle.classList.remove('active');

    // instant visual feedback: mark the clicked item active
    refreshDropdownActivePage(targetSlide);
    if (window.updateDropdownTitle) window.updateDropdownTitle(targetSlide);

    // navigate (final highlight re-asserted in onComplete)
    navigateToSlide(targetSlide);
  });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (dropdownToggle && dropdownMenu && !dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
    if (dropdownToggle) dropdownToggle.classList.remove('active');
  }
});

/**
 * Updates the 'current-page' class for dropdown links (1-based index).
 * This function handles both class toggling AND inline styles to ensure
 * highlighting works consistently across all navigation methods.
 */
function refreshDropdownActivePage(activePage) {
  console.log('🎯 refreshDropdownActivePage called with:', activePage);
  
  const dropdownLinks = document.querySelectorAll('#dropdownMenu a'); 
  console.log('📝 Found dropdown links:', dropdownLinks.length);
  
  if (!dropdownLinks || dropdownLinks.length === 0) return;

  dropdownLinks.forEach(function(navLink) {
    const attr = navLink.getAttribute('data-slide');
    const linkPageNumber = attr ? parseInt(attr) : NaN;
    
    if (linkPageNumber === activePage) {
      console.log('✅ Highlighting item:', linkPageNumber); // DEBUG
      
      navLink.classList.add('current-page');
      
      // Use setProperty with !important to override CSS
      // navLink.style.setProperty('background-color', '#FBB24A', 'important');
      // navLink.style.setProperty('color', '#ffffff', 'important');
      // navLink.style.setProperty('font-weight', '700', 'important');
      // navLink.style.setProperty('border-radius', '0.5em', 'important');
    } else {
      navLink.classList.remove('current-page');
      
      // Remove inline styles
      // navLink.style.removeProperty('background-color');
      // navLink.style.removeProperty('color');
      // navLink.style.removeProperty('font-weight');
      // navLink.style.removeProperty('border-radius');
    }
  });

  // If dropdown is open, ensure the active item is visible
  if (dropdownMenu && dropdownMenu.classList.contains('show')) {
    const activeEl = dropdownMenu.querySelector('a.current-page');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }
}

// Expose for debugging / external usage
window.refreshDropdownActivePage = refreshDropdownActivePage;
window.navigateToSlide = navigateToSlide;

// Initialize first state after DOM ready
document.addEventListener('DOMContentLoaded', function(){
  const initial = parseInt(currentPanelInput ? currentPanelInput.value : 1) || 1;
  setTimeout(function(){ refreshSlideCounter(initial); }, 50);
});

// PRODUCT MODAL helpers (unchanged from your file, kept for completeness)
function displayProductModal(productTitle, productImage, lidGrams, tubGrams, boxQuantity) {
  const productDialog = document.getElementById('product-modal');
  const modalContent = productDialog?.querySelector('div.bg-white');
  if (!productDialog || !modalContent) return;

  let [bigTitle, smallTitle] = productTitle.split("  ");
  document.getElementById('modal-product-title').innerHTML = `
    <span class="block text-[3vw] font-bold leading-tight">${bigTitle}</span>
    <span class="block text-[1.6vw] font-semibold leading-tight">${smallTitle}</span>
  `;

  document.getElementById('modal-product-image').src = productImage;
  document.getElementById('modal-lid-weight').textContent = `Lid Weight - ${lidGrams}`;
  document.getElementById('modal-tub-weight').textContent = `Tub Weight - ${tubGrams}`;
  document.getElementById('modal-pack-quantity').textContent = `No of pack in box - ${boxQuantity}`;

  productDialog.classList.remove('hidden');
  productDialog.classList.add('flex');
  gsap.set(modalContent, { clearProps: "all" });
  gsap.from(modalContent, { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.out" });
}

function hideProductModal() {
  const productDialog = document.getElementById('product-modal');
  const modalContent = productDialog?.querySelector('div.bg-white');
  if (!productDialog || !modalContent) return;

  gsap.to(modalContent, {
    scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
    onComplete: () => {
      productDialog.classList.remove('flex');
      productDialog.classList.add('hidden');
      gsap.set(modalContent, { clearProps: "all" });
    }
  });
}

window.openProductModal = displayProductModal;
window.closeProductModal = hideProductModal;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-modal-btn')?.addEventListener('click', hideProductModal);
  const productDialog = document.getElementById('product-modal');
  if (productDialog) {
    productDialog.addEventListener('click', (evt) => { if (evt.target === productDialog) hideProductModal(); });
  }
  document.addEventListener('keydown', (evt) => {
    if (productDialog && evt.key === 'Escape' && !productDialog.classList.contains('hidden')) hideProductModal();
  });
});