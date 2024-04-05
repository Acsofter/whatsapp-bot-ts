import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

export default addKeyword<Provider, Database>(EVENTS.VOICE_NOTE).addAnswer(
  "Aun no puedo escuchar audios 😞"
);
