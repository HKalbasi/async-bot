import childProcess from "child_process";
import { promisify } from "util";
import Sound from "node-aplay";

const exec = promisify(childProcess.exec);

export const speakCtx = {
  sendMsg: async (msg) => {
    await exec(`espeak -v fa -w /tmp/boz.wav "${msg}"`);
    const music = new Sound('/tmp/boz.wav');
    music.play();
    await new Promise((res) => music.on('complete', () => res()));
  },
  receiveMsg: async () => {
    const { value, done } = await it.next();
    if (done) process.exit(0); 
    return value;
  },
};
