/* ========================================
   PORTFOLIO DANIELA GARCÍA - JAVASCRIPT
   ======================================== */

/**
 * Función para crear el header dinámicamente
 * Solo se ejecuta si no existe un header estático en la página
 * @returns {HTMLElement} Elemento header creado
 */
function createHeader() {
    // Detectar la página actual para ajustar los enlaces de navegación
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
    const isProjectsPage = currentPage.includes('projects.html');
    const isServicesPage = currentPage.includes('services.html');
    const isContactPage = currentPage.includes('contact.html');

    // Crear elemento header con navegación
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
                        <a href="${isServicesPage ? '#' : 'services.html'}" class="nav-link">Servicios</a>
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
            <p>&copy; 2025 Hecho por Daniela García</p>
            <div class="footer-links">
                <a href="terms.html" class="footer-link">Términos y Condiciones</a>
                <a href="contact.html" class="footer-link">Contacto</a>
            </div>
            <div class="social-links">
                <a href="https://www.linkedin.com/in/danielagarciajb/" class="social-link"><i class="fab fa-linkedin"></i></a>
                <a href="https://github.com/garciadaniela" class="social-link"><i class="fab fa-github"></i></a>
                <a href="https://www.instagram.com/danielagarciajb/" class="social-link"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
    `;
    return footer;
}

function initPage() {
    // Solo agregar header si no existe uno estático
    if (!document.querySelector('header')) {
        const header = createHeader();
        document.body.insertBefore(header, document.body.firstChild);
    }

    // Solo agregar footer si no existe uno estático
    if (!document.querySelector('footer')) {
        const footer = createFooter();
        document.body.appendChild(footer);
    }

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