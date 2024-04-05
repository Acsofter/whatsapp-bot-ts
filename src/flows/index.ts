import { createFlow } from "@builderbot/bot";
import infoFlow from "./info";
import openAI from "./openAI";
import _EVENTS from "./EVENTS";
import geminiAI from "./geminiAI";
import contactFlow from "./contact";
import ollamaAI from "./ollamaAI";

export default createFlow([
  openAI,
  infoFlow,
  geminiAI,
  contactFlow,
  ollamaAI,
  ..._EVENTS,
]);
