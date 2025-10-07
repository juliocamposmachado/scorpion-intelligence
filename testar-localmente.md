# 🚀 Como Testar o Assistente Localmente

## Método 1: Servidor HTTP Simples (Python)

Se você tem Python instalado:

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x (se necessário)
python -m SimpleHTTPServer 8000
```

Depois acesse: `http://localhost:8000`

## Método 2: Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique direito em `index.html` 
3. Selecione "Open with Live Server"

## Método 3: Servidor Node.js

```bash
npx serve .
```

## Método 4: PHP (se disponível)

```bash
php -S localhost:8000
```

## 🎯 Páginas para Testar:

1. **index.html** - Página principal com assistente integrado
2. **teste-assistente.html** - Página dedicada para testes
3. **ferramentas.html** - Stack de ferramentas
4. **ferramentas-completas.html** - Base completa

## ✅ O que Testar:

1. **Chat Widget** aparece no canto inferior direito
2. **Botão de sugestões (💡)** funciona
3. **Perguntas sobre OSINT** recebem respostas especializadas
4. **Ferramentas são sugeridas** automaticamente
5. **Rate limiting** funciona após muitas mensagens
6. **Design responsivo** em diferentes tamanhos de tela

## 🔧 Troubleshooting:

### Se o assistente não aparece:
- Verifique se os arquivos CSS e JS estão carregando
- Abra o console do navegador (F12) e veja se há erros

### Se a API não responde:
- Verifique sua conexão com a internet
- A chave da API Gemini pode ter limitações de uso

### CORS Issues:
- Use sempre um servidor HTTP, não abra arquivos diretamente no navegador
- O `file://` protocol não funcionará para carregar o JSON das ferramentas

🎉 **Divirta-se testando!**