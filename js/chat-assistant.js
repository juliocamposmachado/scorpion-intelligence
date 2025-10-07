// Scorpion Intelligence AI Assistant
class ScorpionAssistant {
    constructor() {
        this.API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        this.API_KEY = "AIzaSyBu5ZskRX8XCUM5Q5ot66lVQCVz-8Vah24";
        this.isOpen = false;
        this.isTyping = false;
        this.toolsDatabase = null;
        this.conversationHistory = [];
        this.messageCount = 0;
        this.maxMessagesPerSession = 20;
        this.lastMessageTime = 0;
        this.minMessageInterval = 2000; // 2 seconds
        
        // Speech features
        this.speechEnabled = 'speechSynthesis' in window;
        this.speechRecognitionEnabled = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.currentVoice = null;
        this.speechRate = 1.0;
        this.speechPitch = 1.0;
        this.isListening = false;
        this.recognition = null;
        
        // Initialize speech features
        this.initSpeech();
        this.quickSuggestions = [
            "Quais ferramentas vocês recomendam para busca em redes sociais?",
            "Como posso investigar uma pessoa usando OSINT?",
            "Quais são os custos dos serviços da Scorpion?",
            "Vocês trabalham com advogados?",
            "Como funciona a análise de evidências digitais?"
        ];
        
        // Fallback responses when API is not available
        this.fallbackResponses = {
            'redes sociais': {
                tools: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
                response: `🔍 **Ferramentas para Investigação em Redes Sociais:**

• **Instagram**: imginn, Pixwox Instagram Viewer
• **Facebook**: Who posted what?, Facebook Custom Search Engine
• **Twitter/X**: TweetMap, Social Network Visualizer
• **LinkedIn**: Busca avançada e análise de perfis
• **Múltiplas redes**: socialscan, nexfil, UserSearch.org

**Nossos serviços incluem:**
✓ Análise completa de perfis
✓ Monitoramento de atividades
✓ Coleta de evidências digitais
✓ Relatórios técnicos especializados

📱 **Precisa de uma investigação profissional?**
WhatsApp: +55 11 99294-6628`
            },
            'investigar pessoa': {
                tools: ['OSINT', 'pessoas', 'investigação'],
                response: `🕵️ **Como Investigar uma Pessoa usando OSINT:**

**1. Motores de Busca:**
• Google Advanced Search
• Bing, Yandex, Baidu
• Shodan (para dados técnicos)

**2. Redes Sociais:**
• Verificação de usernames
• Análise de posts e conexões
• Histórico de atividades

**3. Registros Públicos:**
• Documentos oficiais
• Registros empresariais
• Bases de dados governamentais

**A Scorpion Intelligence oferece:**
✓ Investigação completa e legal
✓ Relatórios detalhados
✓ Confidencialidade absoluta
✓ Expertise jurídica

📞 **Consultoria gratuita**: +55 11 99294-6628`
            },
            'custos': {
                tools: [],
                response: `💰 **Valores dos Serviços Scorpion Intelligence:**

**Consulta Inicial:** GRATUITA

**Serviços:**
• **Investigação Básica**: A partir de R$ 500
• **Análise de Redes Sociais**: A partir de R$ 300
• **Due Diligence Digital**: A partir de R$ 800
• **Monitoramento**: A partir de R$ 400/mês
• **Relatórios Técnicos**: A partir de R$ 600

*Valores podem variar conforme complexidade*

**Incluso:**
✓ Análise especializada
✓ Relatório detalhado
✓ Suporte pós-entrega
✓ Confidencialidade total

💬 **Orçamento personalizado**:
WhatsApp: +55 11 99294-6628`
            },
            'advogados': {
                tools: [],
                response: `⚖️ **Serviços Especializados para Advogados:**

**SIM! Trabalhamos exclusivamente com:**
• Escritórios de advocacia
• Departamentos jurídicos
• Advogados autônomos

**Nossos Serviços Jurídicos:**
✓ **Due Diligence Digital**
✓ **Coleta de Evidências Digitais**
✓ **Análise de Casos Complexos**
✓ **Relatórios Técnicos para Processos**
✓ **Investigação de Pessoas e Empresas**
✓ **Monitoramento de Reputação**

**Diferenciais:**
• Relatórios aceitos em tribunal
• Metodologia legal e ética
• Confidencialidade advocato-cliente
• Suporte durante o processo

⚖️ **Consultoria jurídica GRATUITA**:
WhatsApp: +55 11 99294-6628`
            },
            'evidencias': {
                tools: ['evidências', 'digitais', 'forense'],
                response: `📋 **Análise de Evidências Digitais:**

**Como Funciona:**
1. **Coleta**: Dados de redes sociais, sites, documentos
2. **Análise**: Verificação de autenticidade e contexto
3. **Documentação**: Timeline e cadeia de custódia
4. **Relatório**: Formato técnico-jurídico

**Tipos de Evidências:**
• Screenshots e capturas
• Metadados de arquivos
• Histórico de atividades
• Comunicações digitais
• Registros de IP e localização

**Ferramentas Utilizadas:**
• Wayback Machine
• Análise de metadados
• Verificação de autenticidade
• Documentação forense

**Garantimos:**
✓ Validade jurídica
✓ Cadeia de custódia
✓ Relatórios detalhados

📞 **Consultoria**: +55 11 99294-6628`
            },
            'default': {
                tools: [],
                response: `👋 **Olá! Sou o assistente da Scorpion Intelligence.**

**Especialistas em OSINT para:**
• 👨‍💼 Advogados e escritórios jurídicos
• 🏢 Empresas e corporações
• 🔍 Investigação digital profissional

**Nossos Principais Serviços:**
• Investigação de pessoas e empresas
• Monitoramento de reputação digital
• Análise de redes sociais
• Coleta de evidências digitais
• Relatórios técnicos especializados

**Base de Ferramentas:**
• 200+ ferramentas OSINT
• Acesso: [Base Completa](ferramentas-completas.html)

**Entre em Contato:**
• 💬 Chat: Pergunte aqui mesmo!
• 📱 WhatsApp: +55 11 99294-6628
• 📧 Formulário: [Enviar Email](#contact)

**Como posso ajudá-lo hoje?**`
            }
        };
        this.init();
    }

    async init() {
        await this.loadToolsDatabase();
        this.createWidget();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    async loadToolsDatabase() {
        try {
            const response = await fetch('./tools-database.json');
            if (response.ok) {
                this.toolsDatabase = await response.json();
                console.log('Base de ferramentas OSINT carregada com sucesso');
            }
        } catch (error) {
            console.warn('Não foi possível carregar a base de ferramentas:', error);
        }
    }

    initSpeech() {
        if (this.speechEnabled) {
            // Wait for voices to load
            speechSynthesis.addEventListener('voiceschanged', () => {
                const voices = speechSynthesis.getVoices();
                // Prefer Portuguese voices
                this.currentVoice = voices.find(voice => 
                    voice.lang.startsWith('pt') || voice.lang.startsWith('pt-BR')
                ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
                
                console.log('🔊 Speech synthesis initialized:', this.currentVoice?.name);
            });
        }

        if (this.speechRecognitionEnabled) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'pt-BR';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chat-input').value = transcript;
                this.stopListening();
                // Auto-send after voice input
                setTimeout(() => this.sendMessage(), 500);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
            
            console.log('🎤 Speech recognition initialized');
        }
    }

    createWidget() {
        const widgetHTML = `
            <div id="scorpion-chat-widget">
                <div id="chat-toggle" class="chat-toggle">
                    <i class="fas fa-comments"></i>
                    <div class="chat-notification">
                        <span>Precisa de ajuda com OSINT?</span>
                    </div>
                </div>
                
                <div id="chat-container" class="chat-container">
                    <div class="chat-header">
                        <div class="chat-avatar">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="chat-info">
                            <h4>Assistente Scorpion</h4>
                            <span>Especialista em OSINT • Online</span>
                        </div>
                        <button id="chat-close" class="chat-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages"></div>
                    
                    <div class="chat-input-container">
                        <div class="quick-suggestions" id="quick-suggestions" style="display: none;">
                            <div class="suggestions-title">Sugestões rápidas:</div>
                            <div class="suggestions-list" id="suggestions-list"></div>
                        </div>
                        <div class="chat-typing" id="chat-typing" style="display: none;">
                            <div class="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span>Assistente digitando...</span>
                        </div>
                        <div class="chat-input-wrapper">
                            <input type="text" id="chat-input" placeholder="Digite ou fale sua pergunta sobre OSINT..." maxlength="500">
                            <button id="chat-voice" class="chat-voice" title="Falar" style="display: none;">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button id="chat-suggestions" class="chat-suggestions" title="Ver sugestões">
                                <i class="fas fa-lightbulb"></i>
                            </button>
                            <button id="chat-send" class="chat-send">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents() {
        const toggle = document.getElementById('chat-toggle');
        const close = document.getElementById('chat-close');
        const input = document.getElementById('chat-input');
        const send = document.getElementById('chat-send');
        const suggestions = document.getElementById('chat-suggestions');
        const voice = document.getElementById('chat-voice');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.closeChat());
        send.addEventListener('click', () => this.sendMessage());
        suggestions.addEventListener('click', () => this.toggleSuggestions());
        
        if (voice) {
            voice.addEventListener('click', () => this.toggleVoiceRecognition());
        }
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Hide notification after first interaction
        toggle.addEventListener('click', () => {
            const notification = document.querySelector('.chat-notification');
            if (notification) {
                notification.style.display = 'none';
            }
        }, { once: true });

        // Setup suggestions
        this.setupSuggestions();
        
        // Show voice button if speech recognition is available
        if (this.speechRecognitionEnabled) {
            const voiceButton = document.getElementById('chat-voice');
            if (voiceButton) {
                voiceButton.style.display = 'flex';
            }
        }
    }

    toggleChat() {
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('hidden');
            document.getElementById('chat-input').focus();
        } else {
            container.classList.remove('active');
            toggle.classList.remove('hidden');
        }
    }

    closeChat() {
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        
        container.classList.remove('active');
        toggle.classList.remove('hidden');
        this.isOpen = false;
    }

    setupSuggestions() {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';
        
        this.quickSuggestions.forEach(suggestion => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.className = 'suggestion-btn';
            suggestionBtn.textContent = suggestion;
            suggestionBtn.addEventListener('click', () => {
                document.getElementById('chat-input').value = suggestion;
                this.hideSuggestions();
                this.sendMessage();
            });
            suggestionsList.appendChild(suggestionBtn);
        });
    }

    toggleSuggestions() {
        const suggestions = document.getElementById('quick-suggestions');
        const isVisible = suggestions.style.display !== 'none';
        
        if (isVisible) {
            this.hideSuggestions();
        } else {
            this.showSuggestions();
        }
    }

    showSuggestions() {
        const suggestions = document.getElementById('quick-suggestions');
        suggestions.style.display = 'block';
        
        const messages = document.getElementById('chat-messages');
        setTimeout(() => {
            messages.scrollTop = messages.scrollHeight;
        }, 100);
    }

    hideSuggestions() {
        const suggestions = document.getElementById('quick-suggestions');
        suggestions.style.display = 'none';
    }

    searchTools(query, category = null) {
        if (!this.toolsDatabase) return [];
        
        const results = [];
        const queryLower = query.toLowerCase();
        
        const searchInCategory = (tools, categoryName) => {
            tools.forEach(tool => {
                const titleMatch = tool.title.toLowerCase().includes(queryLower);
                const descMatch = tool.description.toLowerCase().includes(queryLower);
                const categoryMatch = categoryName.toLowerCase().includes(queryLower);
                
                if (titleMatch || descMatch || categoryMatch) {
                    results.push({
                        ...tool,
                        category: categoryName
                    });
                }
            });
        };
        
        Object.entries(this.toolsDatabase.toolsDatabase).forEach(([categoryName, tools]) => {
            if (!category || categoryName === category) {
                searchInCategory(tools, categoryName);
            }
        });
        
        return results.slice(0, 5); // Limit to 5 results
    }

    containsInappropriateContent(message) {
        const inappropriatePatterns = [
            /\b(hack|hacking|illegal|crack|piracy)\b/i,
            /\b(spam|scam|fraud)\b/i,
            /(\b\w*\.exe\b|\.zip|\.rar)/i,
            /\b(malware|virus|trojan)\b/i
        ];
        
        return inappropriatePatterns.some(pattern => pattern.test(message));
    }

    getFallbackResponse(message) {
        const messageLower = message.toLowerCase();
        
        // Check for specific keywords and return appropriate response
        if (messageLower.includes('redes sociais') || messageLower.includes('instagram') || messageLower.includes('facebook') || messageLower.includes('twitter') || messageLower.includes('social')) {
            return this.fallbackResponses['redes sociais'].response;
        }
        
        if (messageLower.includes('investigar') || messageLower.includes('pessoa') || messageLower.includes('buscar pessoa')) {
            return this.fallbackResponses['investigar pessoa'].response;
        }
        
        if (messageLower.includes('custo') || messageLower.includes('preço') || messageLower.includes('valor') || messageLower.includes('quanto custa')) {
            return this.fallbackResponses['custos'].response;
        }
        
        if (messageLower.includes('advogado') || messageLower.includes('jurídico') || messageLower.includes('juridico') || messageLower.includes('processo')) {
            return this.fallbackResponses['advogados'].response;
        }
        
        if (messageLower.includes('evidência') || messageLower.includes('evidencia') || messageLower.includes('prova') || messageLower.includes('forense')) {
            return this.fallbackResponses['evidencias'].response;
        }
        
        // For questions about tools, search and provide relevant tools
        if (messageLower.includes('ferramenta') || messageLower.includes('tool')) {
            const tools = this.searchTools(message);
            if (tools.length > 0) {
                let toolsResponse = `🛠️ **Ferramentas OSINT Relevantes:**\n\n`;
                tools.forEach(tool => {
                    toolsResponse += `• **${tool.title}**\n  ${tool.description}\n  🔗 [Acessar](${tool.url})\n\n`;
                });
                toolsResponse += `📚 **Ver todas as ferramentas**: [Base Completa](ferramentas-completas.html)\n\n📞 **Consultoria especializada**: +55 11 99294-6628`;
                return toolsResponse;
            }
        }
        
        // Default response
        return this.fallbackResponses['default'].response;
    }

    toggleVoiceRecognition() {
        if (!this.speechRecognitionEnabled) {
            this.addMessage('🚫 Reconhecimento de voz não disponível neste navegador.', 'bot');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition || this.isListening) return;
        
        this.isListening = true;
        const voiceButton = document.getElementById('chat-voice');
        const input = document.getElementById('chat-input');
        
        if (voiceButton) {
            voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
            voiceButton.classList.add('listening');
            voiceButton.title = 'Parar de ouvir';
        }
        
        if (input) {
            input.placeholder = 'Fale agora...';
        }
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.stopListening();
        }
    }

    stopListening() {
        this.isListening = false;
        const voiceButton = document.getElementById('chat-voice');
        const input = document.getElementById('chat-input');
        
        if (voiceButton) {
            voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceButton.classList.remove('listening');
            voiceButton.title = 'Falar';
        }
        
        if (input) {
            input.placeholder = 'Digite ou fale sua pergunta sobre OSINT...';
        }
        
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
    }

    speakMessage(text) {
        if (!this.speechEnabled || !text) return;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Clean text for speech (remove markdown and HTML)
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/<[^>]*>/g, '')
            .replace(/[🔍👋📱💰⚖️📋🛠️💬📞🎤🔊]/g, '')
            .replace(/https?:\/\/[^\s]+/g, '')
            .trim();
        
        if (cleanText.length > 300) {
            // Truncate long messages for speech
            const truncated = cleanText.substring(0, 300) + '... Para mais detalhes, leia a mensagem completa.';
            this.createSpeech(truncated);
        } else {
            this.createSpeech(cleanText);
        }
    }

    createSpeech(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.currentVoice;
        utterance.rate = this.speechRate;
        utterance.pitch = this.speechPitch;
        utterance.volume = 0.8;
        
        speechSynthesis.speak(utterance);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            let voiceFeatures = '';
            if (this.speechRecognitionEnabled || this.speechEnabled) {
                const features = [];
                if (this.speechRecognitionEnabled) features.push('🎤 Fale comigo');
                if (this.speechEnabled) features.push('🔊 Ouça as respostas');
                voiceFeatures = `\n\n**Recursos de voz disponíveis:**\n• ${features.join('\n• ')}`;
            }
            
            const welcomeMessage = `
                👋 Olá! Sou o assistente da **Scorpion Intelligence**.
                
                Estou aqui para ajudar com suas dúvidas sobre:
                • 🔍 Investigação OSINT
                • 🛠️ Ferramentas especializadas
                • 📊 Nossos serviços
                • ⚖️ Consultoria para advogados${voiceFeatures}
                
                **Como posso ajudá-lo hoje?**
            `;
            this.addMessage(welcomeMessage, 'bot');
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Rate limiting
        const now = Date.now();
        if (now - this.lastMessageTime < this.minMessageInterval) {
            this.addMessage('Por favor, aguarde um momento antes de enviar outra mensagem.', 'bot');
            return;
        }
        
        // Message count limit
        if (this.messageCount >= this.maxMessagesPerSession) {
            this.addMessage('Você atingiu o limite de mensagens desta sessão. Para continuar, entre em contato diretamente pelo WhatsApp: +55 11 99294-6628', 'bot');
            return;
        }
        
        // Input validation
        if (message.length > 500) {
            this.addMessage('Sua mensagem é muito longa. Por favor, seja mais conciso.', 'bot');
            return;
        }
        
        // Basic security check
        if (this.containsInappropriateContent(message)) {
            this.addMessage('Por favor, mantenha uma conversa profissional. Como posso ajudá-lo com questões sobre OSINT?', 'bot');
            return;
        }
        
        this.lastMessageTime = now;
        this.messageCount++;
        
        this.addMessage(message, 'user');
        input.value = '';
        
        this.showTyping();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTyping();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTyping();
            
            if (error.message === 'API_LIMIT_EXCEEDED') {
                // Use fallback response instead of just showing error
                const fallbackResponse = this.getFallbackResponse(message);
                this.addMessage(fallbackResponse, 'bot');
                
                // Show a brief note about temporary API limitation
                setTimeout(() => {
                    this.addMessage(`🔄 *Resposta via base de conhecimento local - API temporariamente indisponível*`, 'bot');
                }, 1000);
            } else {
                // For other errors, show generic message
                const errorMessage = 'Desculpe, ocorreu um erro. Por favor, entre em contato diretamente conosco pelo WhatsApp: +55 11 99294-6628';
                this.addMessage(errorMessage, 'bot');
            }
            
            console.error('Chat error:', error);
        }
    }

    async getAIResponse(userMessage) {
        // Search for relevant tools based on user message
        const relevantTools = this.searchTools(userMessage);
        let toolsContext = '';
        
        if (relevantTools.length > 0) {
            toolsContext = `
        FERRAMENTAS OSINT DISPONÍVEIS (relacionadas à consulta):
        ${relevantTools.map(tool => `
        - **${tool.title}** (${tool.category})
          ${tool.description}
          Link: ${tool.url}`).join('')}
        `;
        }

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 messages for context
        if (this.conversationHistory.length > 10) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }

        const systemPrompt = `
        Você é o assistente virtual especializado da Scorpion Intelligence, uma empresa líder em OSINT (Open Source Intelligence) para advogados e empresas.

        INFORMAÇÕES DA EMPRESA:
        - Nome: Scorpion Intelligence (Like Look Solutions)
        - CNPJ: 36.992.198/0001-84
        - Especialidade: Investigação digital, OSINT, inteligência cibernética
        - Público-alvo: Advogados, escritórios jurídicos, empresas
        - Contato: juliocamposmachado@gmail.com, WhatsApp: +55 11 99294-6628
        - Website: https://scorpion-intelligence.vercel.app
        
        SERVIÇOS PRINCIPAIS:
        1. 🔍 Investigação OSINT Completa
        2. 📊 Monitoramento de Reputação Digital
        3. 🔗 Análise de Redes Sociais
        4. 📜 Coleta de Evidências Digitais
        5. 📄 Relatórios Técnicos Especializados
        6. 🔒 Consultoria em Segurança Digital
        
        BASE DE FERRAMENTAS OSINT:
        Temos acesso a mais de 200 ferramentas especializadas organizadas em categorias:
        - Motores de Busca (31 ferramentas)
        - Redes Sociais (28 plataformas) 
        - Ferramentas de Redes Sociais (42 ferramentas)
        - Rastreamento (16 ferramentas)
        - Web3 e Blockchain (6 ferramentas)
        - Tradução (3 ferramentas)
        - Bandeiras, Símbolos e Tatuagens (9 ferramentas)
        ${toolsContext}
        
        INSTRUÇÕES ESPECIAIS:
        - Seja um especialista em OSINT prestativo e profissional
        - Responda com expertise técnica mas linguagem acessível
        - SEMPRE recomende ferramentas específicas quando relevante
        - Inclua links diretos para ferramentas mencionadas
        - Ofereça consultoria gratuita para casos complexos
        - Use emojis profissionais moderadamente
        - Se a pergunta for sobre ferramentas OSINT, seja muito específico
        - Promova nossos serviços especializados naturalmente
        - Formate respostas em markdown para melhor legibilidade
        
        ESTILO DE RESPOSTA:
        - Seja direto e informativo
        - Inclua exemplos práticos quando possível
        - Termine sempre com uma chamada para ação relevante
        
        Responda à pergunta do usuário fornecendo informações valiosas sobre OSINT e conectando com nossos serviços.
        `;

        const payload = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nPergunta do usuário: ${userMessage}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': this.API_KEY
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('API_LIMIT_EXCEEDED');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    addMessage(content, type) {
        const messages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (type === 'bot') {
            const speakButton = this.speechEnabled ? 
                `<button class="message-speak" onclick="scorpionAssistant.speakMessage('${content.replace(/'/g, "\\'")}')"><i class="fas fa-volume-up"></i></button>` : '';
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-search"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${this.formatMessage(content)}</div>
                    <div class="message-actions">
                        <div class="message-time">${timestamp}</div>
                        ${speakButton}
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${content}</div>
                    <div class="message-time">${timestamp}</div>
                </div>
            `;
        }
        
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    formatMessage(text) {
        // Convert markdown-style formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '•')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    showTyping() {
        const typing = document.getElementById('chat-typing');
        typing.style.display = 'flex';
        this.isTyping = true;
        
        const messages = document.getElementById('chat-messages');
        messages.scrollTop = messages.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('chat-typing');
        typing.style.display = 'none';
        this.isTyping = false;
    }
}

// Initialize the assistant when DOM is loaded
let scorpionAssistant;

document.addEventListener('DOMContentLoaded', () => {
    scorpionAssistant = new ScorpionAssistant();
    window.scorpionAssistant = scorpionAssistant; // Global reference for onclick
});
