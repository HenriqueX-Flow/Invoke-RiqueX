import axios from "axios";
import { ICommand } from "../common/interface";
import { sendReply } from "../common/utils/message";

const simi: ICommand = {
  name: "simi",
  help: "[msg]",
  category: "basicos",
  async execute(ctx, msg, args) {
    const text = args.join(" ");

    if (!text) {
      await sendReply(ctx, "Coloque a mensagem!", msg);
      return;
    }

    const data = new URLSearchParams();
    data.append("text", text);
    data.append("lc", "pt");

    const config = {
      method: "post",
      url: "https://simsimi.vn/web/simtalk",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
      },
      data
    };

    try {
      const { data: result } = await axios(config);

      // A resposta costuma vir em `result.success` ou `result.msg`
      const reply = result.success || result.msg || "⚠️ Não obtive resposta.";

      await sendReply(ctx, reply, msg);
    } catch (e) {
      await sendReply(ctx, "❌ Erro ao falar com o SimSimi.", msg);
      console.error("Erro SimSimi:", e);
    }
  }
};

export default simi;