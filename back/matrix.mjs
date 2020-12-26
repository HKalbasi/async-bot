import botSDK from "matrix-bot-sdk";
import rxjs from "../rxjs.cjs";
import rxfor from "rxjs-for-await";

const { eachValueFrom } = rxfor;

const { Observable, groupBy } = rxjs;

const {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  RichReply,
} = botSDK;

export const registerMatrixBot = async (bot, {
  homeserverUrl,
  accessToken,
  storage,
}) => {
  const client = new MatrixClient(
    homeserverUrl, accessToken,
    new SimpleFsStorageProvider(storage)
  );
  AutojoinRoomsMixin.setupOnClient(client);
  await client.start();
  const stream = Observable.create((observer) => {
    // This is our event handler for dealing with the `!hello` command.
    client.on("room.message", async (roomId, event) => {
      // Don't handle events that don't have contents (they were probably redacted)
      if (!event["content"]) return;

      // Don't handle non-text events
      if (event["content"]["msgtype"] !== "m.text") return;

      // We never send `m.text` messages so this isn't required, however this is
      // how you would filter out events sent by the bot itself.
      if (event["sender"] === await client.getUserId()) return;

      // Make sure that the event looks like a command we're expecting
      const body = event["content"]["body"];
      if (!body) return;
      observer.next({
        roomId,
        sender: event.sender,
        body,
      });
    });
  });
  stream.pipe(groupBy((x) => x.roomId)).subscribe(async (x) => {
    const id = x.key;
    const it = eachValueFrom(x)[Symbol.asyncIterator]()
    const matrixCtx = {
      sendMsg: (body) => client.sendMessage(id, { msgtype: 'm.text', body }),
      receiveMsg: async () => {
        const { value, done } = await it.next();
        if (done) process.exit(0); 
        return value.body;
      },
    }
    bot(matrixCtx);
  });
};
