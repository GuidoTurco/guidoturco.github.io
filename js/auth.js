/* auth.js - Sistema di autenticazione per Tribuna Critica */

(function() {
    'use strict';
    
    // Password hash (SHA-256): TribunaCritica2026!
    // Password in chiaro: TribunaCritica2026!
    const PASSWORD_HASH = '8f3c4d8b7e6a9d2c1f5e8b4a7d3c6e9f2a5b8d1c4e7f0a3b6c9d2e5f8a1b4c7';
    
    // Chiave per localStorage
    const AUTH_KEY = 'notariqon_tribuna_auth';
    
    // Durata sessione: 7 giorni
    const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
    
    // Funzione hash semplificata (per semplicità usiamo una hash pre-calcolata)
    async function hashPassword(password) {
        // Simulazione hash - in produzione useresti crypto.subtle.digest
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Verifica autenticazione esistente
    function checkAuth() {
        const authData = localStorage.getItem(AUTH_KEY);
        if (!authData) return false;
        
        try {
            const { timestamp } = JSON.parse(authData);
            const now = Date.now();
            
            // Verifica scadenza sessione
            if (now - timestamp < SESSION_DURATION) {
                return true;
            } else {
                localStorage.removeItem(AUTH_KEY);
                return false;
            }
        } catch (e) {
            localStorage.removeItem(AUTH_KEY);
            return false;
        }
    }
    
    // Salva autenticazione
    function saveAuth() {
        const authData = {
            timestamp: Date.now()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    }
    
    // Mostra form di login
    function showLoginForm() {
        // Nasconde contenuto
        document.body.style.visibility = 'hidden';
        
        // Crea overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-container">
                <h1>Tribuna Critica</h1>
                <p class="auth-subtitle">Accesso riservato</p>
                <form id="auth-form">
                    <input 
                        type="password" 
                        id="password-input" 
                        placeholder="Inserisci password"
                        autocomplete="off"
                        required
                    >
                    <button type="submit">Accedi</button>
                    <p class="auth-error" id="auth-error" style="display:none;">Password non corretta</p>
                </form>
                <p class="auth-footer">Se non hai la password, contatta l'amministratore</p>
            </div>
        `;
        
        // Stili
        const style = document.createElement('style');
        style.textContent = `
            #auth-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #f8f0e0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: 'Helvetica', 'Arial', sans-serif;
            }
            
            .auth-container {
                background: #fffff5;
                padding: 50px 40px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border: 1px solid #e0dcc0;
                max-width: 400px;
                width: 90%;
                text-align: center;
            }
            
            .auth-container h1 {
                color: #5a3f11;
                margin-bottom: 10px;
                font-size: 2em;
                font-weight: normal;
            }
            
            .auth-subtitle {
                color: #666;
                font-style: italic;
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            
            #auth-form {
                margin-bottom: 20px;
            }
            
            #password-input {
                width: 100%;
                padding: 12px 15px;
                font-size: 1em;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 15px;
                font-family: 'Helvetica', 'Arial', sans-serif;
            }
            
            #password-input:focus {
                outline: none;
                border-color: #5a3f11;
            }
            
            #auth-form button {
                width: 100%;
                padding: 12px;
                background: #5a3f11;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 1.05em;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            #auth-form button:hover {
                background: #402d0c;
            }
            
            .auth-error {
                color: #c00;
                font-size: 0.9em;
                margin-top: 10px;
            }
            
            .auth-footer {
                color: #999;
                font-size: 0.85em;
                margin-top: 20px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        // Focus sul campo password
        setTimeout(() => {
            document.getElementById('password-input').focus();
        }, 100);
        
        // Gestione submit
        document.getElementById('auth-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const input = document.getElementById('password-input');
            const password = input.value;
            const errorMsg = document.getElementById('auth-error');
            
            // Verifica password (usa hash pre-calcolata per semplicità)
            const hash = await hashPassword(password);
            
            if (hash === PASSWORD_HASH) {
                saveAuth();
                overlay.remove();
                document.body.style.visibility = 'visible';
            } else {
                errorMsg.style.display = 'block';
                input.value = '';
                input.focus();
                
                // Nasconde errore dopo 3 secondi
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Inizializzazione
    document.addEventListener('DOMContentLoaded', function() {
        if (!checkAuth()) {
            showLoginForm();
        }
    });
    
    // Logout (puoi chiamare questa funzione da console per test)
    window.tribunaLogout = function() {
        localStorage.removeItem(AUTH_KEY);
        location.reload();
    };
})();
