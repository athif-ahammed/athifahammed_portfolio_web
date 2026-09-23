// ==========================================
// Sanity CMS Dynamic Portfolio Fetching
// ==========================================
const SANITY_PROJECT_ID = 'xn2562m4'; 
const SANITY_DATASET = 'production';

// সঠিক কোয়েরি: যা ছবি এবং অন্যান্য সব ডেটা ঠিকভাবে নিয়ে আসবে
const SANITY_QUERY = encodeURIComponent('*[_type == "portfolio"] | order(_createdAt desc) {title, clientName, serviceType, category, mediaType, mediaUrl, "imageUrl": thumbnail.asset->url}');
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${SANITY_QUERY}`;

async function loadPortfolioFromSanity() {
    const videoGrid = document.getElementById('video-grid');
    const motionGrid = document.getElementById('motion-grid');
    const graphicGrid = document.getElementById('graphic-grid');

    if (!videoGrid && !motionGrid && !graphicGrid) return;

    try {
        const response = await fetch(SANITY_API_URL);
        const { result } = await response.json();
        
        if(result && result.length > 0) {
            if(videoGrid) videoGrid.innerHTML = '';
            if(motionGrid) motionGrid.innerHTML = '';
            if(graphicGrid) graphicGrid.innerHTML = '';

            result.forEach(project => {
                let cardClass = "video-card";
                if(project.serviceType === 'motion-graphics') cardClass = "motion-card";
                if(project.serviceType === 'graphic-design') cardClass = "graphic-card";

                // ক্যাটাগরির নাম এক্স্যাক্টলি বাটনের মতো দেখানোর ম্যাপিং
                const categoryFormatMap = {
                    'commercials': 'Commercials',
                    'ecommerce': 'E-commerce Ads',
                    'logo-animation': 'Logo Animation',
                    'Motion Advertisement': 'Motion Advertisement',
                    'Animated Reel': 'Animated Reel',
                    '3D Animation': '3D Animation',
                    'Logo-Design': 'Logo Design',
                    'Menu-Card': 'Menu Card',
                    'Business-Card': 'Business Card',
                    'Social-Media-Post': 'Social Media Post',
                    'Event-Branding': 'Event Branding',
                    'Packaging': 'Packaging'
                };

                const categoryName = categoryFormatMap[project.category] || project.category;

                const cardHTML = `
                    <a class="project-card ${cardClass}" href="#" data-category="${project.category}" data-category-name="${categoryName}" data-media-type="${project.mediaType}" data-media-url="${project.mediaUrl || project.imageUrl}">
                        <img src="${project.imageUrl}" alt="${project.title}">
                        <div class="project-info">
                            ${project.clientName ? `<h6>${project.clientName}</h6>` : ''}
                            <h3 class="project-title">${project.title}</h3>
                            <span class="project-category">${categoryName}</span>
                        </div>
                    </a>
                `;

                if (project.serviceType === 'video-editing' && videoGrid) videoGrid.innerHTML += cardHTML;
                if (project.serviceType === 'motion-graphics' && motionGrid) motionGrid.innerHTML += cardHTML;
                if (project.serviceType === 'graphic-design' && graphicGrid) graphicGrid.innerHTML += cardHTML;
            });
            
            attachDynamicLightbox();
        }
    } catch (error) {
        console.error("Error loading projects from Sanity:", error);
    }
}

function attachDynamicLightbox() {
    const allDynamicCards = document.querySelectorAll('#video-grid .project-card, #motion-grid .project-card, #graphic-grid .project-card');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxIframe = document.getElementById('lightboxIframe');
    const lightboxCaption = document.getElementById('lightboxCaption');

    // ১. লাইটবক্স লজিক
    if (lightboxModal) {
        allDynamicCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault(); 
                const titleElement = card.querySelector('.project-title');
                const thumbnailImg = card.querySelector('img');
                const mediaType = card.getAttribute('data-media-type') || 'image'; 
                const mediaUrl = card.getAttribute('data-media-url') || (thumbnailImg ? thumbnailImg.src : '');

                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'none';
                lightboxIframe.style.display = 'none';
                lightboxVideo.pause();
                lightboxVideo.src = ''; 
                lightboxIframe.src = '';
                
                if (mediaType === 'video') {
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = mediaUrl;
                    lightboxVideo.play(); 
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
    }

    // ২. পারফেক্ট ফিল্টার লজিক
    function applyDynamicFilters(tabSelector, gridSelector) {
        const tabs = document.querySelectorAll(tabSelector);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');

                const filterValue = e.currentTarget.getAttribute('data-filter');
                const cards = document.querySelectorAll(gridSelector);

                cards.forEach(card => {
                    const rawCat = card.getAttribute('data-category');
                    const mappedCat = card.getAttribute('data-category-name');
                    
                    if (filterValue === 'all' || rawCat === filterValue || mappedCat === filterValue) {
                        card.style.display = 'block';
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

    applyDynamicFilters('#video-tabs .tab-btn', '#video-grid .project-card');
    applyDynamicFilters('#motion-tabs .tab-btn', '#motion-grid .project-card');
    applyDynamicFilters('#graphic-tabs .tab-btn', '#graphic-grid .project-card');
}

// পেজ লোড হওয়ার সাথে সাথে Sanity থেকে ডেটা আনবে
document.addEventListener('DOMContentLoaded', loadPortfolioFromSanity);