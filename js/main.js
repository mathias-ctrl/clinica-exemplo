document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    updateAutomaticCounter();
    updateYearsCounter();
    initCounterObserver();
    initSmoothScroll();
    initNavScroll();
    initCardAnimations();
});

function calculatePatientCount() {
    const start = new Date('2019-01-28');
    const today = new Date();
    const days = Math.floor((today - start) / 86400000);
    const working = Math.floor(days * 0.71);
    const vacations = Math.floor(days / 365) * 30;
    return Math.max(0, working - vacations) * 4 + (today.getDate() % 20);
}

function updateAutomaticCounter() {
    const el = document.querySelector('[data-counter="500"]');
    if (el) {
        el.setAttribute('data-counter', calculatePatientCount());
        el.removeAttribute('data-prefix');
    }
}

function updateYearsCounter() {
    const el = document.getElementById('yearsCounter');
    if (el) {
        const years = Math.floor((new Date() - new Date('2019-01-28')) / (86400000 * 365.25));
        el.setAttribute('data-counter', years);
    }
}

function animateCounter(el) {
    const target   = parseInt(el.dataset.counter);
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const start    = performance.now();
    const duration = 2000;

    function update(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = prefix + Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(update);
}

function initCounterObserver() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !e.target.dataset.animated) {
                e.target.dataset.animated = 'true';
                setTimeout(() => animateCounter(e.target), 500);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initNavScroll() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('shadow-xl', window.scrollY > 100);
    });
}

function initCardAnimations() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity   = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card-hover, .hover-scale').forEach(el => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        obs.observe(el);
    });
}
