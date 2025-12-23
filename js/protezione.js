// protezione.js - Blocco copia, tasto destro, comandi tastiera

// Blocca tasto destro
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Blocca comandi tastiera (Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+A, Ctrl+P, F12)
document.addEventListener('keydown', function(e) {
    // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+S, Ctrl+U, Ctrl+P
    if (e.ctrlKey && (
        e.key === 'c' || e.key === 'C' ||
        e.key === 'x' || e.key === 'X' ||
        e.key === 'v' || e.key === 'V' ||
        e.key === 'a' || e.key === 'A' ||
        e.key === 's' || e.key === 'S' ||
        e.key === 'u' || e.key === 'U' ||
        e.key === 'p' || e.key === 'P'
    )) {
        e.preventDefault();
        return false;
    }
    // F12 (Developer Tools)
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
    }
});

// Blocca selezione via drag
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Blocca drag & drop
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// Blocca copia
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// Blocca taglia
document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});
