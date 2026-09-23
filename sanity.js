// ==========================================
// Sanity CMS Dynamic Portfolio Fetching
// ==========================================
const SANITY_PROJECT_ID = 'xn2562m4'; // আপনার Project ID
console.log("Sanity script is connected!");
const SANITY_DATASET = 'production';
// GROQ Query: পোর্টফোলিওর সব ডেটা লেটেস্ট থেকে ওল্ড সিরিয়ালে আনবে
const SANITY_QUERY = encodeURIComponent('*[_type == "portfolio"] | order(_createdAt desc) {title, clientName, serviceType, category, mediaType, mediaUrl, "imageUrl": thumbnail.asset->url}');
const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${SANITY_DATASET}?query=${SANITY_QUERY}`;

async function loadPortfolioFromSanity() {
    const videoGrid = document.getElementById('video-grid');
    const motionGrid = document.getElementById('motion-grid');
    const graphicGrid = document.getElementById('graphic-grid');

    // যদি আমরা পোর্টফোলিও পেজে না থাকি, তাহলে কোড এখানেই থেমে যাবে
    if (!videoGrid && !motionGrid && !graphicGrid) return;

    try {
        const response = await fetch(SANITY_API_URL);
        const { result } = await response.json();
        console.log("Sanity Data:", result);
        
        // Sanity থেকে ডেটা আসলে এইচটিএমএল-এ থাকা ডেমো কার্ডগুলো মুছে ফেলবো
        if(result.length > 0) {
            if(videoGrid) videoGrid.innerHTML = '';
            if(motionGrid) motionGrid.innerHTML = '';
            if(graphicGrid) graphicGrid.innerHTML = '';
        }

        // Sanity-র প্রতিটি ডেটা দিয়ে নতুন কার্ড বানানো
        result.forEach(project => {
            let cardClass = "video-card";
            if(project.serviceType === 'motion-graphics') cardClass = "motion-card";
            if(project.serviceType === 'graphic-design') cardClass = "graphic-card";

            // Sanity-র প্রতিটি ডেটা দিয়ে নতুন কার্ড বানানো
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

            // ম্যাপ থেকে সঠিক নামটা নিবে, না থাকলে ডিফল্ট নাম নিবে
            const categoryName = categoryFormatMap[project.category] || project.category;

            const cardHTML = `
                <a class="project-card ${cardClass}" href="#" data-category="${project.category}" data-media-type="${project.mediaType}" data-media-url="${project.mediaUrl || project.imageUrl}">
                    <img src="${project.imageUrl}" alt="${project.title}">
                    <div class="project-info">
                        ${project.clientName ? `<h6>${project.clientName}</h6>` : ''}
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${categoryName}</span>
                    </div>
                </a>
            `;

            // সঠিক গ্রিডে কার্ডগুলো বসিয়ে দেওয়া
            if (project.serviceType === 'video-editing' && videoGrid) videoGrid.innerHTML += cardHTML;
            if (project.serviceType === 'motion-graphics' && motionGrid) motionGrid.innerHTML += cardHTML;
            if (project.serviceType === 'graphic-design' && graphicGrid) graphicGrid.innerHTML += cardHTML;
        });

            const cardHTML = `
                <a class="project-card ${cardClass}" href="#" data-category="${project.category}" data-media-type="${project.mediaType}" data-media-url="${project.mediaUrl || project.imageUrl}">
                    <img src="${project.imageUrl}" alt="${project.title}">
                    <div class="project-info">
                        ${project.clientName ? `<h6>${project.clientName}</h6>` : ''}
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${categoryName}</span>
                    </div>
                </a>
            `;

            // সঠিক গ্রিডে কার্ডগুলো বসিয়ে দেওয়া
            if (project.serviceType === 'video-editing' && videoGrid) videoGrid.innerHTML += cardHTML;
            if (project.serviceType === 'motion-graphics' && motionGrid) motionGrid.innerHTML += cardHTML;
            if (project.serviceType === 'graphic-design' && graphicGrid) graphicGrid.innerHTML += cardHTML;
        });
        
        // নতুন কার্ডগুলোর জন্য Lightbox পপআপ অ্যাক্টিভ করা
        attachDynamicLightbox();
        
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

    // ১. লাইটবক্স ওপেন করার কোড
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
    // ==========================================
    // Dynamic Filter Logic (Sanity Cards er jonno)
    // ==========================================
    function applyDynamicFilters(tabSelector, gridSelector) {
        const tabs = document.querySelectorAll(tabSelector);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // 1. Onno shob tab theke active class remove kore click kora tab e active kora
                tabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');

                // 2. Filter value ber kora (jemon: 'ecommerce', 'commercials')
                const filterValue = e.currentTarget.getAttribute('data-filter');

                // 3. Live website theke notun card gulo khuje ber kora
                const cards = document.querySelectorAll(gridSelector);

                // 4. Card er category r sathe filter match kora
                cards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        
                        // Apnar script.js er floating animation trick
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

    // 3 ta section er filter button gulo active kora
    applyDynamicFilters('#video-tabs .tab-btn', '#video-grid .project-card');
    applyDynamicFilters('#motion-tabs .tab-btn', '#motion-grid .project-card');
    applyDynamicFilters('#graphic-tabs .tab-btn', '#graphic-grid .project-card');

    // ২. ফিল্টার বাটন কাজ করার জন্য ডাইনামিক লজিক
    const filterButtons = document.querySelectorAll('.filter-btn, .category-btn, .video-editing-section button, .section button'); // আপনার সাইটের ফিল্টার বাটনের ক্লাস অনুযায়ী
    
    // বিকল্প হিসেবে যদি আপনার ফিল্টার বাটনগুলোর কোনো নির্দিষ্ট class থাকে, সেটি ব্যবহার করতে পারেন। 
    // যেমন সাধারণত বাটনে ক্লিক করলে যেন কার্ডগুলো শো/হাইড্র হয়:
    const allFilterBtns = document.querySelectorAll('button[data-filter]'); // অথবা আপনার বাটনের সিলেক্টর
    
    // নিচে আমরা জাস্ট জেনেরিক ফিল্টার বাটন হ্যান্ডলার জুড়ে দিচ্ছি:
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            allDynamicCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// পেজ লোড হওয়ার সাথে সাথে Sanity থেকে ডেটা আনবে
document.addEventListener('DOMContentLoaded', loadPortfolioFromSanity);