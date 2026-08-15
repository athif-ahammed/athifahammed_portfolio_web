// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('main-nav');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    if (mainNav.classList.contains('open')) {
      mainNav.style.display = 'flex';
      mainNav.style.flexDirection = 'column';
      mainNav.style.position = 'absolute';
      mainNav.style.top = '84px';
      mainNav.style.left = '0';
      mainNav.style.right = '0';
      mainNav.style.background = '#f0f6f6';
      mainNav.style.padding = '20px 24px';
      mainNav.style.borderBottom = '1px solid rgba(2,25,26,.1)';
      mainNav.style.gap = '6px';
    } else {
      mainNav.style.display = 'none';
    }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Animated count-up for stat numbers (30+, 65+, 70+ etc.)
const countEls = document.querySelectorAll('.stat-num[data-count]');
const countIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + '+';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countIo.unobserve(el);
  });
}, { threshold: 0.4 });
countEls.forEach(el => countIo.observe(el));

// Auto-flip individual Featured Projects every 10 seconds with a wave effect
const flippers = document.querySelectorAll('.project-flip-inner');
if (flippers.length > 0) {
  setInterval(() => {
    flippers.forEach((flipper, index) => {
      setTimeout(() => {
        flipper.classList.toggle('is-flipped');
      }, index * 200); // 200ms delay between each card's flip
    });
  }, 5000); // 10000 ms = 10 seconds
}

// ==========================================
// Portfolio Tab Filtering Logic
// ==========================================
const videoTabs = document.querySelectorAll('#video-tabs .tab-btn');
const videoCards = document.querySelectorAll('#video-grid .video-card');

if (videoTabs.length > 0) {
  videoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Remove active class from all tabs
      videoTabs.forEach(t => t.classList.remove('active'));
      
      // 2. Add active class to the clicked tab
      tab.classList.add('active');

      // 3. Get the filter value
      const filterValue = tab.getAttribute('data-filter');

      // 4. Show or hide cards based on category
      videoCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block'; // Show card
          
          // Small trick to restart the floating animation
          card.style.animation = 'none';
          card.offsetHeight; 
          card.style.animation = null; 
        } else {
          card.style.display = 'none'; // Hide card
        }
      });
    });
  });
}

// ==========================================
// Portfolio Advanced Lightbox Modal Logic
// ==========================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxIframe = document.getElementById('lightboxIframe');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const allProjectCards = document.querySelectorAll('.project-card');

if (lightboxModal) {
  allProjectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const titleElement = card.querySelector('.project-title');
      const thumbnailImg = card.querySelector('img');
      
      // Get custom media data
      const mediaType = card.getAttribute('data-media-type') || 'image'; 
      const mediaUrl = card.getAttribute('data-media-url') || (thumbnailImg ? thumbnailImg.src : '');

      // Reset & Hide all media elements first
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'none';
      lightboxIframe.style.display = 'none';
      lightboxVideo.pause();
      lightboxVideo.src = ''; 
      lightboxIframe.src = '';
      
      // Show appropriate media based on type
      if (mediaType === 'video') {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = mediaUrl;
        lightboxVideo.play(); 
      } else if (mediaType === 'iframe') {
        lightboxIframe.style.display = 'block';
        lightboxIframe.src = mediaUrl;
      } else if (mediaType === 'pdf') {
        lightboxIframe.style.display = 'block';
        lightboxIframe.src = mediaUrl + "#toolbar=0&navpanes=0";
      } else {
        lightboxImg.style.display = 'block';
        lightboxImg.src = mediaUrl;
      }

      lightboxCaption.textContent = titleElement ? titleElement.textContent : '';
      lightboxModal.classList.add('is-active');
    });
  });

  // Modal close function (Stops video audio from playing in background)
  const closeModal = () => {
    lightboxModal.classList.remove('is-active');
    setTimeout(() => {
      lightboxVideo.pause();
      lightboxVideo.src = '';
      lightboxIframe.src = '';
    }, 300); // Wait for fade out animation before resetting src
  };

  lightboxClose.addEventListener('click', closeModal);
  
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('is-active')) closeModal();
  });
}

// ==========================================
// Motion Graphics Tab Filtering Logic
// ==========================================
const motionTabs = document.querySelectorAll('#motion-tabs .tab-btn');
const motionCards = document.querySelectorAll('#motion-grid .motion-card');

if (motionTabs.length > 0) {
  motionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all motion tabs
      motionTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Show/Hide cards
      motionCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block'; 
          
          // Restart floating animation
          card.style.animation = 'none';
          card.offsetHeight; 
          card.style.animation = null; 
        } else {
          card.style.display = 'none'; 
        }
      });
    });
  });
}

// ==========================================
// Graphic Design Tab Filtering Logic
// ==========================================
const graphicTabs = document.querySelectorAll('#graphic-tabs .tab-btn');
const graphicCards = document.querySelectorAll('#graphic-grid .graphic-card');

if (graphicTabs.length > 0) {
  graphicTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all graphic tabs
      graphicTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      // Show/Hide cards
      graphicCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block'; 
          
          // Restart floating animation
          card.style.animation = 'none';
          card.offsetHeight; 
          card.style.animation = null; 
        } else {
          card.style.display = 'none'; 
        }
      });
    });
  });
}

// ==========================================
// Newsletter Functionality (Live Email Setup)
// ==========================================
const newsletterForm = document.querySelector('.newsletter-form');
const emailInput = document.querySelector('.newsletter-form input[type="email"]');
const submitBtn = document.querySelector('.newsletter-form button[type="submit"]');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const emailValue = emailInput.value.trim();
    
    // Strict Regex: Fake ba bhul email block korbe
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(emailValue)) {
      alert("Please enter a valid email address."); 
      return;
    }
    
    // Button state loading e nibe
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "..."; 
    submitBtn.disabled = true;

    // Direct apnar email e data pathabe
    fetch("https://formsubmit.co/ajax/athif5659@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          _subject: "New Newsletter Subscriber!",
          email: emailValue
      })
    })
    .then(response => response.json())
    .then(data => {
      // Success mark dekhabe
      submitBtn.innerHTML = "✓"; 
      emailInput.value = ""; 
      
      // 3 second por ager obosthay ferot jabe
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 3000);
    })
    .catch(error => {
      alert("Something went wrong. Please try again.");
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  });
}

// ==========================================
// About Page Intro Video Auto-Play & Button
// ==========================================
const introVideo = document.getElementById('aboutIntroVideo');
const introPlayBtn = document.getElementById('introPlayBtn');
const videoWrapper = document.querySelector('.intro-video-wrapper');

if (introVideo && introPlayBtn) {
  const togglePlay = (e) => {
    e.preventDefault();
    if (introVideo.paused) {
      introVideo.play();
      introVideo.setAttribute('controls', 'controls'); // Play hole controls chole ashbe
      videoWrapper.classList.add('is-playing');
    } else {
      introVideo.pause();
      introVideo.removeAttribute('controls'); // Pause thakle controls hove jabe
      videoWrapper.classList.remove('is-playing');
    }
  };

  // Ekhon video wrapper-er je kono jaygay click korlei kaj korbe
  videoWrapper.addEventListener('click', togglePlay);

  // Auto pause on scroll (No auto resume)
  const videoIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        if (!introVideo.paused) {
          introVideo.pause();
          introVideo.removeAttribute('controls');
          videoWrapper.classList.remove('is-playing');
        }
      }
    });
  }, { threshold: 0.3 }); 

  videoIo.observe(introVideo);
}
// Auto-select Form values based on URL parameters (e.g., ?service=Video Editing&package=Standard)
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const packageParam = urlParams.get('package');

  if (serviceParam) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) serviceSelect.value = serviceParam;
  }
  
  if (packageParam) {
    const packageSelect = document.getElementById('package');
    if (packageSelect) packageSelect.value = packageParam;
  }
});

document.addEventListener('DOMContentLoaded', function() {
  
  // ১. URL থেকে অটোমেটিক সার্ভিস সিলেক্ট এবং কালার হাইলাইট লজিক
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const packageParam = urlParams.get('package');

  const serviceSelect = document.getElementById('service');
  const packageSelect = document.getElementById('package');

  // Service Select Logic
  if (serviceSelect && serviceParam) {
    serviceSelect.value = serviceParam;
    serviceSelect.classList.add('highlight-select'); // Green color add
    
    // User change korle green color remove hobe
    serviceSelect.addEventListener('change', function() {
      this.classList.remove('highlight-select');
    });
  }
  
  // Package Select Logic
  if (packageSelect && packageParam) {
    packageSelect.value = packageParam;
    packageSelect.classList.add('highlight-select'); // Green color add
    
    // User change korle green color remove hobe
    packageSelect.addEventListener('change', function() {
      this.classList.remove('highlight-select');
    });
  }
  // ২. Form Submit & Progress Bar Redirect
  const projectForm = document.getElementById('projectForm');
  const successModal = document.getElementById('successModal');

  if (projectForm && successModal) {
    const submitBtn = projectForm.querySelector('button[type="submit"]');
    
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // সাবমিট বাটন লোডিং স্টেট
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';
      submitBtn.disabled = true;

      const formData = new FormData(projectForm);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.status === 200) {
          // পপআপ শো করানো (সিএসএস অ্যানিমেশন নিজে থেকেই গ্রিন বার কমানো শুরু করবে)
          successModal.classList.add('active');
          projectForm.reset();

          // ঠিক ১০ সেকেন্ড পর হোম পেজে রিডাইরেক্ট
          setTimeout(() => {
            window.location.href = './';
          }, 5000);

        } else {
          alert("Something went wrong! Please try again.");
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      })
      .catch(error => {
        console.error(error);
        alert("Connection error! Please check your internet.");
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
    });
  }
});
// ==========================================
// FAQ Accordion Logic
// ==========================================
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      // (Optional) Onno gula auto close korar jonno:
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      // Click kora item ta open/close kora:
      item.classList.toggle('active');
    });
  });
}// ==========================================
// FAQ Contact Popup & Submission Logic
// ==========================================
const contactModal = document.getElementById('contactModal');
const openContactBtn = document.getElementById('openContactBtn');
const closeContactBtn = document.getElementById('closeContactBtn');
const contactForm = document.getElementById('contactForm');
const contactSuccessMsg = document.getElementById('contactSuccessMsg');

if (contactModal && openContactBtn) {
  // Open Modal
  openContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.classList.add('active');
    contactSuccessMsg.style.display = 'none'; // Hide success message if it was open before
    contactForm.style.display = 'block'; // Show form
  });

  // Close Modal Function
  const closeContact = () => {
    contactModal.classList.remove('active');
  };

  // Close on X button click
  closeContactBtn.addEventListener('click', closeContact);
  
  // Close on outside click
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeContact();
    }
  });

  // Form Submit to Web3Forms
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Loading State
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.status === 200) {
        // Hide form and show success message smoothly
        contactForm.style.display = 'none';
        contactSuccessMsg.style.display = 'block';
        contactForm.reset();
        
        // Auto close modal after 4 seconds
        setTimeout(() => {
          closeContact();
        }, 4000);
      } else {
        alert("Something went wrong! Please try again.");
      }
    })
    .catch(error => {
      alert("Connection error! Please check your internet.");
    })
    .finally(() => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
  });
}