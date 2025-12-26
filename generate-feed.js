const fs = require('fs');

// Mappa mesi italiani
const mesiIT = {
    'gennaio': 0, 'febbraio': 1, 'marzo': 2, 'aprile': 3,
    'maggio': 4, 'giugno': 5, 'luglio': 6, 'agosto': 7,
    'settembre': 8, 'ottobre': 9, 'novembre': 10, 'dicembre': 11
};

const giorniEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const mesiEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Converte data italiana in Date
function parseItalianDate(dateStr) {
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = mesiIT[parts[1]];
        const year = parseInt(parts[2]);
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
            return new Date(year, month, day, 12, 0, 0);
        }
    }
    return new Date(0);
}

// Converte Date in formato RFC 822
function toRFC822(date) {
    const d = giorniEN[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const m = mesiEN[date.getMonth()];
    const y = date.getFullYear();
    return `${d}, ${day} ${m} ${y} 12:00:00 +0100`;
}

// Genera slug dalla data
function makeSlug(dateStr) {
    return dateStr.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

// Carica JSON (ritorna array vuoto se non esiste o è vuoto)
function loadJSON(path) {
    try {
        const content = fs.readFileSync(path, 'utf8').trim();
        if (!content) return [];
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

// Main
const tribuna = loadJSON('data/tribuna.json');
const inediti = loadJSON('data/inediti.json');
const disiecta = loadJSON('data/disiecta.json');

// Raccogli tutti i post
const allPosts = [];

tribuna.forEach(p => {
    const slug = p.file ? p.file.replace('.html', '') : makeSlug(p.date);
    allPosts.push({
        title: `Tribuna Critica: ${p.title}${p.author ? ' – ' + p.author : ''}`,
        link: `https://guidoturco.github.io/recensioni/${slug}.html`,
        date: parseItalianDate(p.date),
        description: p.author ? `Scheda critica di "${p.title}" di ${p.author}` : `Scheda critica: ${p.title}`
    });
});

inediti.forEach(p => {
    const slug = p.file ? p.file.replace('.html', '') : makeSlug(p.date);
    allPosts.push({
        title: `Inediti: ${p.title}`,
        link: `https://guidoturco.github.io/inediti/${slug}.html`,
        date: parseItalianDate(p.date),
        description: `Inedito: ${p.title}`
    });
});

disiecta.forEach(p => {
    const slug = p.file ? p.file.replace('.html', '') : makeSlug(p.date);
    allPosts.push({
        title: `Via Babelia: ${p.title}`,
        link: `https://guidoturco.github.io/disiecta/${slug}.html`,
        date: parseItalianDate(p.date),
        description: `Via Babelia: ${p.title}`
    });
});

// Ordina per data decrescente
allPosts.sort((a, b) => b.date - a.date);

// Prendi ultimi 50
const recentPosts = allPosts.slice(0, 50);

// Genera XML
const now = new Date();
const lastBuild = toRFC822(now);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Notariqon – casa d'Arno</title>
    <link>https://guidoturco.github.io</link>
    <description>Qualcosa di me, note, scritti, digressioni, riflessioni e varia umanità</description>
    <language>it-IT</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="https://guidoturco.github.io/feed.xml" rel="self" type="application/rss+xml"/>
`;

recentPosts.forEach(post => {
    xml += `
    <item>
        <title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
        <link>${post.link}</link>
        <guid>${post.link}</guid>
        <pubDate>${toRFC822(post.date)}</pubDate>
        <description>${post.description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
    </item>`;
});

xml += `
</channel>
</rss>
`;

fs.writeFileSync('feed.xml', xml);
console.log(`Feed generato con ${recentPosts.length} elementi.`);
