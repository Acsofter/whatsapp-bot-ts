import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
// import { downloadMediaMessage } from "@whiskeysockets/baileys";
// import webp from 'webp-converter';
import fs from "fs";

export default addKeyword<Provider, Database>(EVENTS.MEDIA).addAction(
  async (MsgContext, { provider, flowDynamic }) => {
    if (MsgContext.message.stickerMessage !== null){
        return
    }
    const savedPathMediaFile = await provider.saveFile(MsgContext, {
      path: "././src/media",
    });

    console.log('message: ', MsgContext.message.imageMessage.caption )

    await provider.sendSticker(
     MsgContext.key.remoteJid,
      `${savedPathMediaFile}`,
      {
        pack: ` sticker's`,
        author: "Thebotx",
      }
    );

    // const [filename, ext] = savedPathMediaFile
    //   .split("\\", -1)
    //   .slice(-1)[0]
    //   .split(".");

    // const result = webp.cwebp(
    //   `././${savedPathMediaFile}`,
    //   `././src/media/${filename}.webp`,
    //   "-q 80"
    // );

    // result.then((response) => {
    //   console.log(response);
    // });

    // fs.unlink(`././${savedPathMediaFile}`, (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    // });

    await flowDynamic("Aqui te dejo tu sticker 😌");
  }
);
