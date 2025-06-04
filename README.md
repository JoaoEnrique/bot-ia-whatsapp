# Chat com IA para WhatsAPP
Chat de IA utilizando Ollama localmente com Python para responder perguntas de uma rede socia pelo WhatsApp no número: +55 11 98595-6209

## Converse com: +55 11 98595-6209
Para usar, basta iniciar uma conversa com: https://wa.me/5511985956209

## Backend
Baixe o backend em: https://github.com/JoaoEnrique/chat-inteligencia-artificial

![image](https://github.com/user-attachments/assets/5105de0d-caaa-487e-a281-1712b086f5e6)

## Tecnologias Utilizadas
- **Node com TypeScript**: Integração com WhatsApp
- **FastAPI**: Framework para a criação da API de validação
- **Ollama**: IA utilizada para analisar o conteúdo dos posts
- **gemma**: Modelo de IA performatico
- **Python**: Linguagem de programação principal do projeto

## Como Funciona
1. Ao enviar uma mensagem no número, a IA irá responder.

## Instalação e Execução

1. Clone este repositório:
   ```sh
   git clone https://github.com/JoaoEnrique/bot-ia-whatsapp
   cd bot-ia-whatsapp
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o backend, leia a documentação em: https://github.com/JoaoEnrique/chat-inteligencia-artificial
   ```sh
   git clone https://github.com/JoaoEnrique/chat-inteligencia-artificial
   cd chat-inteligencia-artificial
   ```
4. Execute o projeto:
   ```sh
   npm run dev
   ```
5. Configure o ambiente
    ```
    AI_API_URL=http://localhost:8082

    LINK="https://pacoca.net"
    READ_BOOKS="https://readbooks.site"
    DISCORD="https://discord.com/invite/vJjGNcjKpj"

    ```

6. Configure o WhatsAP

    Irá aparecer um QrCode para ser escaneado no seu WhatsApp e ao configurar, o bot irá responder mensagens enviadas para seu número de telefone



## Recebe mensagens d usuário
```js
client.on('message', async (msg: Message) => {
    try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const name = contact.pushname || 'Usuário';
        const firstName = name.split(" ")[0];

        await chat.sendStateTyping();

        if (isHelloMessgae(msg.body) && msg.from.endsWith('@c.us')) {
            await client.sendMessage(msg.from, `Olá! ${firstName}! \nSou o Paçoca AI, como posso te ajudar hoje?`);
        } 


        // Verifica se a mensagem contém alguma das palavras-chave para links
        else if (isAboutOneLink(msg)) {
            const message = msg.body.toLowerCase();
            const linkKey = Object.keys(LINKS).find((key) =>
                message.includes(key.toLowerCase())
            );

            if (linkKey) {
                await client.sendMessage(msg.from, `Aqui está ${linkKey}: ${LINKS[linkKey as keyof typeof LINKS]}`);
            } 
        }
        // Verifica se a mensagem contém alguma das palavras-chave para perfis oficiais
        else if (isAboutprofiles(msg)) {
            const message = msg.body.toLowerCase();
            const profileKey = Object.keys(OFFICIAL_PROFILES).find((key) =>
                message.includes(key.toLowerCase())
            );

            if (profileKey) {
                await client.sendMessage(msg.from, `Aqui está o link do ${profileKey}: ${OFFICIAL_PROFILES[profileKey as keyof typeof OFFICIAL_PROFILES]}`);
            }
        }
    
        // tecnologias
        else if (isAboutTecnologies(msg)) {
            await client.sendMessage(msg.from, TECNOLOGIES);
        }

        // criador
        else if (isAboutCreator(msg)) {
            await client.sendMessage(msg.from, CREATOR);
        }
        
        // links
        else if (isAboutLinks(msg)) {
            await client.sendMessage(msg.from, LINKS_TEXT);
        }

        else {
            const response = await processarComIA(msg.body, firstName);
            await msg.reply(response);
        }
    } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        await msg.reply("⚠️ Ocorreu um erro ao processar sua mensagem.");
    }
});
```

## Faz requisição para BackEnd (IA)
```js
async function processarComIA(text: string, name: string): Promise<string> {
    const controller = new AbortController();

    const response: any = await fetch(`${AI_API_URL}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain"
        },
        signal: controller.signal,
        body: JSON.stringify({ content: text, user: { name } })
    });

    if (!response.ok || !response.body) {
        let errorText = `Erro ${response.status}`;
        
        try {
            const errorJson: any = await response.json();
            if (errorJson && typeof errorJson === 'object') {
                errorText += `: ${errorJson['detail'] || "Erro desconhecido"}`;
            } else {
                errorText += ": Erro ao processar a resposta";
            }
        } catch (error) {
            errorText += ": Erro ao tentar processar a resposta JSON";
        }

        throw new Error(errorText);
    }

    const finalText = await response.text();
    return finalText;
}
```

```
## Licença
Este projeto está licenciado sob a [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.pt_BR).  
Você pode copiar, modificar e redistribuir para fins **não comerciais**, desde que atribua os créditos ao autor original.
