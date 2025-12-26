<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8"/>
<xsl:template match="/">
<html lang="it">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>RSS | <xsl:value-of select="/rss/channel/title"/></title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f5f5f0;
            color: #333;
            line-height: 1.8;
        }
        .container {
            background: #fff;
            padding: 50px 60px;
            border-left: 4px solid #8b7355;
            box-shadow: 0 2px 15px rgba(0,0,0,0.06);
        }
        h1 {
            font-size: 1.8em;
            margin: 0 0 10px 0;
            color: #222;
        }
        .subtitle {
            color: #666;
            font-style: italic;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .info-box {
            background: #fafafa;
            padding: 20px;
            margin-bottom: 40px;
            border-radius: 4px;
            font-size: 0.95em;
        }
        .info-box p {
            margin: 0 0 10px 0;
        }
        .info-box code {
            background: #eee;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 0.9em;
            word-break: break-all;
        }
        h2 {
            font-size: 1.3em;
            color: #8b7355;
            margin: 40px 0 20px 0;
            font-weight: normal;
        }
        .item {
            margin-bottom: 25px;
            padding-bottom: 25px;
            border-bottom: 1px solid #eee;
        }
        .item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .item-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .item-title a {
            color: #333;
            text-decoration: none;
        }
        .item-title a:hover {
            text-decoration: underline;
        }
        .item-date {
            font-size: 0.85em;
            color: #888;
            margin-bottom: 8px;
        }
        .item-desc {
            color: #555;
            font-size: 0.95em;
        }
        .back-link {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }
        .back-link a {
            color: #8b7355;
            text-decoration: none;
        }
        .back-link a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .container {
                padding: 30px 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p class="subtitle"><xsl:value-of select="/rss/channel/description"/></p>
        
        <div class="info-box">
            <p><strong>Questo è un feed RSS.</strong></p>
            <p>Per ricevere gli aggiornamenti automatici, copia questo indirizzo e aggiungilo al tuo lettore di feed (Feedly, Inoreader, NetNewsWire, ecc.):</p>
            <p><code>https://guidoturco.github.io/feed.xml</code></p>
        </div>

        <h2>Ultimi contenuti</h2>
        
        <xsl:for-each select="/rss/channel/item">
            <div class="item">
                <div class="item-title">
                    <a href="{link}" target="_blank" rel="noopener">
                        <xsl:value-of select="title"/>
                    </a>
                </div>
                <div class="item-date"><xsl:value-of select="pubDate"/></div>
                <div class="item-desc"><xsl:value-of select="description"/></div>
            </div>
        </xsl:for-each>

        <p class="back-link"><a href="index.html">← Torna al sito</a></p>
    </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
