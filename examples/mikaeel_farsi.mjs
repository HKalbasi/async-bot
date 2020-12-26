import { sendMsg, receiveMsg } from "../index.mjs";

const questions = [
  {
    type: 'testi',
    text: 'سوال ۱',
    options: ['گزینه ۱', 'گزینه ۲'],
    answer: 0,
  },
  {
    type: 'tashrihi',
    text: 'این متن راجع به کیست',
    answer: 'سربازی',
  },
];

const quizSoal = async (ctx, q) => {
  await sendMsg(ctx, q.text);
  const check = (r) => {
    if (q.type == 'tashrihi') {
      return r === q.answer;
    } else {
      console.log(r, q.options.indexOf(r));
      return q.options.indexOf(r) === q.answer;
    }
  };
  let score = 40;
  while (true) {
    if (check(await receiveMsg(ctx))) {
      await sendMsg(ctx, 'ماشالله ماشالله');
      return score;
    }
    await sendMsg(ctx, 'عجب خری هستی. امتیازت دو تا کم شد.');
    score -= 2;
  }
};

const ask = async (ctx, q) => {
  await sendMsg(ctx, q);
  return receiveMsg(ctx);
};

const botSession = async (ctx) => {
  if (await ask(ctx, 'دانش آموزی یا ادمینی؟') !== 'ادمینم') {
    const name = await ask(ctx, 'اسمت چیه؟');
    let score = 0;
    for (const q of questions) {
      score += await quizSoal(ctx, q);
    }
    await sendMsg(ctx, `آهای ${name} امتیازت شد ${score}`);
  } else {
    await ask(ctx, 'خب که چه؟');
  }
};

export const bot = async (ctx) => {
  while (true) {
    await botSession(ctx);
  }
};

