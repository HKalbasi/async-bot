import { registerConsoleBot } from "./back/console.mjs";
import { registerMatrixBot } from "./back/matrix.mjs";
import { registerTelegramBot } from "./back/telegram.mjs";
import { receiveMsg } from "./core.mjs";
import { sendMsg } from "./core.mjs";

export {
  sendMsg,
  receiveMsg,
  registerConsoleBot,
  registerMatrixBot,
  registerTelegramBot,    
};