> [!IMPORTANT]
> Invoke RiqueX Não É Um Bot Completo E Sim Uma Base Pra Quem Não Queira Iniciar Do Zero.
> Invoke RiqueX Pode Ter Erros.

> [!NOTE]
> Invoke RiqueX É Para Todos, Não Está À Venda. Se Você Vendê-lo, O Inferno Te Espera.

> [!CAUTION]
> Este Projeto Não Possui Qualquer Vínculo Oficial Com O WhatsApp. Ele Foi Desenvolvido De Forma Independente Para Interações Automatizada Por Meio Da Plataforma.
>
> Não Nos Responsabilizamos Por Qualquer Uso Indevido Deste Projeto, É De Responsabilidade Exclusiva Do Usuário Garantir Que Sua Utilização Esteja Em Conformidade Com Os Termos De Uso Do WhatsApp E A Legislação Vigente.

<p align="center">
<img src="./media/doc.jpg" width="35%" style="margin-left": auto;margin-right: auto;display: block;">
</p>
<h1 align="center">HenriqueX Flow</h1>

# Tecnologias Utilizadas:

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

---

# Instalando Algumas Dependências Iniciais

```bash
# Ffmpeg Necessário Pra Fazer Figurinha
apt install ffmpeg
# NodeJs Necessário Pra Rodar O Bot
apt install nodejs-lts
```

## Iniciar O Bot Em Modo Desenvolvimento

```bash
# Clone O Repositório
git clone https://github.com/HenriqueX-Flow/Invoke-RiqueX.git
# Acessar A Pasta Do Bot
cd Invoke-RiqueX

# Instale As Dependências
npm install

# Inicie O Bot
npm run dev
```

### Rodando Em No Modo Produção

```bash
# Clone O Repositório
git clone https://github.com/HenriqueX-Flow/Invoke-RiqueX.git
# Acessa A Pasta Do Bot
cd Invoke-RiqueX

# Instale As Dependências
npm install

# Faça A Compilação
npm run build

# Inicie O Bot
npm start
```

---

## 📦 Dependências Principais

- baileys
- typescript
- pino
- qrcode-terminal
- @mengkodingan/consolefy

Veja O [package.json](https://github.com/HenriqueX-Flow/Invoke-RiqueX/blob/main/package.json) Para A Lista Completa.

---

> [!TIP]
> **Para Criar Comandos Navegure Até src/commands E Crie Seus Comandos Veja O Exemplo Abaixo**

```typescript
import { ICommand } from "../common/interface";

const mycmd: ICommand = {
    name: "newcmd", // Nome Do Comando.
    help: "<newcmd>", // Descrição Do Comando.
    category: "basicos", // Categoria Do Comando.
    intro: true, // Intro Automatizada Após Usar O Comando.
    usage: "Apenas Uma Comando Simples" // Explique Como Usar Seu Cmd.
    aliases: ["meucmd", "mycmd"], // Aliases Para Seu Comando.
    async execute(ctx, msg, args) {
        const jid = msg.key.remoteJid!; /* Jid Do Chat A Ser Enviado. */

        const subcmd = args.join(" "); /* Exemplos */

        await ctx.socket.sendMessage(jid, {
            text: "Oi"
            }, { quoted: msg });
    }
}

export default mycmd;
```

---

## 📝 Licença

MIT

---
