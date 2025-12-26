/* protezione.js - Protezione anti-copia + Lightbox immagini */

// === PROTEZIONE ANTI-COPIA ===
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

// Blocca shortcut tastiera
document.addEventListener('keydown', e => {
    if (e.ctrlKey && ['c', 'x', 'a', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});

// === LIGHTBOX IMMAGINI ===
document.addEventListener('DOMContentLoaded', function() {
    // Crea overlay lightbox
    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.innerHTML = '<img id="lightbox-img" src="" alt="">';
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        cursor: pointer;
        justify-content: center;
        align-items: center;
    `;
    
    const lightboxImg = overlay.querySelector('#lightbox-img');
    lightboxImg.style.cssText = `
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    `;
    
    document.body.appendChild(overlay);
    
    // Click su immagini con classe .immagine-principale
    document.querySelectorAll('.immagine-principale img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Chiudi lightbox con click
    overlay.addEventListener('click', closeLightbox);
    
    // Chiudi lightbox con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
});
