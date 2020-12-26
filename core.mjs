export const sendMsg = async (ctx, msg) => {
  return ctx.sendMsg(msg);
};

export const receiveMsg = async (ctx) => {
  return ctx.receiveMsg();
};
