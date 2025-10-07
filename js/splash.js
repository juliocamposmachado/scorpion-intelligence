// Splash Screen Controller
class SplashScreen {
    constructor() {
        this.splashElement = null;
        this.splashDuration = 4000; // 4 segundos
        this.isFirstVisit = true;
        this.init();
    }

    init() {
        // Verifica se é a primeira visita (opcional)
        this.checkFirstVisit();
        
        // Adiciona classe ao body
        document.body.classList.add('splash-active');
        
        // Cria a splash screen
        this.createSplashScreen();
        
        // Inicia o timer
        this.startSplashTimer();
        
        // Event listeners
        this.addEventListeners();
    }

    checkFirstVisit() {
        // Verifica se já visitou (usando sessionStorage para resetar a cada sessão)
        const hasVisited = sessionStorage.getItem('splashShown');
        if (hasVisited) {
            this.isFirstVisit = false;
            this.splashDuration = 2000; // Reduz duração em visitas subsequentes
        }
        sessionStorage.setItem('splashShown', 'true');
    }

    createSplashScreen() {
        // Cria o HTML da splash screen
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
                
                <!-- Logo container -->
                <div class="splash-logo-container">
                    <div class="splash-logo">
                        <i class="fas fa-search"></i>
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

        // Insere no início do body
        document.body.insertAdjacentHTML('afterbegin', splashHTML);
        this.splashElement = document.getElementById('splashScreen');
    }

    startSplashTimer() {
        // Timer principal
        setTimeout(() => {
            this.hideSplashScreen();
        }, this.splashDuration);

        // Atualiza texto de loading durante a animação
        this.updateLoadingText();
    }

    updateLoadingText() {
        const loadingTexts = [
            'Iniciando sistemas...',
            'Carregando ferramentas OSINT...',
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

        // Clear interval quando splash desaparece
        setTimeout(() => {
            clearInterval(textInterval);
        }, this.splashDuration);
    }

    hideSplashScreen() {
        if (this.splashElement) {
            // Adiciona classe de fade out
            this.splashElement.classList.add('fade-out');
            
            // Remove classe do body
            document.body.classList.remove('splash-active');
            
            // Remove elemento do DOM após transição
            setTimeout(() => {
                if (this.splashElement && this.splashElement.parentNode) {
                    this.splashElement.parentNode.removeChild(this.splashElement);
                }
                
                // Trigger evento customizado
                this.triggerSplashComplete();
                
            }, 800); // Tempo da transição CSS
        }
    }

    triggerSplashComplete() {
        // Dispara evento customizado quando splash termina
        const splashCompleteEvent = new CustomEvent('splashComplete', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(splashCompleteEvent);

        // Inicia animações do site principal se necessário
        this.initMainSiteAnimations();
    }

    initMainSiteAnimations() {
        // Anima elementos principais quando splash termina
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
        // Permite pular splash clicando (opcional)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                this.hideSplashScreen();
            }
        });

        // Pular splash clicando (opcional - descomente se desejar)
        /*
        if (this.splashElement) {
            this.splashElement.addEventListener('click', () => {
                this.hideSplashScreen();
            });
        }
        */

        // Listener para quando a página está completamente carregada
        window.addEventListener('load', () => {
            // Se a página carregar muito rápido, garante tempo mínimo
            const minDisplayTime = 2000;
            setTimeout(() => {
                // Já pode esconder se o tempo passou
            }, minDisplayTime);
        });
    }

    // Método público para forçar fechamento
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

// Adiciona CSS das animações principais
const style = document.createElement('style');
style.textContent = mainSiteAnimations;
document.head.appendChild(style);

// Inicializa splash screen quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SplashScreen();
    });
} else {
    new SplashScreen();
}

// Exporta classe para uso global se necessário
window.SplashScreen = SplashScreen;