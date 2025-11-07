/* ========================================
   PORTFOLIO DANIELA GARCÍA - JAVASCRIPT
   ======================================== */

/**
 * Función para crear el header dinámicamente
 * Solo se ejecuta si no existe un header estático en la página
 * @returns {HTMLElement} Elemento header creado
 */
function createHeader() {
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
    const isProjectsPage = currentPage.includes('projects.html');
    const isServicesPage = currentPage.includes('services.html');
    const isBlogPage = currentPage.includes('blog.html');
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
                        <a href="${isServicesPage ? '#' : 'services.html'}" class="nav-link">Servicios</a>
                    </li>
                    <li class="nav-item">
                        <a href="${isBlogPage ? '#' : 'blog.html'}" class="nav-link">Blog</a>
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
    initBlogPage();
    initContactForm();
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

function initBlogPage() {
    const blogGrid = document.getElementById('blog-posts-grid');
    const template = document.getElementById('blog-post-template');
    const adminTrigger = document.getElementById('blog-admin-trigger');
    const modal = document.getElementById('blog-admin-modal');
    const closeModalBtn = document.getElementById('blog-admin-close');
    const form = document.getElementById('blog-admin-form');
    const feedback = document.getElementById('blog-admin-feedback');
    const storageKey = 'danielaBlogPosts';

    let staticPosts = Array.isArray(window.__BLOG_POSTS__) ? window.__BLOG_POSTS__ : [];

    if (!blogGrid || !template) {
        return;
    }

    const getStoredPosts = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed;
        } catch (error) {
            console.warn('No se pudo leer el almacenamiento local del blog:', error);
            return [];
        }
    };

    const savePosts = posts => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(posts));
        } catch (error) {
            console.error('No se pudo guardar la entrada del blog:', error);
            showFeedback('No se pudo guardar la entrada. Revisá el almacenamiento del navegador.', true);
        }
    };

    const ADMIN_CLASS = 'test2025';
    const ADMIN_KEY = 'test2025';

    const isAdmin = () => document.body.classList.contains(ADMIN_CLASS);

    const setAdminState = () => {
        if (!adminTrigger) {
            return;
        }

        if (isAdmin()) {
            adminTrigger.innerHTML = '<i class="fas fa-plus"></i><span>Agregar artículo</span>';
        } else {
            adminTrigger.innerHTML = '<i class="fas fa-lock"></i><span>Modo edición</span>';
        }
    };

    const flashTriggerError = message => {
        if (!adminTrigger) return;
        adminTrigger.classList.add('is-error');
        adminTrigger.setAttribute('title', message);
        setTimeout(() => {
            adminTrigger.classList.remove('is-error');
            adminTrigger.removeAttribute('title');
        }, 2200);
    };

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const firstField = modal.querySelector('input, textarea, button');
        if (firstField) {
            firstField.focus();
        }
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        showFeedback('');
    };

    const formatDate = isoString => {
        try {
            const date = new Date(isoString);
            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            return formatter.format(date);
        } catch (error) {
            return isoString;
        }
    };

    const renderPosts = () => {
        blogGrid.innerHTML = '';

        const posts = [...staticPosts, ...getStoredPosts()];

        if (!posts.length) {
            blogGrid.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-pen-fancy"></i>
                    <p>No hay publicaciones disponibles todavía. Usá el modo edición para crear la primera.</p>
                </div>
            `;
            return;
        }

        posts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(post => {
                const clone = document.importNode(template.content, true);
                const article = clone.querySelector('[data-blog-post]');
                if (article) {
                    article.setAttribute('data-blog-post-id', post.id);
                }

                const titleEl = clone.querySelector('[data-blog-title]');
                const descEl = clone.querySelector('[data-blog-description]');
                const dateEl = clone.querySelector('[data-blog-date]');
                const authorEl = clone.querySelector('[data-blog-author]');
                const tagsContainer = clone.querySelector('[data-blog-tags]');
                const categoryEl = clone.querySelector('[data-blog-category]');

                titleEl.textContent = post.subject;
                descEl.textContent = post.description;
                dateEl.textContent = formatDate(post.createdAt);
                authorEl.textContent = `${post.firstName} ${post.lastName}`.trim();

                tagsContainer.innerHTML = '';
                post.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = tag;
                    tagsContainer.appendChild(span);
                });

                categoryEl.textContent = post.category || post.tags[0] || 'General';

                blogGrid.appendChild(clone);
            });
    };

    const showFeedback = (message, isError = false) => {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.classList.toggle('is-error', Boolean(isError));
    };

    setAdminState();

    if (adminTrigger) {
        adminTrigger.addEventListener('click', () => {
            if (!isAdmin()) {
                const key = prompt('Ingresá la clave para activar el modo edición:');
                if (key === null) {
                    return;
                }

                if (key.trim() === ADMIN_KEY) {
                    document.body.classList.add(ADMIN_CLASS);
                    setAdminState();
                    openModal();
                    showFeedback('Modo edición activado. Ya podés publicar.', false);
                } else {
                    flashTriggerError('Clave incorrecta');
                }
                return;
            }

            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (!isAdmin()) {
                showFeedback(`Necesitás activar el modo edición con la clave ${ADMIN_KEY} usando el botón flotante.`, true);
                return;
            }

            const formData = new FormData(form);
            const firstName = (formData.get('firstName') || '').toString().trim();
            const lastName = (formData.get('lastName') || '').toString().trim();
            const subject = (formData.get('subject') || '').toString().trim();
            const tagsRaw = (formData.get('tags') || '').toString();
            const description = (formData.get('description') || '').toString().trim();

            if (!firstName || !lastName || !subject || !tagsRaw || !description) {
                showFeedback('Completá todos los campos antes de publicar.', true);
                return;
            }

            const tags = tagsRaw
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
                .slice(0, 6);

            if (!tags.length) {
                showFeedback('Agregá al menos un tag de tecnología.', true);
                return;
            }

            const posts = getStoredPosts();
            const newPost = {
                id: `post-${Date.now()}`,
                firstName,
                lastName,
                subject,
                tags,
                description,
                createdAt: new Date().toISOString(),
                category: tags[0]
            };

            posts.push(newPost);
            savePosts(posts);
            renderPosts();
            form.reset();
            showFeedback('¡Entrada publicada con éxito!');
        });
    }

    const clearButton = document.getElementById('admin-clear');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            showFeedback('');
        });
    }

    renderPosts();
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) {
        return;
    }

    const feedback = document.getElementById('contact-feedback');
    const submitBtn = form.querySelector('.submit-btn');
    const originalButtonContent = submitBtn ? submitBtn.innerHTML : '';
    let isSending = false;

    const setFeedback = (message, status) => {
        if (!feedback) {
            return;
        }
        feedback.textContent = message;
        feedback.classList.remove('is-error', 'is-sending');
        if (status === 'error') {
            feedback.classList.add('is-error');
        } else if (status === 'sending') {
            feedback.classList.add('is-sending');
        }
    };

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (isSending) {
            return;
        }

        isSending = true;
        setFeedback('Enviando mensaje...', 'sending');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        }

        setTimeout(() => {
            setFeedback('¡Mensaje enviado! Me pondré en contacto a la brevedad.', 'success');
            form.reset();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonContent || '<i class="fas fa-paper-plane"></i> Enviar mensaje';
            }

            isSending = false;
        }, 1500);
    });

    setFeedback('', 'success');
}