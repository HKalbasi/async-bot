import readline from "readline";

export const registerConsoleBot = (bot) => {
  const rl = readline.createInterface({
    input: process.stdin, //or fileStream 
    output: process.stdout
  });
  const it = rl[Symbol.asyncIterator]();
  const consoleCtx = {
    sendMsg: (msg) => console.log(msg),
    receiveMsg: async () => {
      const { value, done } = await it.next();
      if (done) process.exit(0); 
      return value;
    },
  };
  bot(consoleCtx);
};

