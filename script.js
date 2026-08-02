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
      lightboxIframe.src = '';
      
      // Show appropriate media based on type
      if (mediaType === 'video') {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = mediaUrl;
        lightboxVideo.play(); // Auto-play video
      } else if (mediaType === 'iframe') {
        lightboxIframe.style.display = 'block';
        lightboxIframe.src = mediaUrl;
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
// Newsletter Functionality (Live Email Setup)
// ==========================================
const newsletterForm = document.querySelector('.newsletter-form');
const emailInput = document.querySelector('.newsletter-form input[type="email"]');
const submitBtn = document.querySelector('.newsletter-form button[type="submit"]');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Page reload off korbe
    
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