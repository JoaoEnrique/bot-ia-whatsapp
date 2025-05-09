import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import 'dotenv/config';
import fetch from 'node-fetch';
import { AI_API_URL, CREATOR, LINKS, LINKS_TEXT, OFFICIAL_PROFILES, TECNOLOGIES } from './vars';
import { isAboutCreator, isAboutLinks, isAboutOneLink, isAboutprofiles, isAboutTecnologies, isHelloMessgae } from './context_verification';
import express from "express"


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});
client.on('qr', (qr: string) => {
    QRCode.toDataURL(qr, function (err: any, url) {
        console.log("Abra esse link no navegador para escanear o QR:");
        console.log(url); // ou exiba em uma página
    });
});

client.on('ready', () => {
    console.log('Bot está pronto!');
});

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

        // Handle other message types...

        else {
            const response = await processarComIA(msg.body, firstName);
            await msg.reply(response);
        }
    } catch (err) {
        console.error("Erro ao processar mensagem:", err);
        await msg.reply("⚠️ Ocorreu um erro ao processar sua mensagem.");
    }
});

async function processarComIA(text: string, name: string): Promise<string> {
    const controller = new AbortController();
    const response = await fetch(`${AI_API_URL}/chat`, {
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

    return await response.text();
}




const app = express(); // Inicializando o aplicativo Express
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    client.initialize();
    console.log(`Servidor rodando em ${PORT}`);
});
