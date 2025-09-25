import os from "os";
import v8 from "v8";
import { ICommand } from "../common/interface";
import { sendReply } from "../common/utils/message";
// import fetch from "node-fetch"; // Se Node < 18

const formatSize = (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`;

const runtime = (seconds: number) => {
  seconds = Math.round(seconds);
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds %= 3600;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${days}d ${hrs}h ${mins}m ${secs}s`;
};

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  return await res.json();
};

const ping: ICommand = {
  name: "ping",
  help: "",
  category: "basicos",
  async execute(ctx, msg) {
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.values(cpu.times).reduce((acc, t) => acc + t, 0);
      return cpu;
    });

    const cpu = cpus.reduce(
      (last, cpu) => {
        last.total += cpu.total;
        last.speed += cpu.speed;
        last.times.user += cpu.times.user;
        last.times.nice += cpu.times.nice;
        last.times.sys += cpu.times.sys;
        last.times.irq += cpu.times.irq;
        last.times.idle += cpu.times.idle;
        return last;
      },
      {
        speed: 0,
        total: 0,
        times: { user: 0, nice: 0, sys: 0, irq: 0, idle: 0 },
      }
    );

    const myip = await fetchJson("https://ipinfo.io/json");

    function hideIp(ip: string) {
      if (ip.includes(".")) {
        const ipSegments = ip.split(".");
        ipSegments[2] = "***";
        ipSegments[3] = "***";
        return ipSegments.join(".");
      }
      return ip;
    }

    const ips = hideIp(myip.ip);
    const timestamp = Number(msg.messageTimestamp) * 1000;
    const rspTimeInSeconds = (Date.now() - timestamp) / 1000;
    const resp = `${rspTimeInSeconds.toFixed(3)} Segundo${
      rspTimeInSeconds !== 1 ? "s" : ""
    }`;

    const txt = `\`INFO BOT\`
- Speed Respons: _${resp}_
- Hostname: ${os.hostname()}
- CPU Core: ${cpus.length}
- Plataform: ${os.platform()}
- OS: ${os.version()} / ${os.release()}

- IP: ${ips}
- Region: ${myip.region} ${myip.country}

Runtime: ${runtime(process.uptime())}`;

    await sendReply(ctx, txt, msg);
  },
};

export default ping;