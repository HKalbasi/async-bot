import botSDK from "telegram-bot-api";
import rxjs from "../rxjs.cjs";
import rxfor from "rxjs-for-await";

const { eachValueFrom } = rxfor;

const { Observable, groupBy } = rxjs;

export const registerTelegramBot = async (bot, {
  token,
}) => {
  const client = new botSDK({
    token,
  });
  client.setMessageProvider(new botSDK.GetUpdateMessageProvider());
  await client.start();
  const stream = Observable.create((observer) => {
    // This is our event handler for dealing with the `!hello` command.
    client.on("update", async (update) => {
      if (!update.message) return;
      const { message } = update;
      if (!message.text) return;
      observer.next({
        roomId: message.chat.id,
        body: message.text,
      });
    });
  });
  stream.pipe(groupBy((x) => x.roomId)).subscribe(async (x) => {
    const id = x.key;
    const it = eachValueFrom(x)[Symbol.asyncIterator]()
    const telegramCtx = {
      sendMsg: (body) => client.sendMessage(id, body),
      receiveMsg: async () => {
        const { value, done } = await it.next();
        if (done) process.exit(0); 
        return value.body;
      },
    }
    bot(telegramCtx);
  });
};
