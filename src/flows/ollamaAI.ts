import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import llama2 from "src/services/llama2";

export default addKeyword<Provider, Database>(["llama2"]).addAction(
  async (MsgContext, { flowDynamic, state, provider, fallBack, endFlow }) => {
    const question = MsgContext.body.toLowerCase().replace("llama2", "");
    console.log("question: ", question);
    const result = await llama2.run(question);
    await flowDynamic(result);
  }
);
