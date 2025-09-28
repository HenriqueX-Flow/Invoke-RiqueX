// index.ts (na raiz do projeto, fora do src)
import { spawn, ChildProcess } from "child_process";

let botProcess: ChildProcess | null = null;

function startBot() {
  if (botProcess) return console.log("⚠️ Bot já está rodando!");

  botProcess = spawn("ts-node", ["src/index.ts"], {
    stdio: "inherit",
    shell: true,
  });

  botProcess.on("exit", (code) => {
    console.log(`❌ Bot finalizado com código: ${code}`);
    botProcess = null;
  });
}

function stopBot() {
  if (!botProcess) return console.log("⚠️ Bot não está rodando!");
  botProcess.kill("SIGTERM");
  botProcess = null;
  console.log("🛑 Bot parado.");
}

function restartBot() {
  if (!botProcess) return startBot();
  stopBot();
  setTimeout(startBot, 1000);
}

// Auto-start quando rodar o gerenciador
startBot();

// Capturar sinais do terminal
process.on("SIGINT", () => {
  stopBot();
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
  restartBot();
});