// Splash Screen Controller with Real Logo
class SplashScreenWithLogo {
    constructor() {
        this.splashElement = null;
        this.splashDuration = 4500; // 4.5 segundos para dar tempo do logo carregar
        this.isFirstVisit = true;
        this.init();
    }

    init() {
        this.checkFirstVisit();
        document.body.classList.add('splash-active');
        this.createSplashScreen();
        this.startSplashTimer();
        this.addEventListeners();
    }

    checkFirstVisit() {
        const hasVisited = sessionStorage.getItem('splashShown');
        if (hasVisited) {
            this.isFirstVisit = false;
            this.splashDuration = 2500;
        }
        sessionStorage.setItem('splashShown', 'true');
    }

    createSplashScreen() {
        const splashHTML = `
            <div class="splash-screen" id="splashScreen">
                <!-- Partículas flutuantes -->
                <div class="splash-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
                
                <!-- Logo container com logo real -->
                <div class="splash-logo-container">
                    <div class="splash-logo-real">
                        <img src="logo.png?v=1" alt="Scorpion Intelligence" class="splash-logo-img">
                    </div>
                </div>
                
                <!-- Título -->
                <h1 class="splash-title">SCORPION</h1>
                <p class="splash-subtitle">Inteligência & Investigação Digital</p>
                
                <!-- Barra de loading -->
                <div class="splash-loading">
                    <div class="splash-loading-bar"></div>
                </div>
                
                <!-- Dots de carregamento -->
                <div class="splash-dots">
                    <div class="splash-dot"></div>
                    <div class="splash-dot"></div>
                    <div class="splash-dot"></div>
                </div>
                
                <!-- Texto de loading -->
                <div class="splash-loading-text">Preparando experiência...</div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', splashHTML);
        this.splashElement = document.getElementById('splashScreen');
        
        // Adiciona estilos específicos para o logo real
        this.addLogoStyles();
    }

    addLogoStyles() {
        const logoStyles = `
            .splash-logo-real {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: linear-gradient(45deg, #f56565, #ff8a80);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 40px rgba(245, 101, 101, 0.4);
                position: relative;
                overflow: hidden;
                padding: 20px;
            }

            .splash-logo-real::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                animation: logoShine 2s ease-in-out infinite;
            }

            .splash-logo-img {
                width: 100px;
                height: 100px;
                object-fit: contain;
                z-index: 2;
                animation: logoImageRotate 3s ease-in-out infinite;
                filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
                border-radius: 10px;
            }

            @keyframes logoImageRotate {
                0%, 100% {
                    transform: rotate(0deg) scale(1);
                }
                25% {
                    transform: rotate(2deg) scale(1.05);
                }
                75% {
                    transform: rotate(-2deg) scale(0.95);
                }
            }

            @media (max-width: 768px) {
                .splash-logo-real {
                    width: 120px;
                    height: 120px;
                    padding: 15px;
                }
                
                .splash-logo-img {
                    width: 80px;
                    height: 80px;
                }
            }

            @media (max-width: 480px) {
                .splash-logo-real {
                    width: 100px;
                    height: 100px;
                    padding: 10px;
                }
                
                .splash-logo-img {
                    width: 70px;
                    height: 70px;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = logoStyles;
        document.head.appendChild(style);
    }

    startSplashTimer() {
        setTimeout(() => {
            this.hideSplashScreen();
        }, this.splashDuration);

        this.updateLoadingText();
    }

    updateLoadingText() {
        const loadingTexts = [
            'Iniciando sistemas...',
            'Carregando ferramentas OSINT...',
            'Verificando conexões seguras...',
            'Preparando interface...',
            'Quase pronto...'
        ];

        let currentTextIndex = 0;
        const loadingTextElement = document.querySelector('.splash-loading-text');

        const textInterval = setInterval(() => {
            if (currentTextIndex < loadingTexts.length && loadingTextElement) {
                loadingTextElement.textContent = loadingTexts[currentTextIndex];
                currentTextIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 800);

        setTimeout(() => {
            clearInterval(textInterval);
        }, this.splashDuration);
    }

    hideSplashScreen() {
        if (this.splashElement) {
            this.splashElement.classList.add('fade-out');
            document.body.classList.remove('splash-active');
            
            setTimeout(() => {
                if (this.splashElement && this.splashElement.parentNode) {
                    this.splashElement.parentNode.removeChild(this.splashElement);
                }
                this.triggerSplashComplete();
            }, 800);
        }
    }

    triggerSplashComplete() {
        const splashCompleteEvent = new CustomEvent('splashComplete', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(splashCompleteEvent);
        this.initMainSiteAnimations();
    }

    initMainSiteAnimations() {
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero');
        
        if (header) {
            header.style.animation = 'fadeInDown 0.8s ease-out';
        }
        
        if (hero) {
            hero.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
        }
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                this.hideSplashScreen();
            }
        });

        window.addEventListener('load', () => {
            // Verifica se logo carregou
            const logoImg = document.querySelector('.splash-logo-img');
            if (logoImg) {
                logoImg.onload = () => {
                    console.log('Logo carregado com sucesso');
                };
                logoImg.onerror = () => {
                    console.warn('Erro ao carregar logo, usando fallback');
                    // Volta para ícone se logo não carregar
                    const logoContainer = document.querySelector('.splash-logo-real');
                    if (logoContainer) {
                        logoContainer.innerHTML = '<i class="fas fa-search" style="font-size: 48px; color: white; z-index: 2;"></i>';
                    }
                };
            }
        });
    }

    forceClose() {
        this.hideSplashScreen();
    }
}

// CSS adicional para animações do site principal
const mainSiteAnimations = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const style = document.createElement('style');
style.textContent = mainSiteAnimations;
document.head.appendChild(style);

// Para usar esta versão, substitua em index.html:
// <script src="js/splash.js"></script>
// por:
// <script src="js/splash-with-logo.js"></script>

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SplashScreenWithLogo();
    });
} else {
    new SplashScreenWithLogo();
}

window.SplashScreenWithLogo = SplashScreenWithLogo;