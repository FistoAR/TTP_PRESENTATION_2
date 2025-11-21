// ==========================================
// ANIMATION SYSTEM - TTP Presentation
// ==========================================
// Add this file AFTER your slide.js and script.js
// Include in your HTML: <script src="./js/animations.js"></script>

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// ANIMATION CONFIGURATION
// ==========================================
const ANIMATION_CONFIG = {
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.inOut",
  scroller: ".viewport-container"
};

// ==========================================
// UNIVERSAL ANIMATION HELPER WITH REVERSE
// ==========================================
function createSlideAnimation(selector, animationProps) {
  const elements = document.querySelectorAll(selector);
  
  if (elements.length === 0) {
    console.warn(`No elements found for selector: ${selector}`);
    return;
  }

  elements.forEach((element, index) => {
    // Ensure element is visible before animation
    if (element.style.display === 'none') {
      element.style.display = '';
    }

    gsap.from(element, {
      scrollTrigger: {
        trigger: element.closest('.slide-item') || element,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse", // Play on enter, reverse on leave
        markers: false,
        onEnter: () => {
          element.style.opacity = '1';
        },
        onLeave: () => {
          // Reset for reverse animation
          gsap.to(element, {
            ...animationProps,
            duration: 0,
            delay: 0,
            stagger: 0
          });
        },
        onEnterBack: () => {
          element.style.opacity = '1';
        },
        onLeaveBack: () => {
          // Reset for reverse animation
          gsap.to(element, {
            ...animationProps,
            duration: 0,
            delay: 0,
            stagger: 0
          });
        }
      },
      ...animationProps,
      duration: animationProps.duration || ANIMATION_CONFIG.duration,
      delay: (animationProps.delay || 0) + (index * (animationProps.stagger || ANIMATION_CONFIG.stagger)),
      ease: animationProps.ease || ANIMATION_CONFIG.ease
    });
  });
}



function animateSlide1() {
  let root = ".slide-item[data-navigation='Home']";
  
  const mainTextSelector = root + " .header-txt-1";
  const locationTextSelector = root + " .absolute.top-\\[44\\%\\] .flex.flex-col.header-txt-1";

  // ⭐ FIXED 1: SET INITIAL STATE TO HIDE ELEMENTS BEFORE ANIMATION ⭐
  // This prevents the flicker when the page loads.
  gsap.set([mainTextSelector, locationTextSelector], { opacity: 0 }); 

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "restart reverse restart reverse"
    }
  });

  // ⭐ FIXED 2: Change to gsap.fromTo() to guarantee the final state is VISIBLE ⭐
  // Initial animations (Text blocks)
  tl.fromTo(mainTextSelector, 
    { x: -250, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
    0.1
  );

  // Location/Clock text animation
  tl.fromTo(locationTextSelector, 
    { y: 40, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" }, 
    0.5
  ); 
  
  // Image animation (remains gsap.fromTo)
  tl.fromTo(root + " img[alt='bottom-circle']", 
    { y: 100, opacity: 0, scale: 0.9 }, 
    { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 
    0.3
  );

  // Container animation - ALL 3 CONTAINERS
  const containers = [
    root + " img[alt='250ml-container']",
    root + " img[alt='450ml-container']",
    root + " img[alt='1kg-container']",
    root + " img[alt='250ml-glass-container']"
  ];
  
  const popUpDuration = 0.8;    
  const holdDuration = 1.0;     
  const moveDuration = 1.5;     
  const totalCycle = popUpDuration + holdDuration + moveDuration;
  
  // Infinite timeline
  let infiniteTl = gsap.timeline({ repeat: -1, paused: true });
  
  // Set initial state for all 3 containers
  gsap.set(containers, { y: 100, opacity: 0, scale: 0.9 });
  
  // Animate each container sequentially
  containers.forEach((container, index) => {
    const startTime = index * totalCycle;
    
    infiniteTl
      // 1. Pop up from bottom
      .to(container, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: popUpDuration,
        ease: "power3.out"
      }, startTime)
      // 2. Hold/pause for 1 second
      .to(container, {
        y: 0,
        duration: holdDuration
      }, startTime + popUpDuration)
      // 3. Move upward and fade out
      .to(container, {
        y: -120,
        opacity: 0,
        duration: moveDuration,
        ease: "power1.in"
      }, startTime + popUpDuration + holdDuration)
      // 4. Reset to bottom
      .set(container, {
        y: 100,
        opacity: 0,
        scale: 0.9
      });
  });
  
  // Start infinite animation
  tl.add(() => infiniteTl.play(), 0.8);
  
  // FIXED: Reset on reverse scroll / leave
  tl.scrollTrigger.vars.onLeaveBack = () => {
    infiniteTl.pause(0);
    gsap.set(containers, { y: 100, opacity: 0, scale: 0.9 });
    
    // Explicitly reset the text elements to their final visible state
    gsap.set([mainTextSelector, locationTextSelector], { 
        x: 0, 
        y: 0, 
        opacity: 1,
        clearProps: "transform, opacity" 
    });
  };
  
  // Also ensure the loop stops immediately if the scroll position jumps past.
  tl.scrollTrigger.vars.onLeave = () => {
    infiniteTl.pause(0);
  };
  
  // Re-enable infinite loop if we scroll back in
  tl.scrollTrigger.vars.onEnterBack = () => {
      // Re-add the animation state, ensuring visibility
      gsap.set([mainTextSelector, locationTextSelector], { opacity: 1, x: 0, y: 0 });
      infiniteTl.play();
  };
}
// ==========================================
// SLIDE 2: TYPES OF FOOD CONTAINERS
// ==========================================
function animateSlide2() {

  // Heading (normal fade + slide)
  gsap.from("[id*='TYPES OF FOOD CONTAINERS'] h2", {
    scrollTrigger: {
      trigger: "[id*='TYPES OF FOOD CONTAINERS']",
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: -40,
    duration: 0.8,
    ease: "power3.out"
  });


// CREATE TRIGGERS FOR EACH CARD
gsap.utils.toArray("[id*='TYPES OF FOOD CONTAINERS'] .flex.flex-col.items-center").forEach(card => {
    
    const line = card.querySelector(".dotted-line");
    const image = card.querySelector(".dotted-image");

    ScrollTrigger.create({
        trigger: card,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 80%",
        
        onEnter: () => revealSequence(line, image),
        onEnterBack: () => revealSequence(line, image),
    });
});

// REVEAL FUNCTION: line → image
function revealSequence(line, image) {

    // Step 1 — reset both
    gsap.set([line, image], { clipPath: "inset(0 0 100% 0)" });

    // Step 2 — timeline animation
    let tl = gsap.timeline();

    tl.to(line, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1,
        ease: "power3.out"
    })
    .to(image, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1,
        ease: "power3.out"
    }, "-=0.3"); 
    // image starts slightly before line finishes
}



  // // Rolling reveal for container items
  // gsap.from("[id*='TYPES OF FOOD CONTAINERS'] .flex.flex-col.items-center", {
  //   scrollTrigger: {
  //     trigger: "[id*='TYPES OF FOOD CONTAINERS']",
  //     scroller: ANIMATION_CONFIG.scroller,
  //     start: "top 85%",
  //     end: "bottom 15%",
  //     toggleActions: "play reverse play reverse"
  //   },
  //   opacity: 0,
  //   y: -80,          // move from top
  //   rotateX: 90,     // rolling down effect
  //   transformOrigin: "top center",
  //   duration: 0.8,
  //   delay: 0.15,
  //   stagger: 0.12,
  //   ease: "back.out(1.7)"
  // });


}


// ==========================================
// SLIDE 3: PP SUSTAINABLE
// ==========================================
function animateSlide3() {
  const slide = document.querySelector("[id*='PP-SUSTAINABLE']");
  if (!slide) return;

  // Heading
  gsap.from(slide.querySelector("h2"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  });

  // Text content
  gsap.from(slide.querySelector(".w-\\[60vw\\]"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    x: -80,
    duration: 0.9,
    delay: 0.2,
    ease: "power2.out"
  });

  // Image
  gsap.from(slide.querySelector("img[alt='man-with-question']") || slide.querySelector(".w-\\[20vw\\]"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    x: 100,
    scale: 0.8,
    duration: 1,
    delay: 0.3,
    ease: "back.out(1.7)"
  });
}

// ==========================================
// SLIDE 4: MARKING AND ENGRAVING
// ==========================================
function animateSlide4() {
  const slide = document.querySelector("[id*='MARKING and ENGRAVING']");
  if (!slide) return;

  // Heading
  gsap.from(slide.querySelector("h2"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  });

  // Background image
  gsap.from(slide.querySelector(".relative img:first-child"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    scale: 0.9,
    duration: 1,
    delay: 0.2,
    ease: "back.out(1.5)"
  });

  // Icons
  gsap.from(slide.querySelectorAll(".w-\\[7vw\\]"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 30,
    scale: 0.5,
    duration: 0.6,
    delay: 0.3,
    stagger: 0.15,
    ease: "back.out(1.7)"
  });

  // Text descriptions
  gsap.from(slide.querySelectorAll("p.absolute"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    delay: 0.4,
    stagger: 0.12,
    ease: "power2.out"
  });
}

// ==========================================
// SLIDE 5: MARKET SIZE
// ==========================================
function animateSlide5() {
  const slide = document.querySelector(".sec-9");
  if (!slide) return;

  // HEADING
  gsap.from(slide.querySelector("h3"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: -40,
    duration: 0.8,
    ease: "power3.out"
  });

  // 🔥 IMAGE ROLLING REVEAL (top → bottom)
  gsap.from(slide.querySelectorAll(".sec-9-item"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    clipPath: "inset(0 0 100% 0)",   // start hidden from top
    opacity: 0,
    duration: 1.4,                   // smooth slow reveal
    ease: "power3.out",
    stagger: 0                       // all same time
  });

  // TITLES under each item
  gsap.from(slide.querySelectorAll(".sec-9-grid-item-title"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: -20,
    duration: 0.6,
    ease: "power2.out"
  });
}


// ==========================================
// SLIDE 6: PRODUCTS
// ==========================================
function animateSlide6() {
  const slide = document.querySelector("[id*='PRODUCTS']");
  if (!slide) return;

  // Main heading
  gsap.from(slide.querySelector("h2"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 0.9,
    ease: "power3.out"
  });

  // Product cards
  gsap.from(slide.querySelectorAll(".product-card"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    scale: 0.85,
    duration: 0.5,
    delay: 0.2,
    stagger: {
      amount: 1.5,
      from: "start",
      ease: "power1.inOut"
    },
    ease: "back.out(1.7)"
  });
}

// ==========================================
// SLIDE 7: TYPES OF BRANDING - FIXED
// ==========================================
function animateSlide7() {
  const slide = document.querySelector("[id*='TYPES OF BRANDING']");
  if (!slide) {
    console.warn("TYPES OF BRANDING slide not found");
    return;
  }


  // Right content - description
  const rightContent = slide.querySelectorAll(".w-\\[50vw\\]:last-child p");
  if (rightContent.length > 0) {
    gsap.from(rightContent, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.12,
      ease: "power2.out"
    });
  }

  // Right content - description
  const rightContent1 = slide.querySelectorAll(".w-\\[50vw\\]:last-child h1");
  if (rightContent1.length > 0) {
    gsap.from(rightContent1, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: 0.5,
      stagger: 0.12,
      ease: "power2.out"
    });
  }
}
// ==========================================
// SLIDE 8: SCREEN PRINTING
// ==========================================
function animateSlide8() {
  const slide = document.querySelector("[id*='SCREEN PRINTING']");
  if (!slide) return;

  // Heading
  gsap.from(slide.querySelector("h2"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  });

  // Description
  const descriptions = slide.querySelectorAll("p");
  if (descriptions.length > 0) {
    gsap.from(descriptions[0], {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out"
    });
  }

  // Left icons
  gsap.from(slide.querySelectorAll(".flex.flex-col.gap-\\[1vw\\] .flex"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    x: -50,
    duration: 0.6,
    delay: 0.3,
    stagger: 0.1,
    ease: "power2.out"
  });

  // ================================
  //  LEFT IMAGE ANIMATION (ROLL IN)
  // ================================
  gsap.from(
    slide.querySelector("img[alt='pros']"),
    {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      x: -150,      // move from left
      rotation: -120, // rolling effect
      duration: 1.2,
      ease: "back.out(1.5)"
    }
  );

  // ================================
  //  RIGHT IMAGE ANIMATION (ROLL IN)
  // ================================
  gsap.from(
    slide.querySelector("img[alt='pros']:not(:first-child)"),
    {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      x: 150,       // move from right
      rotation: 120, // rolling effect
      duration: 1.2,
      delay: 0.2,
      ease: "back.out(1.5)"
    }
  );
}

// ==========================================
// SLIDE 9: CERTIFICATIONS - FIXED HOVER
// ==========================================
function animateSlide9() {
  const slide = document.querySelector("[id*='CERTIFICATIONS']");
  if (!slide) return;

  const certificates = slide.querySelectorAll("img[alt*='certificate']");
  const womenImage = slide.querySelector("img[alt='women']");
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    }
  });

  // 1. Heading animation
  tl.from(slide.querySelector("h2"), {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  }, 0);

  // 2. Certificates entrance animation
  tl.from(certificates, {
    opacity: 0,
    y: 80,
    rotationX: -45,
    duration: 0.8,
    stagger: 0.25,
    ease: "back.out(1.5)"
  }, 0.5); // Starts after header

  // 3. Women image entrance animation
  tl.from(womenImage, {
    opacity: 0,
    x: -100,
    duration: 1,
    ease: "back.out(1.7)"
  }, 0.4); // Starts slightly earlier than certificates for visual depth

  // 4. Attach GSAP Hover Effects to Certificates
  certificates.forEach(cert => {
    // Ensure initial CSS classes are removed to prevent conflict
    cert.classList.remove('transition-transform', 'duration-500', 'ease-out', 'hover:scale-110');
    cert.classList.add('cursor-pointer');

    cert.addEventListener('mouseenter', () => {
      gsap.to(cert, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    cert.addEventListener('mouseleave', () => {
      gsap.to(cert, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
  });
}

// ==========================================
// SLIDE 10: SALES PROCESS
// ==========================================
function animateSlide10() {
  const slide = document.querySelector("[id='SALES PROCESS']");
  if (!slide) return;

  // ============================
  // 1️⃣ Heading animation
  // ============================
  gsap.from(slide.querySelector("h2"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 85%",
      end: "bottom 15%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  });

  // ============================
  // 2️⃣ Floating top icons
  // ============================
  // gsap.to(slide.querySelectorAll(".flex.flex-col.items-center img:first-child"), {
  //   scrollTrigger: {
  //     trigger: slide,
  //     scroller: ANIMATION_CONFIG.scroller,
  //     start: "top 90%",
  //     end: "bottom 10%",
  //     toggleActions: "play reverse play reverse"
  //   },
  //   y: -15,
  //   duration: 1.5,
  //   repeat: -1,
  //   yoyo: true,
  //   ease: "easeInOut"
  // });

  // ============================
  // 3️⃣ Step images: Slide-in (Left → Right)
  // ============================
  gsap.from(slide.querySelectorAll(".flex.flex-col.items-center img:nth-child(2)"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    x: -120,
    rotation: -10,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2
  });

  // ============================
  // 4️⃣ Text reveal after step image
  // ============================
  gsap.from(slide.querySelectorAll(".flex.flex-col.items-center p"), {
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    delay: 0.2,
    ease: "power2.out",
    stagger: 0.2
  });
}


function animateSlide11() {
  const slide = document.querySelector("[id*='IML PROCESS']");
  if (!slide) return;

  const title = slide.querySelector(".flex.flex-col.justify-center h2");
  const subtitle = slide.querySelector(".flex.flex-col.justify-center p");
  const stepCircles = slide.querySelectorAll(".step-image-wrapper img");
  const timelineDots = slide.querySelectorAll(".flex.items-center.bg-\\[white\\].justify-center");
  const timelineLine = slide.querySelector(".w-\\[\\.1vw\\].h-\\[100vw\\]");
  const descriptions = slide.querySelectorAll(".font-medium.flex.flex-col p");
  const leadTime = slide.querySelector(".lead-time-11");

  // ==========================================
  // ENTRANCE ANIMATION
  // ==========================================
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      toggleActions: "play reverse play reverse"
    }
  });

  entranceTl
    // Title
    .fromTo(title,
      { opacity: 0, scale: 0.5, y: -30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
      0
    )
    
    // Subtitle
    .fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.3
    )
    
    // Timeline line
    .fromTo(timelineLine,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.5, ease: "power2.inOut" },
      0.5
    )
    
    // Step circles (with rotation)
    .fromTo(stepCircles,
      { scale: 0, opacity: 0, rotation: -180 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "back.out(1.7)"
      },
      0.7
    )
    
    // Dots
    .fromTo(timelineDots,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.2,
        ease: "back.out(2)"
      },
      1.0
    )
    
    // Descriptions
    .fromTo(descriptions,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out"
      },
      1.2
    )
    
    // Lead time
    .fromTo(leadTime,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.5)" },
      1.8
    );

  // ==========================================
  // INFINITE BOUNCE WAVE LOOP
  // ==========================================
  const loopTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 3, // 1 second pause between cycles
    paused: true
  });

  // Bounce wave effect
  loopTl.to(stepCircles, {
    y: -15,
    scale: 1.1,
    duration: 0.4,
    stagger: {
      each: 0.2,
      ease: "power1.out"
    },
    ease: "power2.out"
  })
  
  .to(stepCircles, {
    y: 0,
    scale: 1,
    duration: 0.3,
    stagger: {
      each: 0.2,
      ease: "power1.in"
    },
    ease: "bounce.out"
  }, 0.4);

  // Sync dots with circles
  loopTl.to(timelineDots, {
    scale: 1.3,
    duration: 0.4,
    stagger: {
      each: 0.2
    },
    ease: "power2.out"
  }, 0)
  
  .to(timelineDots, {
    scale: 1,
    duration: 0.3,
    stagger: {
      each: 0.2
    },
    ease: "power2.in"
  }, 0.4);

  // Control loop
  ScrollTrigger.create({
    trigger: slide,
    scroller: ANIMATION_CONFIG.scroller,
    start: "top 70%",
    end: "bottom 30%",
    onEnter: () => loopTl.play(),
    onLeave: () => loopTl.pause(),
    onEnterBack: () => loopTl.play(),
    onLeaveBack: () => loopTl.pause()
  });
}


// ==========================================
// SLIDE 12: SCREEN PRINTING PROCESS - SMOOTH BOUNCE WAVE
// ==========================================
function animateSlide12() {
  const slide = document.querySelector("[id*='SCREEN PRINTING PROCESS']");
  if (!slide) return;

  const title = slide.querySelector(".flex.flex-col.justify-center h2");
  const subtitle = slide.querySelector(".flex.flex-col.justify-center p");
  const stepImages = slide.querySelectorAll("img[alt*='step']");
  const timelineDots = slide.querySelectorAll(".flex.items-center.bg-\\[white\\].justify-center");
  const timelineLine = slide.querySelector(".w-\\[\\.1vw\\].h-\\[100vw\\]");
  const descriptions = slide.querySelectorAll(".font-medium p, .font-medium ol li");
  const leadTimeTitle = slide.querySelector(".lead-time-12-1");
  const leadTimeIcon = slide.querySelector(".lead-time-12-3");
  const leadTimeContent = slide.querySelector(".lead-time-12-2");

  // ==========================================
  // ENTRANCE ANIMATION
  // ==========================================
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: slide,
      scroller: ANIMATION_CONFIG.scroller,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse"
    }
  });

  entranceTl
    // Title
    .fromTo(title,
      { opacity: 0, scale: 0.5, y: -30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
      0
    )
    
    // Subtitle (if exists)
    .fromTo(subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.3
    )
    
    // Timeline line draws down
    .fromTo(timelineLine,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.5, ease: "power2.inOut" },
      0.5
    )
    
    // Step images appear with rotation
    .fromTo(stepImages,
      { scale: 0, opacity: 0, rotation: -180 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "back.out(1.7)"
      },
      0.7
    )
    
    // Timeline dots appear
    .fromTo(timelineDots,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.2,
        ease: "back.out(2)"
      },
      1.0
    )
    
    // Descriptions slide in
    .fromTo(descriptions,
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      },
      1.2
    )
    
    // Lead time title
    .fromTo(leadTimeTitle,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      1.6
    )
    
    // Lead time icon
    .fromTo(leadTimeIcon,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      1.7
    )
    
    // Lead time content
    .fromTo(leadTimeContent,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      1.8
    );

  // ==========================================
  // INFINITE BOUNCE WAVE LOOP
  // ==========================================
  const loopTl = gsap.timeline({
    repeat: -1,
    repeatDelay: 3, // 1 second pause between cycles
    paused: true
  });

  // Bounce wave effect - step images
  loopTl.to(stepImages, {
    y: -15,
    scale: 1.1,
    duration: 0.4,
    stagger: {
      each: 0.2,
      ease: "power1.out"
    },
    ease: "power2.out"
  })
  
  .to(stepImages, {
    y: 0,
    scale: 1,
    duration: 0.3,
    stagger: {
      each: 0.2,
      ease: "power1.in"
    },
    ease: "bounce.out"
  }, 0.4);

  // Sync dots with step images
  loopTl.to(timelineDots, {
    scale: 1.3,
    duration: 0.4,
    stagger: {
      each: 0.2
    },
    ease: "power2.out"
  }, 0)
  
  .to(timelineDots, {
    scale: 1,
    duration: 0.3,
    stagger: {
      each: 0.2
    },
    ease: "power2.in"
  }, 0.4);

  // Control loop play/pause based on scroll position
  ScrollTrigger.create({
    trigger: slide,
    scroller: ANIMATION_CONFIG.scroller,
    start: "top 70%",
    end: "bottom 30%",
    onEnter: () => loopTl.play(),
    onLeave: () => loopTl.pause(),
    onEnterBack: () => loopTl.play(),
    onLeaveBack: () => loopTl.pause()
  });
}


// ==========================================
// SLIDE 13: QUESTION / FORM
// ==========================================
function animateSlide13() {
  const slide = document.querySelector("#Question");
  if (!slide) {
    console.warn("Question slide (#Question) not found");
    return;
  }

  // 1) Decorative top line
  const topLine = slide.querySelector(".float-swing .w-\\[\\.1vw\\]");
  if (topLine) {
    gsap.from(topLine, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: -40,
      duration: 0.8,
      ease: "power3.out"
    });
  }

  // 2) Title image (“let’s go for the final session”)
  const titleImg = slide.querySelector("img[alt='lets-go-for-the-final-session']");
  if (titleImg) {
    gsap.from(titleImg, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: -60,
      scale: 0.9,
      duration: 0.9,
      delay: 0.1,
      ease: "back.out(1.6)"
    });
  }

  // 3) Form box (heading + fields + button)
  const formBox = slide.querySelector("#formBox");
  if (formBox) {
    gsap.from(formBox, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 80,
      duration: 1,
      delay: 0.2,
      ease: "power3.out"
    });
  }

  // 4) Individual form fields + button stagger
  const formElements = slide.querySelectorAll(
    "#formBox label, #formBox input, #formBox button"
  );
  if (formElements.length) {
    gsap.from(formElements, {
      scrollTrigger: {
        trigger: slide,
        scroller: ANIMATION_CONFIG.scroller,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 25,
      duration: 0.5,
      delay: 0.3,
      stagger: 0.08,
      ease: "power2.out"
    });
  }
}

// ==========================================
// INITIALIZE ALL ANIMATIONS
// ==========================================
function initializeAllAnimations() {
  // Wait for GSAP and ScrollTrigger to be ready
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('⏳ GSAP or ScrollTrigger not loaded. Retrying...');
    setTimeout(initializeAllAnimations, 500);
    return;
  }

  console.log('🎬 Initializing TTP Presentation Animations...');

  try {
    animateSlide1();
    console.log('✅ Slide 1 animated');
    
    animateSlide2();
    console.log('✅ Slide 2 animated');
    
    animateSlide3();
    console.log('✅ Slide 3 animated');
    
    animateSlide4();
    console.log('✅ Slide 4 animated');
    
    animateSlide5();
    console.log('✅ Slide 5 animated');
    
    animateSlide6();
    console.log('✅ Slide 6 animated');
    
    animateSlide7();
    console.log('✅ Slide 7 (TYPES OF BRANDING) animated');
    
    animateSlide8();
    console.log('✅ Slide 8 animated');
    
    animateSlide9();
    console.log('✅ Slide 9 animated');
    
    animateSlide10();
    console.log('✅ Slide 10 animated');
    
    animateSlide11();
    console.log('✅ Slide 11 animated');
    
    animateSlide12();
    console.log('✅ Slide 12 animated');

    animateSlide13();
console.log('✅ Slide 13 animated');

    console.log('✅ All animations initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing animations:', error);
  }
}

// ==========================================
// AUTO-START ON DOM READY
// ==========================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAllAnimations);
} else {
  initializeAllAnimations();
}






// ==========================================
// SLIDE 13: QUESTION / FORM - ON ACTIVATE
// ==========================================
function revealQuestionSlide() {
  const slide = document.getElementById("Question");
  if (!slide) return;

  const titleImg = slide.querySelector("img[alt='lets-go-for-the-final-session']");
  const formBox  = slide.querySelector("#formBox");

  // Optional: prevent re-running if already revealed
  if (slide.dataset.revealed === "true") return;
  slide.dataset.revealed = "true";

  const tl = gsap.timeline();

  // Whole slide fade-in (if it's hidden before)
  tl.from(slide, {
    opacity: 0,
    duration: 0.4,
    ease: "power1.out"
  });

  // Title image
  if (titleImg) {
    tl.from(titleImg, {
      y: -40,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.1");
  }

  // Form container
  if (formBox) {
    tl.from(formBox, {
      y: 50,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.2");

    // Labels, inputs and button stagger
    const fields = formBox.querySelectorAll("label, input, button");
    if (fields.length) {
      tl.from(fields, {
        y: 20,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out"
      }, "-=0.3");
    }
  }
}
