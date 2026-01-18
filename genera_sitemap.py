#!/usr/bin/env python3
"""
Genera sitemap.xml per Notariqon leggendo i JSON delle sezioni.
Eseguire dalla root del repository: python genera_sitemap.py
"""

import json
import os
from datetime import datetime

# Configurazione
BASE_URL = "https://guidoturco.github.io"
OUTPUT_FILE = "sitemap-2.xml"

# Mappa sezioni -> cartelle e file JSON
SEZIONI = [
    {"json": "data/tribuna.json", "folder": "recensioni"},
    {"json": "data/inediti.json", "folder": "inediti"},
    {"json": "data/disiecta.json", "folder": "disiecta"},
]

# Pagine statiche (sempre presenti)
PAGINE_STATICHE = [
    {"loc": "/", "priority": "1.0", "changefreq": "weekly"},
    {"loc": "/documenti/manifesto.html", "priority": "0.8", "changefreq": "monthly"},
    {"loc": "/documenti/canone.html", "priority": "0.8", "changefreq": "monthly"},
]


def make_slug(date_str):
    """Converte '24 dicembre 2025' in '24-dicembre-2025'"""
    return date_str.lower().replace(" ", "-")


def parse_italian_date(date_str):
    """Converte data italiana in formato ISO (YYYY-MM-DD)"""
    mesi = {
        'gennaio': '01', 'febbraio': '02', 'marzo': '03', 'aprile': '04',
        'maggio': '05', 'giugno': '06', 'luglio': '07', 'agosto': '08',
        'settembre': '09', 'ottobre': '10', 'novembre': '11', 'dicembre': '12'
    }
    parts = date_str.lower().split()
    if len(parts) == 3:
        day = parts[0].zfill(2)
        month = mesi.get(parts[1], '01')
        year = parts[2]
        return f"{year}-{month}-{day}"
    return datetime.now().strftime("%Y-%m-%d")


def load_json(filepath):
    """Carica un file JSON, ritorna lista vuota se non esiste"""
    if not os.path.exists(filepath):
        print(f"  ⚠ File non trovato: {filepath}")
        return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"  ⚠ Errore parsing {filepath}: {e}")
        return []


def genera_sitemap():
    """Genera il file sitemap.xml"""
    
    today = datetime.now().strftime("%Y-%m-%d")
    urls = []
    
    # Pagine statiche
    print("Aggiungo pagine statiche...")
    for pagina in PAGINE_STATICHE:
        urls.append({
            "loc": f"{BASE_URL}{pagina['loc']}",
            "lastmod": today,
            "changefreq": pagina["changefreq"],
            "priority": pagina["priority"]
        })
    
    # Pagine dinamiche dai JSON
    for sezione in SEZIONI:
        print(f"Processo {sezione['json']}...")
        posts = load_json(sezione["json"])
        
        for post in posts:
            slug = make_slug(post["date"])
            lastmod = parse_italian_date(post["date"])
            
            urls.append({
                "loc": f"{BASE_URL}/{sezione['folder']}/{slug}.html",
                "lastmod": lastmod,
                "changefreq": "monthly",
                "priority": "0.6"
            })
        
        print(f"  ✓ {len(posts)} pagine aggiunte da {sezione['folder']}/")
    
    # Genera XML
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    for url in urls:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{url['loc']}</loc>")
        xml_lines.append(f"    <lastmod>{url['lastmod']}</lastmod>")
        xml_lines.append(f"    <changefreq>{url['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{url['priority']}</priority>")
        xml_lines.append("  </url>")
    
    xml_lines.append("</urlset>")
    
    # Scrivi file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("\n".join(xml_lines))
    
    print(f"\n✓ Sitemap generata: {OUTPUT_FILE}")
    print(f"  Totale URL: {len(urls)}")


if __name__ == "__main__":
    genera_sitemap()
