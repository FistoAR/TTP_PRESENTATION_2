// console.clear();
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let mainScroller = document.querySelector('.viewport-container');
let allSlides = gsap.utils.toArray(".slide-item");
let currentPanelInput = document.querySelector('.current-panel-input');
let totalPanelCount = allSlides.length;
let panelCount = document.querySelector('.panel-count');
panelCount.innerHTML = totalPanelCount;

// Set max attribute dynamically
currentPanelInput.setAttribute('max', totalPanelCount);

let prevArrow = document.querySelector(".prev-arrow");
let nextArrow = document.querySelector(".next-arrow");

// Remove fixed positioning and use normal flow
allSlides.forEach((slide, index) => {
  slide.style.position = 'relative';
  slide.style.zIndex = 100 - index;
});

// Create scroll triggers for each slide
allSlides.forEach((eachSlide, index) => {
  let realIndex = (index + 1);

  ScrollTrigger.create({
    trigger: eachSlide,
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => updateSlideCounter(realIndex),
    onEnterBack: () => updateSlideCounter(realIndex)
  });
});

function updateSlideCounter(slideNumber) {
  currentPanelInput.value = slideNumber;
  
  let indexNext = slideNumber + 1;
  let indexPrev = slideNumber - 1;
  
  nextArrow.setAttribute('data-down', indexNext);
  prevArrow.setAttribute('data-up', indexPrev);
  
  updateControls(indexPrev, indexNext);
}

function updateControls(keyIndexUp, keyIndexDown) {
  if (keyIndexUp >= 1) {
    prevArrow.classList.remove('disabled');
  } else {
    prevArrow.classList.add('disabled');
  }

  if (keyIndexDown <= totalPanelCount) {
    nextArrow.classList.remove('disabled');
  } else {
    nextArrow.classList.add('disabled');
  }
}

// FIXED: Next arrow click handler
nextArrow.addEventListener("click", function(e) {
  e.preventDefault();
  let currentSlide = parseInt(currentPanelInput.value);
  let nextSlide = currentSlide + 1;
  
  console.log('Next clicked - Current:', currentSlide, 'Next:', nextSlide, 'Total:', totalPanelCount);
  
  if (nextSlide <= totalPanelCount) {
    scrollToSlide(nextSlide);
  }
});

// FIXED: Previous arrow click handler
prevArrow.addEventListener("click", function(e) {
  e.preventDefault();
  let currentSlide = parseInt(currentPanelInput.value);
  let prevSlide = currentSlide - 1;
  
  console.log('Prev clicked - Current:', currentSlide, 'Prev:', prevSlide);
  
  if (prevSlide >= 1) {
    scrollToSlide(prevSlide);
  }
});

function scrollToSlide(targetSlide) {
  console.log('Scrolling to slide:', targetSlide);
  
  // Get the target slide element
  let targetElement = allSlides[targetSlide - 1];
  
  if (targetElement) {
    gsap.to(mainScroller, {
      ease: "power2.inOut",
      duration: 0.8,
      scrollTo: {
        y: targetElement,
        autoKill: false
      }
    });
  }
}

// Input field navigation - Go to slide when user types and presses Enter
currentPanelInput.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) { // Enter key
    e.preventDefault();
    let targetSlide = parseInt(this.value);
    
    // Validate input
    if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
      scrollToSlide(targetSlide);
      this.blur(); // Remove focus from input
    } else {
      // Reset to current slide if invalid
      this.value = parseInt(currentPanelInput.value);
    }
  }
});

// Input field navigation - Go to slide on blur (when clicking outside)
currentPanelInput.addEventListener('blur', function() {
  let targetSlide = parseInt(this.value);
  
  // Validate and navigate
  if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
    scrollToSlide(targetSlide);
  } else {
    // Reset to current visible slide if invalid
    let currentSlideNum = parseInt(currentPanelInput.value);
    this.value = currentSlideNum;
  }
});

// Prevent invalid input - only allow numbers
currentPanelInput.addEventListener('input', function() {
  // Remove non-numeric characters
  this.value = this.value.replace(/[^0-9]/g, '');
  
  // Limit to max slide number
  if (parseInt(this.value) > totalPanelCount) {
    this.value = totalPanelCount;
  }
  
  // Prevent 0 or negative numbers
  if (parseInt(this.value) < 1 && this.value !== '') {
    this.value = 1;
  }
});

// Select all text when clicking on input
currentPanelInput.addEventListener('click', function() {
  this.select();
});

// Keyboard navigation with arrow keys
document.addEventListener('keydown', function(e) {
  // Don't trigger if user is typing in the input field
  if (document.activeElement === currentPanelInput) {
    return;
  }
  
  let currentSlideNum = parseInt(currentPanelInput.value);
  
  if (e.keyCode === 40 || e.keyCode === 34) {
    e.preventDefault();
    let nextSlide = currentSlideNum + 1;
    if (nextSlide <= totalPanelCount) {
      scrollToSlide(nextSlide);
    }
  }
  
  if (e.keyCode === 38 || e.keyCode === 33) {
    e.preventDefault();
    let prevSlide = currentSlideNum - 1;
    if (prevSlide >= 1) {
      scrollToSlide(prevSlide);
    }
  }
  
  if (e.keyCode === 36) {
    e.preventDefault();
    scrollToSlide(1);
  }
  
  if (e.keyCode === 35) {
    e.preventDefault();
    scrollToSlide(totalPanelCount);
  }
});

// Page Dropdown Navigation
let dropdownToggle = document.getElementById('dropdownToggle');
let dropdownMenu = document.getElementById('dropdownMenu');
let dropdownLinks = document.querySelectorAll('.dropdown-menu a');

// Toggle dropdown menu
dropdownToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  dropdownMenu.classList.toggle('show');
  dropdownToggle.classList.toggle('active');
});

// Navigate to selected page
dropdownLinks.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    let targetSlide = parseInt(this.getAttribute('data-slide'));
    
    // Close dropdown
    dropdownMenu.classList.remove('show');
    dropdownToggle.classList.remove('active');
    
    // Navigate to slide
    scrollToSlide(targetSlide);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('show');
    dropdownToggle.classList.remove('active');
  }
});

// Update current page indicator in dropdown
function updateDropdownCurrentPage(slideNumber) {
  dropdownLinks.forEach(function(link) {
    let linkSlide = parseInt(link.getAttribute('data-slide'));
    if (linkSlide === slideNumber) {
      link.classList.add('current-page');
    } else {
      link.classList.remove('current-page');
    }
  });
}

// Modified updateSlideCounter to include dropdown update
function updateSlideCounter(slideNumber) {
  currentPanelInput.value = slideNumber;
  
  let indexNext = slideNumber + 1;
  let indexPrev = slideNumber - 1;
  
  nextArrow.setAttribute('data-down', indexNext);
  prevArrow.setAttribute('data-up', indexPrev);
  
  updateControls(indexPrev, indexNext);
  updateDropdownCurrentPage(slideNumber);
}

// Initialize first state
updateSlideCounter(1);

// Product Modal Functions
function openProductModal(title, imageSrc, lidWeight, tubWeight, packQuantity) {
  const modal = document.getElementById('product-modal');

  document.getElementById('modal-product-title').innerHTML = title;
  document.getElementById('modal-product-image').src = imageSrc;
  document.getElementById('modal-lid-weight').textContent = `Lid Weight - ${lidWeight}`;
  document.getElementById('modal-tub-weight').textContent = `Tub Weight - ${tubWeight}`;
  document.getElementById('modal-pack-quantity').textContent = `No of pack in box - ${packQuantity}`;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}


function closeProductModal() {
  const modal = document.getElementById('product-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Make functions globally accessible
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;

// Attach the close function to the close button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-modal-btn').addEventListener('click', closeProductModal);

  // Close modal when clicking outside
  const modal = document.getElementById('product-modal');
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeProductModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeProductModal();
    }
  });
});











// // console.clear();
// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// let mainScroller = document.querySelector('.viewport-container');
// let allSlides = gsap.utils.toArray(".slide-item");
// let currentPanelInput = document.querySelector('.current-panel-input');
// let totalPanelCount = allSlides.length;
// let panelCount = document.querySelector('.panel-count');
// panelCount.innerHTML = totalPanelCount;

// // Set max attribute dynamically
// currentPanelInput.setAttribute('max', totalPanelCount);

// let prevArrow = document.querySelector(".prev-arrow");
// let nextArrow = document.querySelector(".next-arrow");

// // Remove fixed positioning and use normal flow
// allSlides.forEach((slide, index) => {
//   slide.style.position = 'relative';
//   slide.style.zIndex = 100 - index;
// });

// // Create scroll triggers for each slide
// allSlides.forEach((eachSlide, index) => {
//   let realIndex = (index + 1);

//   ScrollTrigger.create({
//     trigger: eachSlide,
//     scroller: ".viewport-container",
//     start: "top 80%",
//     end: "bottom 20%",
//     onEnter: () => updateSlideCounter(realIndex),
//     onEnterBack: () => updateSlideCounter(realIndex)
//   });
// });

// function updateSlideCounter(slideNumber) {
//   currentPanelInput.value = slideNumber;
  
//   let indexNext = slideNumber + 1;
//   let indexPrev = slideNumber - 1;
  
//   nextArrow.setAttribute('data-down', indexNext);
//   prevArrow.setAttribute('data-up', indexPrev);
  
//   updateControls(indexPrev, indexNext);
// }

// function updateControls(keyIndexUp, keyIndexDown) {
//   if (keyIndexUp >= 1) {
//     prevArrow.classList.remove('disabled');
//   } else {
//     prevArrow.classList.add('disabled');
//   }

//   if (keyIndexDown <= totalPanelCount) {
//     nextArrow.classList.remove('disabled');
//   } else {
//     nextArrow.classList.add('disabled');
//   }
// }

// nextArrow.addEventListener("click", function(e) {
//   e.preventDefault();
//   let nextSlide = parseInt(this.getAttribute('data-down'));
//   if (nextSlide <= totalPanelCount) {
//     scrollToSlide(nextSlide);
//   }
// });

// prevArrow.addEventListener("click", function(e) {
//   e.preventDefault();
//   let prevSlide = parseInt(this.getAttribute('data-up'));
//   if (prevSlide >= 1) {
//     scrollToSlide(prevSlide);
//   }
// });

// function scrollToSlide(targetSlide) {
//   gsap.to(mainScroller, {
//     ease: "power2.inOut",
//     duration: 0.8,
//     scrollTo: {
//       y: "#slide_" + targetSlide,
//       autoKill: false
//     }
//   });
// }

// // Input field navigation - Go to slide when user types and presses Enter
// currentPanelInput.addEventListener('keydown', function(e) {
//   if (e.keyCode === 13) { // Enter key
//     e.preventDefault();
//     let targetSlide = parseInt(this.value);
    
//     // Validate input
//     if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
//       scrollToSlide(targetSlide);
//       this.blur(); // Remove focus from input
//     } else {
//       // Reset to current slide if invalid
//       this.value = parseInt(currentPanelInput.value);
//     }
//   }
// });

// // Input field navigation - Go to slide on blur (when clicking outside)
// currentPanelInput.addEventListener('blur', function() {
//   let targetSlide = parseInt(this.value);
  
//   // Validate and navigate
//   if (targetSlide >= 1 && targetSlide <= totalPanelCount) {
//     scrollToSlide(targetSlide);
//   } else {
//     // Reset to current visible slide if invalid
//     let currentSlideNum = parseInt(currentPanelInput.value);
//     this.value = currentSlideNum;
//   }
// });

// // Prevent invalid input - only allow numbers
// currentPanelInput.addEventListener('input', function() {
//   // Remove non-numeric characters
//   this.value = this.value.replace(/[^0-9]/g, '');
  
//   // Limit to max slide number
//   if (parseInt(this.value) > totalPanelCount) {
//     this.value = totalPanelCount;
//   }
  
//   // Prevent 0 or negative numbers
//   if (parseInt(this.value) < 1 && this.value !== '') {
//     this.value = 1;
//   }
// });

// // Select all text when clicking on input
// currentPanelInput.addEventListener('click', function() {
//   this.select();
// });

// // Keyboard navigation with arrow keys
// document.addEventListener('keydown', function(e) {
//   // Don't trigger if user is typing in the input field
//   if (document.activeElement === currentPanelInput) {
//     return;
//   }
  
//   let currentSlideNum = parseInt(currentPanelInput.value);
  
//   if (e.keyCode === 40 || e.keyCode === 34) {
//     e.preventDefault();
//     let nextSlide = currentSlideNum + 1;
//     if (nextSlide <= totalPanelCount) {
//       scrollToSlide(nextSlide);
//     }
//   }
  
//   if (e.keyCode === 38 || e.keyCode === 33) {
//     e.preventDefault();
//     let prevSlide = currentSlideNum - 1;
//     if (prevSlide >= 1) {
//       scrollToSlide(prevSlide);
//     }
//   }
  
//   if (e.keyCode === 36) {
//     e.preventDefault();
//     scrollToSlide(1);
//   }
  
//   if (e.keyCode === 35) {
//     e.preventDefault();
//     scrollToSlide(totalPanelCount);
//   }
// });


// // Page Dropdown Navigation
// let dropdownToggle = document.getElementById('dropdownToggle');
// let dropdownMenu = document.getElementById('dropdownMenu');
// let dropdownLinks = document.querySelectorAll('.dropdown-menu a');

// // Toggle dropdown menu
// dropdownToggle.addEventListener('click', function(e) {
//   e.stopPropagation();
//   dropdownMenu.classList.toggle('show');
//   dropdownToggle.classList.toggle('active');
// });

// // Navigate to selected page
// dropdownLinks.forEach(function(link) {
//   link.addEventListener('click', function(e) {
//     e.preventDefault();
//     let targetSlide = parseInt(this.getAttribute('data-slide'));
    
//     // Close dropdown
//     dropdownMenu.classList.remove('show');
//     dropdownToggle.classList.remove('active');
    
//     // Navigate to slide
//     scrollToSlide(targetSlide);
//   });
// });

// // Close dropdown when clicking outside
// document.addEventListener('click', function(e) {
//   if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
//     dropdownMenu.classList.remove('show');
//     dropdownToggle.classList.remove('active');
//   }
// });

// // Update current page indicator in dropdown
// function updateDropdownCurrentPage(slideNumber) {
//   dropdownLinks.forEach(function(link) {
//     let linkSlide = parseInt(link.getAttribute('data-slide'));
//     if (linkSlide === slideNumber) {
//       link.classList.add('current-page');
//     } else {
//       link.classList.remove('current-page');
//     }
//   });
// }

// // Call this inside updateSlideCounter function
// // Modify your existing updateSlideCounter function:
// function updateSlideCounter(slideNumber) {
//   currentPanelInput.value = slideNumber;
  
//   let indexNext = slideNumber + 1;
//   let indexPrev = slideNumber - 1;
  
//   nextArrow.setAttribute('data-down', indexNext);
//   prevArrow.setAttribute('data-up', indexPrev);
  
//   updateControls(indexPrev, indexNext);
//   updateDropdownCurrentPage(slideNumber); // Add this line
// }


// // Initialize first state
// updateSlideCounter(1);












// // Function to open the modal and populate data
// function openProductModal(title, imageSrc, height, width, lidWeight, tubWeight, packQuantity) {
//     const modal = document.getElementById('product-modal');
    
//     // Set the data into the modal elements
//     document.getElementById('modal-product-title').textContent = title;
//     document.getElementById('modal-product-image').src = imageSrc;
//     // document.getElementById('modal-dimension-height').textContent = height;
//     // document.getElementById('modal-dimension-width').textContent = width;
//     document.getElementById('modal-lid-weight').textContent = `Lid Weight - ${lidWeight}`;
//     document.getElementById('modal-tub-weight').textContent = `Tub Weight - ${tubWeight}`;
//     document.getElementById('modal-pack-quantity').textContent = `No of pack in box - ${packQuantity}`;

//     // Show the modal by replacing 'hidden' with 'flex'
//     modal.classList.remove('hidden');
//     modal.classList.add('flex');
// }

// // Function to close the modal
// function closeProductModal() {
//     const modal = document.getElementById('product-modal');
//     modal.classList.remove('flex');
//     modal.classList.add('hidden');
// }

// // Attach the close function to the close button
// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('close-modal-btn').addEventListener('click', closeProductModal);

//     // Optional: Close modal when clicking outside of it
//     const modal = document.getElementById('product-modal');
//     modal.addEventListener('click', (event) => {
//         // Check if the click occurred directly on the modal background (not the inner content)
//         if (event.target === modal) {
//             closeProductModal();
//         }
//     });

//     // Optional: Close modal on Escape key press
//     document.addEventListener('keydown', (event) => {
//         if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
//             closeProductModal();
//         }
//     });
// });


// console.clear();
// console.clear();
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let viewportWrapper = document.querySelector('.viewport-container');
let slideElements = gsap.utils.toArray(".slide-item");
let slideNumberInput = document.querySelector('.current-panel-input');
let totalSlideCount = slideElements.length;
let slideCountDisplay = document.querySelector('.panel-count');
slideCountDisplay.innerHTML = totalSlideCount;

slideNumberInput.setAttribute('max', totalSlideCount);

let previousButton = document.querySelector(".prev-arrow");
let nextButton = document.querySelector(".next-arrow");

slideElements.forEach((singleSlide, idx) => {
  singleSlide.style.position = 'relative';
  singleSlide.style.zIndex = 100 - idx;
});

// ===================== SCROLL TRIGGER ANIMATIONS =====================

// Hero Slide Animation


// Slide 2 (Products) Animation
gsap.from("#slide_2 h2", {
  scrollTrigger: {
    trigger: "#slide_2",
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 60,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#slide_2 h3", {
  scrollTrigger: {
    trigger: "#slide_2",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  x: -50,
  duration: 0.8,
  stagger: 0.3,
  ease: "power2.out"
});

gsap.from("#slide_2 .product-card", {
  scrollTrigger: {
    trigger: "#slide_2",
    scroller: ".viewport-container",
    start: "top 70%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 50,
  scale: 0.9,
  duration: 0.6,
  stagger: {
    amount: 1.2,
    from: "start",
    ease: "power1.inOut"
  },
  ease: "back.out(1.7)"
});

// Slide 3 (IML Process) Animation
gsap.from("#slide_3 h2", {
  scrollTrigger: {
    trigger: "#slide_3",
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 60,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#slide_3 > div > p", {
  scrollTrigger: {
    trigger: "#slide_3",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 40,
  duration: 0.8,
  delay: 0.2,
  ease: "power2.out"
});

// Step cards animation
gsap.from("#slide_3 .w-\\[13vw\\]", {
  scrollTrigger: {
    trigger: "#slide_3",
    scroller: ".viewport-container",
    start: "top 70%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 80,
  scale: 0.8,
  duration: 0.8,
  stagger: 0.2,
  ease: "back.out(1.7)"
});

gsap.from("#slide_3 .flex.gap-3vw img", {
  scrollTrigger: {
    trigger: "#slide_3 .flex.gap-3vw",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  x: -100,
  duration: 1,
  ease: "power2.out"
});

gsap.from("#slide_3 .flex.gap-3vw p", {
  scrollTrigger: {
    trigger: "#slide_3 .flex.gap-3vw",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  x: 100,
  duration: 1,
  delay: 0.3,
  ease: "power2.out"
});

// Slide 4 (Screen Printing) Animation
gsap.from("#slide_4 h2", {
  scrollTrigger: {
    trigger: "#slide_4",
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 60,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#slide_4 .w-\\[32vw\\] p, #slide_4 .w-\\[44vw\\]", {
  scrollTrigger: {
    trigger: "#slide_4",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  x: -80,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out"
});

gsap.from("#slide_4 .w-\\[45vw\\] img", {
  scrollTrigger: {
    trigger: "#slide_4",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  x: 100,
  scale: 0.9,
  duration: 1,
  ease: "back.out(1.7)"
});

gsap.from("#slide_4 .grid > div", {
  scrollTrigger: {
    trigger: "#slide_4 .grid",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 50,
  duration: 0.6,
  stagger: 0.15,
  ease: "power2.out"
});

// Slide 5 (Biodegradable Bags) Animation
gsap.from("#slide_5 h2", {
  scrollTrigger: {
    trigger: "#slide_5",
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  scale: 0.8,
  y: 60,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#slide_5 p", {
  scrollTrigger: {
    trigger: "#slide_5",
    scroller: ".viewport-container",
    start: "top 75%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  y: 40,
  duration: 0.8,
  delay: 0.2,
  ease: "power2.out"
});

gsap.from("#slide_5 img", {
  scrollTrigger: {
    trigger: "#slide_5",
    scroller: ".viewport-container",
    start: "top 70%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse"
  },
  opacity: 0,
  scale: 0.8,
  y: 80,
  duration: 1,
  delay: 0.4,
  ease: "back.out(1.7)"
});

// Slide 6 (Types of Bags) Animation

// Slide 7 (Types of Food Containers) Animation


// ===================== END ANIMATIONS =====================

// Create scroll triggers for each slide
slideElements.forEach((pageElement, idx) => {
  let pageNumber = (idx + 1);

  ScrollTrigger.create({
    trigger: pageElement,
    scroller: ".viewport-container",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => refreshSlideCounter(pageNumber),
    onEnterBack: () => refreshSlideCounter(pageNumber)
  });
});

function refreshSlideCounter(currentNumber) {
  slideNumberInput.value = currentNumber;
  
  let followingIndex = currentNumber + 1;
  let precedingIndex = currentNumber - 1;
  
  nextButton.setAttribute('data-down', followingIndex);
  previousButton.setAttribute('data-up', precedingIndex);
  
  refreshNavigationControls(precedingIndex, followingIndex);
  refreshDropdownActivePage(currentNumber);
  
  // Update dropdown button title
  if (window.updateDropdownTitle) {
    window.updateDropdownTitle(currentNumber);
  }
}

function refreshNavigationControls(upIndex, downIndex) {
  if (upIndex >= 1) {
    previousButton.classList.remove('disabled');
  } else {
    previousButton.classList.add('disabled');
  }

  if (downIndex <= totalSlideCount) {
    nextButton.classList.remove('disabled');
  } else {
    nextButton.classList.add('disabled');
  }
}

nextButton.addEventListener("click", function(e) {
  e.preventDefault();
  let activeSlide = parseInt(slideNumberInput.value);
  let targetNext = activeSlide + 1;
  
  if (targetNext <= totalSlideCount) {
    navigateToSlide(targetNext);
  }
});

previousButton.addEventListener("click", function(e) {
  e.preventDefault();
  let activeSlide = parseInt(slideNumberInput.value);
  let targetPrev = activeSlide - 1;
  
  if (targetPrev >= 1) {
    navigateToSlide(targetPrev);
  }
});

function navigateToSlide(destinationSlide) {
  let destinationElement = slideElements[destinationSlide - 1];
  
  if (destinationElement) {
    gsap.to(viewportWrapper, {
      ease: "power2.inOut",
      duration: 0.8,
      scrollTo: {
        y: destinationElement,
        autoKill: false
      }
    });
  }
}

slideNumberInput.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    let desiredSlide = parseInt(this.value);
    
    if (desiredSlide >= 1 && desiredSlide <= totalSlideCount) {
      navigateToSlide(desiredSlide);
      this.blur();
    } else {
      this.value = parseInt(slideNumberInput.value);
    }
  }
});

slideNumberInput.addEventListener('blur', function() {
  let desiredSlide = parseInt(this.value);
  
  if (desiredSlide >= 1 && desiredSlide <= totalSlideCount) {
    navigateToSlide(desiredSlide);
  } else {
    let displayedSlide = parseInt(slideNumberInput.value);
    this.value = displayedSlide;
  }
});

slideNumberInput.addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
  
  if (parseInt(this.value) > totalSlideCount) {
    this.value = totalSlideCount;
  }
  
  if (parseInt(this.value) < 1 && this.value !== '') {
    this.value = 1;
  }
});

slideNumberInput.addEventListener('click', function() {
  this.select();
});

document.addEventListener('keydown', function(e) {
  if (document.activeElement === slideNumberInput) {
    return;
  }
  
  let visibleSlide = parseInt(slideNumberInput.value);
  
  if (e.keyCode === 40 || e.keyCode === 34) {
    e.preventDefault();
    let forwardSlide = visibleSlide + 1;
    if (forwardSlide <= totalSlideCount) {
      navigateToSlide(forwardSlide);
    }
  }
  
  if (e.keyCode === 38 || e.keyCode === 33) {
    e.preventDefault();
    let backwardSlide = visibleSlide - 1;
    if (backwardSlide >= 1) {
      navigateToSlide(backwardSlide);
    }
  }
  
  if (e.keyCode === 36) {
    e.preventDefault();
    navigateToSlide(1);
  }
  
  if (e.keyCode === 35) {
    e.preventDefault();
    navigateToSlide(totalSlideCount);
  }
});

// let menuToggleButton = document.getElementById('dropdownToggle');
let menuDropdown = document.getElementById('dropdownMenu');
let menuNavLinks = document.querySelectorAll('.dropdown-menu a');

// menuToggleButton.addEventListener('click', function(e) {
//   e.stopPropagation();
//   menuDropdown.classList.toggle('show');
//   menuToggleButton.classList.toggle('active');
// });

// menuNavLinks.forEach(function(navLink) {
//   navLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     let selectedSlide = parseInt(this.getAttribute('data-slide'));
    
//     menuDropdown.classList.remove('show');
//     menuToggleButton.classList.remove('active');
    
//     navigateToSlide(selectedSlide);
//   });
// });

// document.addEventListener('click', function(e) {
//   if (!menuToggleButton.contains(e.target) && !menuDropdown.contains(e.target)) {
//     menuDropdown.classList.remove('show');
//     menuToggleButton.classList.remove('active');
//   }
// });

function refreshDropdownActivePage(activePage) {
  menuNavLinks.forEach(function(navLink) {
    let linkPageNumber = parseInt(navLink.getAttribute('data-slide'));
    if (linkPageNumber === activePage) {
      navLink.classList.add('current-page');
    } else {
      navLink.classList.remove('current-page');
    }
  });
}

refreshSlideCounter(1);

// ... (Lines 371-468 remain UNCHANGED in slide.js)

function displayProductModal(productTitle, productImage, lidGrams, tubGrams, boxQuantity) {
  const productDialog = document.getElementById('product-modal');
  const modalContent = productDialog.querySelector('div.bg-white'); // Target the inner content box for animation
  
  // Split product title into two parts based on two spaces: "120ml  Round Container"
  let [bigTitle, smallTitle] = productTitle.split("  ");

  document.getElementById('modal-product-title').innerHTML = `
    <span class="block text-[3vw] font-bold leading-tight">${bigTitle}</span>
    <span class="block text-[1.6vw] font-semibold leading-tight">${smallTitle}</span>
  `;

  document.getElementById('modal-product-image').src = productImage;
  document.getElementById('modal-lid-weight').textContent = `Lid Weight - ${lidGrams}`;
  document.getElementById('modal-tub-weight').textContent = `Tub Weight - ${tubGrams}`;
  document.getElementById('modal-pack-quantity').textContent = `No of pack in box - ${boxQuantity}`;

  // 1. Ensure the modal wrapper is visible immediately (Flex, not hidden)
  productDialog.classList.remove('hidden');
  productDialog.classList.add('flex');
  
  // 2. Clear any lingering GSAP settings from the previous close before running the open animation
  gsap.set(modalContent, { clearProps: "all" });

  // *** GSAP Zoom-in OPEN Animation (MODIFIED) ***
  gsap.from(modalContent, {
      scale: 0.9, // Start smaller (zoom-in effect)
      opacity: 0,
      duration: 0.3, // Shorter duration for quick zoom
      ease: "power2.out" // Smooth acceleration/deceleration
  });
}

function hideProductModal() {
  const productDialog = document.getElementById('product-modal');
  const modalContent = productDialog.querySelector('div.bg-white'); // Target the inner content box for animation

  // *** GSAP Zoom-Out CLOSE Animation ***
  gsap.to(modalContent, {
      scale: 0.8, // Zoom out
      opacity: 0, // Fade out
      duration: 0.3,
      ease: "power2.in", // Fast ease-in for quick disappearance
      onComplete: () => {
          // 1. Hide the modal wrapper
          productDialog.classList.remove('flex');
          productDialog.classList.add('hidden');
          
          // 2. CRITICAL: Reset scale and opacity back to 1/initial state 
          // so the next 'zoom-in' animation starts correctly.
          gsap.set(modalContent, { clearProps: "all" });
      }
  });
}

window.openProductModal = displayProductModal;
window.closeProductModal = hideProductModal;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-modal-btn').addEventListener('click', hideProductModal);

  const productDialog = document.getElementById('product-modal');
  productDialog.addEventListener('click', (evt) => {
    if (evt.target === productDialog) {
      hideProductModal();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && !productDialog.classList.contains('hidden')) {
      hideProductModal();
    }
  });
});