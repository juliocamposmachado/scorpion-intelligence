// Scorpion Intelligence - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Show contact method selection
            showContactMethodSelection(name, email, subject, message);
        });
    }
    
    function showContactMethodSelection(name, email, subject, message) {
        // Create selection modal
        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'contact-selection-modal';
        selectionDiv.innerHTML = `
            <div class="selection-content">
                <div class="selection-header">
                    <i class="fas fa-paper-plane"></i>
                    <h3>Escolha como enviar sua mensagem</h3>
                    <p>Selecione o método de contato de sua preferência:</p>
                </div>
                
                <div class="contact-options">
                    <button class="contact-option whatsapp-option" onclick="sendViaWhatsApp('${name}', '${email}', '${subject}', '${message.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n')}')">
                        <i class="fab fa-whatsapp"></i>
                        <div class="option-info">
                            <h4>WhatsApp</h4>
                            <p>Resposta mais rápida<br><span class="phone">+55 11 99294-6628</span></p>
                        </div>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    
                    <button class="contact-option email-option" onclick="sendViaEmail('${name}', '${email}', '${subject}', '${message.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n')}')">
                        <i class="fas fa-envelope"></i>
                        <div class="option-info">
                            <h4>Email</h4>
                            <p>Documentação formal<br><span class="email-addr">juliocamposmachado@gmail.com</span></p>
                        </div>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                
                <button class="close-selection" onclick="closeContactSelection()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        selectionDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            animation: fadeIn 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(selectionDiv);
        window.currentSelectionModal = selectionDiv;
    }
    
    // Make functions global for inline onclick handlers
    window.sendViaWhatsApp = function(name, email, subject, message) {
        // Create WhatsApp message
        const whatsappMessage = `Olá! Meu nome é ${name}.

*Assunto:* ${subject}

*Mensagem:* ${message}

*Email para contato:* ${email}

Enviado através do site da Scorpion Intelligence.`;
        
        // Open WhatsApp
        const whatsappUrl = `https://wa.me/5511992946628?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Close modal and show success
        window.closeContactSelection();
        window.showSuccessMessage('WhatsApp', 'Sua mensagem foi preparada no WhatsApp. Basta clicar em enviar!');
        
        // Reset form
        setTimeout(() => {
            document.getElementById('contactForm').reset();
        }, 2000);
    };
    
    window.sendViaEmail = function(name, email, subject, message) {
        // Create email body
        const emailBody = `Olá Scorpion Intelligence,

Meu nome é: ${name}
Email para contato: ${email}

Assunto: ${subject}

Mensagem:
${message}

---
Enviado através do formulário de contato do site: https://scorpion-intelligence.vercel.app
Data: ${new Date().toLocaleString('pt-BR')}`;
        
        // Create mailto link
        const mailtoLink = `mailto:juliocamposmachado@gmail.com?subject=${encodeURIComponent('[Site] ' + subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Close modal and show success
        window.closeContactSelection();
        window.showSuccessMessage('Email', 'Seu cliente de email foi aberto com a mensagem pré-preenchida. Basta clicar em enviar!');
        
        // Reset form
        setTimeout(() => {
            document.getElementById('contactForm').reset();
        }, 2000);
    };
    
    window.closeContactSelection = function() {
        if (window.currentSelectionModal) {
            window.currentSelectionModal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(window.currentSelectionModal)) {
                    document.body.removeChild(window.currentSelectionModal);
                }
                window.currentSelectionModal = null;
            }, 300);
        }
    };
    
    window.showSuccessMessage = function(method = 'Email', customMessage = '') {
        const isWhatsApp = method === 'WhatsApp';
        const message = customMessage || (isWhatsApp ? 
            'Sua mensagem foi preparada no WhatsApp. Basta clicar em enviar!' : 
            'Seu cliente de email foi aberto com a mensagem pré-preenchida. Basta clicar em "Enviar" no seu email.');
            
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>${method} preparado com sucesso!</h3>
                <p>${message}</p>
                <p><strong>Ou entre em contato pelo outro canal:</strong><br>
                ${isWhatsApp ? 
                    '<a href="mailto:juliocamposmachado@gmail.com"><i class="fas fa-envelope"></i> Email: juliocamposmachado@gmail.com</a>' :
                    '<a href="https://wa.me/5511992946628" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp: +55 11 99294-6628</a>'
                }</p>
            </div>
        `;
        
        // Add styles
        successDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(successDiv);
        
        // Auto-remove after 5 seconds or on click
        const removeMessage = () => {
            successDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        };
        
        setTimeout(removeMessage, 5000);
        successDiv.addEventListener('click', removeMessage);
    };

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with fade-in animation
    const animatedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    console.log('✅ Scorpion Intelligence - Site carregado com sucesso!');
});

// Add some CSS for scroll effects via JavaScript
const style = document.createElement('style');
style.textContent = `
    .header.scrolled {
        background: rgba(26, 32, 44, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .nav-menu.active {
        display: flex !important;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .success-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .success-content i {
        color: #48bb78;
        font-size: 48px;
        margin-bottom: 15px;
        display: block;
    }
    
    .success-content h3 {
        color: #1a202c;
        margin-bottom: 15px;
        font-size: 24px;
    }
    
    .success-content p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 15px;
    }
    
    .success-content a {
        color: #25d366;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 15px;
        background: rgba(37, 211, 102, 0.1);
        border-radius: 8px;
        transition: all 0.2s ease;
    }
    
    .success-content a:hover {
        background: rgba(37, 211, 102, 0.2);
        transform: translateY(-2px);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    /* Contact Selection Modal */
    .selection-content {
        background: white;
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
        position: relative;
    }
    
    .selection-header i {
        color: #f56565;
        font-size: 48px;
        margin-bottom: 15px;
        display: block;
    }
    
    .selection-header h3 {
        color: #1a202c;
        margin-bottom: 10px;
        font-size: 24px;
    }
    
    .selection-header p {
        color: #666;
        margin-bottom: 25px;
    }
    
    .contact-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .contact-option {
        display: flex;
        align-items: center;
        padding: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
        gap: 15px;
    }
    
    .contact-option:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .whatsapp-option:hover {
        border-color: #25d366;
        background: rgba(37, 211, 102, 0.05);
    }
    
    .email-option:hover {
        border-color: #3182ce;
        background: rgba(49, 130, 206, 0.05);
    }
    
    .contact-option i:first-child {
        font-size: 32px;
        width: 50px;
        text-align: center;
    }
    
    .whatsapp-option i:first-child {
        color: #25d366;
    }
    
    .email-option i:first-child {
        color: #3182ce;
    }
    
    .option-info {
        flex: 1;
    }
    
    .option-info h4 {
        margin: 0 0 5px 0;
        font-size: 18px;
        color: #1a202c;
    }
    
    .option-info p {
        margin: 0;
        color: #666;
        line-height: 1.4;
    }
    
    .phone, .email-addr {
        font-weight: 600;
        color: #4a5568;
    }
    
    .contact-option i:last-child {
        color: #cbd5e0;
        font-size: 16px;
        transition: transform 0.2s ease;
    }
    
    .contact-option:hover i:last-child {
        transform: translateX(5px);
    }
    
    .close-selection {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        color: #a0aec0;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .close-selection:hover {
        background: rgba(160, 174, 192, 0.1);
        color: #4a5568;
    }
    
    @media (max-width: 600px) {
        .selection-content {
            margin: 10px;
            padding: 20px;
        }
        
        .contact-option {
            padding: 15px;
        }
        
        .contact-option i:first-child {
            font-size: 28px;
        }
        
        .option-info h4 {
            font-size: 16px;
        }
    }
`;
document.head.appendChild(style);