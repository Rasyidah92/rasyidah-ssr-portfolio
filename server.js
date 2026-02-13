const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== COMPRESSION (GZIP) - KECILKAN SAZE ==========
app.use(compression());

// ========== SERVE STATIC FILES ==========
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/css', express.static(path.join(__dirname, 'src/public/css')));
app.use('/js', express.static(path.join(__dirname, 'src/public/js')));

// ========== HELPER FUNCTION: GENERATE HTML ==========
async function generateHTML() {
    try {
        // 1. Baca template
        let template = await fs.readFile(path.join(__dirname, 'src/templates/portfolio.html'), 'utf8');
        
        // 2. Baca data services.json
        const data = JSON.parse(await fs.readFile(path.join(__dirname, 'src/data/services.json'), 'utf8'));
        
        // 3. Generate Work Experience HTML
        let workHTML = '';
        data.workExperience.forEach(job => {
            workHTML += `
                <div class="work-content">
                    <div class="timeline-date"><i class="bx bxs-calendar"></i> <strong>${job.period}</strong></div>
                    <div class="timeline-content">
                        <h3>${job.role}</h3>
                        <p><strong>${job.company}</strong></p>
                    </div>
                </div>
            `;
        });
        template = template.replace('{{WORK_EXPERIENCE}}', workHTML);
        
        // 4. Generate Education HTML
        let eduHTML = '';
        data.education.forEach(edu => {
            eduHTML += `
                <div class="workeduc-content">
                    <span class="timeline-date"><i class="bx bxs-graduation"></i> <strong>${edu.period}</strong></span>
                    <div class="timeline-content">
                        <h3>${edu.degree}</h3>
                        <p><strong>${edu.institution}</strong></p>
                        ${edu.thesis ? `<p class="thesis">${edu.thesis}</p>` : ''}
                    </div>
                </div>
            `;
        });
        template = template.replace('{{EDUCATION}}', eduHTML);
        
        // 5. Generate ALL SERVICES (21 items)
        let servicesHTML = '';
        data.categories.forEach(category => {
            category.services.forEach(service => {
                servicesHTML += `
                    <div class="services-content" data-category="${category.slug}" data-price="${service.price}" data-name="${service.name}">
                        <div class="service-quick-actions"></div>
                        <input type="checkbox" class="service-select-checkbox" data-service="${service.id}">
                        <div class="category-badge badge-${category.slug}">${category.name.split(' ')[0]}</div>
                        <i class="bx ${service.icon}"></i>
                        <h3>${service.name}</h3>
                        <p>${service.description.substring(0, 60)}...</p>
                        <div class="price-tag">RM ${service.price}</div>
                        <button type="button" class="btn open-${service.id}-modal">Read More</button>
                    </div>
                `;
            });
        });
        template = template.replace('{{ALL_SERVICES}}', servicesHTML);
        
        // 6. Generate Skills HTML
        let skillsHTML = `
            <div class="skills-content">
                <h3>Expert</h3>
                <div class="content">
                    ${data.skills.expert.map(skill => 
                        `<span><i class="bx ${skill.icon}"></i> <strong>${skill.name}</strong></span>`
                    ).join('')}
                </div>
            </div>
            <div class="skills-content">
                <h3>Proficient</h3>
                <div class="content">
                    ${data.skills.proficient.map(skill => 
                        `<span><i class="bx ${skill.icon}"></i> <strong>${skill.name}</strong></span>`
                    ).join('')}
                </div>
            </div>
            <div class="skills-content">
                <h3>Basic</h3>
                <div class="content">
                    ${data.skills.basic.map(skill => 
                        `<span><i class="bx ${skill.icon}"></i> <strong>${skill.name}</strong></span>`
                    ).join('')}
                </div>
            </div>
        `;
        template = template.replace('{{SKILLS}}', skillsHTML);
        
        // 7. Generate Projects HTML
        let projectsHTML = '';
        data.projects.forEach(project => {
            projectsHTML += `
                <div class="project-card">
                    <div class="project-img-box">
                        <img src="/images/${project.image}" loading="lazy" alt="${project.title}">
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p><strong>${project.description}</strong></p>
                        <div class="tech-stack">
                            ${project.techStack.map(tech => 
                                `<span class="tech-tag"><i class="bx bxs-file-js"></i> ${tech}</span>`
                            ).join('')}
                        </div>
                        <div class="project-buttons">
                            <a href="${project.liveLink}" class="btn" target="_blank"><i class="bx bx-globe"></i> View Live</a>
                            <button type="button" class="btn secondary-btn view-project-details" data-project="${project.title.toLowerCase().includes('pwa') ? 'pwa-case-study' : 'portfolio-book'}"><i class="bx bx-info-circle"></i> Details</button>
                        </div>
                    </div>
                </div>
            `;
        });
        template = template.replace('{{PROJECTS}}', projectsHTML);
        
        // 8. Replace WhatsApp number
        template = template.replace(/{{WHATSAPP_NUMBER}}/g, data.contact.whatsapp);
        
        return template;
        
    } catch (error) {
        console.error('Error generating HTML:', error);
        return '<h1>Error loading portfolio</h1>';
    }
}

// ========== MAIN ROUTE ==========
app.get('/', async (req, res) => {
    const html = await generateHTML();
    res.send(html);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`🚀 SSR Portfolio running at http://localhost:${PORT}`);
});