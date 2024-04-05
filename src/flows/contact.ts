import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

export default addKeyword<Provider, Database>(EVENTS.ACTION).addAction(
  async (MsgContext, { provider }) => {
    const number: string = MsgContext.key.remoteJid;
    const vcard =
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      "FN: Representante Viznex AI\n" +
      "ORG: Vixnex AI;\n" +
      "EMAIL;TYPE=internet:representante@viznex.com\n" +
      "URL:http://www.viznex.tech\n" +
      `TEL;type=CELL;type=VOICE;waid=18293163145:18293163145\n` +
      "END: VCARD";
    await provider.vendor.sendMessage(number, {
      contacts: {
        displayName: "Gabriel Echavarria",
        contacts: [{ vcard }],
      },
    });
  }
);
