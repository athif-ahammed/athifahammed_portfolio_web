console.log("Pricing script initialized...");

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded, fetching pricing from Sanity...");
    
    const PRICING_PROJECT_ID = 'xn2562m4'; 
    const PRICING_DATASET = 'production';
    const PRICING_QUERY = encodeURIComponent('*[_type == "pricing"] | order(order asc)');
    const PRICING_API = `https://${PRICING_PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${PRICING_DATASET}?query=${PRICING_QUERY}`;
    
    const wrapper = document.getElementById('dynamic-pricing-wrapper');
    
    if (!wrapper) return;

    try {
        const response = await fetch(PRICING_API);
        const { result } = await response.json();
        
        if (result && result.length > 0) {
            const groupedPlans = result.reduce((acc, plan) => {
                if (!acc[plan.serviceName]) acc[plan.serviceName] = [];
                acc[plan.serviceName].push(plan);
                return acc;
            }, {});

            let html = '';
            let sectionIndex = 0;

            for (const [serviceName, plans] of Object.entries(groupedPlans)) {
                const bgStyle = sectionIndex % 2 !== 0 ? 'style="background: rgba(255,255,255,0.01); position:relative; z-index:10;"' : 'style="position:relative; z-index:10;"';

                html += `
                <section class="section" ${bgStyle}>
                  <div class="container reveal active" style="opacity: 1; transform: none;">
                    <div class="section-header-center">
                      <h2 class="section-title small">${serviceName}</h2>
                    </div>
                    <div class="pricing-grid">
                `;

                plans.forEach(plan => {
                    // 🌟 Reverted to the stable layout, just lifted up and made BDT larger
                    let priceHTML = '';
                    if (plan.originalPriceUsd && plan.originalPriceBdt) {
                        priceHTML = `
                          <div style="display: flex; justify-content: flex-start; align-items: baseline; gap: 20px;">
                            <span class="price-usd" style="display: inline-flex; align-items: flex-start; margin: 0;">
                              $${plan.priceUsd}
                              <sup style="font-size: 0.6em; color: #a0a0a0; font-weight: 500; text-decoration: line-through; margin-left: 5px; margin-top: 4px;">$${plan.originalPriceUsd}</sup>
                            </span>
                            <span class="price-bdt" style="display: inline-flex; align-items: flex-start; margin: 0;">
                              (${plan.priceBdt} BDT)
                              <sup style="font-size: 0.75em; color: #a0a0a0; font-weight: 500; text-decoration: line-through; margin-left: 5px; margin-top: 2px; white-space: nowrap;">${plan.originalPriceBdt} BDT</sup>
                            </span>
                          </div>
                        `;
                    } else {
                        priceHTML = `
                          <div style="display: flex; justify-content: flex-start; align-items: baseline; gap: 20px;">
                            <span class="price-usd" style="margin: 0;">$${plan.priceUsd}</span>
                            <span class="price-bdt" style="margin: 0;">(${plan.priceBdt} BDT)</span>
                          </div>
                        `;
                    }

                    let featuresHTML = (plan.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('');

                    let btnClass = "btn-outline";
                    if (plan.packageStyle === 'popular') btnClass = "btn-primary";
                    if (plan.packageStyle === 'premium') btnClass = "btn-invert";

                    let badgeIconHTML = plan.badgeIconClass ? `<i class="fa-solid ${plan.badgeIconClass}"></i> ` : '';

                    html += `
                      <div class="pricing-card ${plan.packageStyle}">
                        <div class="${plan.packageStyle}-badge">${badgeIconHTML}${plan.badgeText}</div>
                        <h3 class="package-name">${plan.packageType}</h3>
                        <div class="price-box" style="display: block; margin-bottom: 20px;">
                          ${priceHTML}
                        </div>
                        <p class="package-desc">${plan.description}</p>
                        <ul class="pricing-features">
                          ${featuresHTML}
                        </ul>
                        <a href="start.html?service=${serviceName}&package=${plan.packageType}#projectForm" class="btn ${btnClass}">Get Started</a>
                      </div>
                    `;
                });

                html += `
                    </div>
                  </div>
                </section>
                `;
                sectionIndex++;
            }

            wrapper.innerHTML = html;
        } 
    } catch (error) {
        console.error("Fetch error:", error);
    }
});