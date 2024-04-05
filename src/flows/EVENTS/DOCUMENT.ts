import fs from "fs/promises";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import path from "path";
import geminiAI from "../geminiAI";
import documentsApi from "../../services/DocumentsAPI";
import { fileFromPath } from "openai";

const documentsFolder = (dirs: string[] = []) =>
  path.join(process.cwd(), "documents", ...dirs);

export default addKeyword<Provider, Database>(EVENTS.DOCUMENT)
  .addAnswer([
    "Ahora se abrira una sesion de preguntas acerca de tu documento!",
    "",
    "Puedes avisarme cuando quieras cancelar o cerrar la sesion de preguntas.",
  ])
  .addAction(async (MsgContext, { provider, gotoFlow, endFlow }) => {
    const { mimetype, _ } = MsgContext.message.documentMessage;
    if (!["application/pdf"].includes(mimetype))
      return endFlow("Archivo no compatible");

    const localPathFile = await provider.saveFile(MsgContext, {
      path: "././documents",
    });

    // const localFilename = path.parse(localPathFile).base;
    const id: string = MsgContext.key.remoteJid;
    try {
      const res = await documentsApi.get_text_from_pdf(localPathFile);
      if (res) {
        fs.writeFile(
          documentsFolder([`${id}.txt`]), //`${localFilename.split(".")[0]}.txt`
          res,
          { encoding: "utf8", flag: "w" }
        );
      }
      return gotoFlow(geminiAI);
    } catch (error) {
      return endFlow("Error con el servidor de archivos");
    }
  });
