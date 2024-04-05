import { addKeyword, EVENTS } from "@builderbot/bot";
import { Content } from "@google/generative-ai/dist/types/content";
import { Gemini } from "../services/gemini";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import path from "path";
import fs from "fs/promises";

const documentsFolder = (dirs: string[] = []) =>
  path.join(process.cwd(), "documents", ...dirs);

export default addKeyword<Provider, Database>(EVENTS.ACTION).addAction(
  { capture: true },
  async (MsgContext, { flowDynamic, state, provider, fallBack, endFlow }) => {
    const geminiHistory = (state.getMyState()?.geminiHistory ??
      []) as Content[];

    const id: string = MsgContext.key.remoteJid;

    provider.sendPresenceUpdate(id, "composing");

    // const username = message.pushName ?? "";
    const data = await fs.readFile(`${documentsFolder([id])}.txt`, "utf-8");
    const documentText = data.replace(/\n+/g, "\n").trim();
    const ai = await Gemini.run(documentText, geminiHistory, MsgContext.body);

    if (ai == "CANCELAR") {
      return endFlow("A la orden, sesion de preguntas cerrada! ");
    }

    geminiHistory.push({
      role: "user",
      parts: [{ text: MsgContext.body }],
    });

    console.log('geminiHistory: ', geminiHistory)

    const responses = ai.split(/(?<!\d)\.\s+/g);
    console.log('responses', responses)

    for (const resp of responses) {
      await flowDynamic(resp);
    }

    geminiHistory.push({
      role: "model",
      parts: [{ text: ai }],
    });

    await state.update({
      geminiHistory: geminiHistory,
    });
    return fallBack();
  }
);
