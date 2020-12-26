import { sendMsg, receiveMsg } from "../index.mjs";

const tokenize = (x) => x.split(' ').filter((y) => [
  'از', 'را', 'به', 'من', 'برای',
].indexOf(y) === -1);

const sefareshTak = async (ctx, orders) => {
  const r = await receiveMsg(ctx);
  const t = tokenize(r);
  if (t.includes('پیتزا')) {
    orders.push({ type: 'pizza' });
    await sendMsg(ctx, 'یه پیتزا، دیگه؟');
    return false;
  }
  return true;
};

const affirm = async (ctx) => {
  const t = await receiveMsg(ctx);
  const yes = [
    'بله',
    'آره',
    'درسته',
    'حله',
    'ممنونم',
    'ممنون',
    'مرسی',
  ];
  const no = [
    'خیر',
    'نه',
    'غلطه',
    'نوچ',
    'غلط',
  ];
  if (yes.includes(t)) return true;
  if (no.includes(t)) return false;
};

const sefaresh = async (ctx) => {
  const orders = [];
  while (true) {
    const finished = await sefareshTak(ctx, orders);
    if (finished) break;
  }
  await sendMsg(ctx, `پس شد ${orders.length} تا پیتزا. درسته؟`);
  if (await affirm(ctx)) {
    await sendMsg(ctx, `شما میز ۵ هستید. بفرمایید صندوق حساب کنید.`);
    return orders;
  }
  return sefaresh(ctx);
};

export const sefareshGirBot = async (ctx) => {
  while (true) {
    await sendMsg(ctx, 'سلام. سفارشتون رو بفرمایید.');
    await sefaresh(ctx);  
  }
};
