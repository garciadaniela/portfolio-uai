function createHeader() {
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
    const isProjectsPage = currentPage.includes('projects.html');
    const isContactPage = currentPage.includes('contact.html');

    const header = document.createElement('header');
    header.innerHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">
                    <h2>Daniela García</h2>
                </div>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <a href="${isIndexPage ? '#inicio' : 'index.html'}" class="nav-link">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a href="${isProjectsPage ? '#' : 'projects.html'}" class="nav-link">Proyectos</a>
                    </li>
                    <li class="nav-item">
                        <a href="${isIndexPage ? '#sobre-mi' : 'index.html#sobre-mi'}" class="nav-link">Sobre mí</a>
                    </li>
                    <li class="nav-item">
                        <a href="${isContactPage ? '#' : 'contact.html'}" class="nav-link">Contacto</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
    return header;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <div class="footer-content">
            <p>&copy; 2024 Hecho por Daniela García</p>
            <div class="social-links">
                <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
                <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
    `;
    return footer;
}

function initPage() {
    const header = createHeader();
    document.body.insertBefore(header, document.body.firstChild);

    const footer = createFooter();
    document.body.appendChild(footer);

    addSmoothScrolling();
}

function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.includes('.html') || href.startsWith('http')) {
                return;
            }

            if (href.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initPage);