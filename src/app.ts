import "dotenv/config";
import { createBot, createProvider } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import Flows from "./flows";

class WhatsAppBot {
  adapterDB: any;
  adapterProvider: any;
  adapterFlow: any;
  botname: string;
  PORT: number | string;

  constructor() {
    this.adapterDB = new Database();
    this.adapterProvider = createProvider(Provider);
    this.adapterFlow = Flows;
    this.botname = "botanme";
    this.PORT = process.env.PORT ?? 3008;
  }

  getDBAdapter() {
    return this.adapterDB;
  }

  getFlowAdapter() {
    return this.adapterFlow;
  }

  getProviderAdapter() {
    return this.adapterProvider;
  }

  async start() {
    const { handleCtx, httpServer } = await createBot({
      provider: this.getProviderAdapter(),
      database: this.getDBAdapter(),
      flow: this.getFlowAdapter(),
    });
    httpServer(+this.PORT);
  }
}

const bot = new WhatsAppBot();
bot.start();
