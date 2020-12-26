# async-bot
Get rid of hardcoding states when you are developing a conversation bot.

## An example
Imagine you are writing a bot that ask user her information and calculater her bmi:

### Classic, bad, long, manual way:
```JS
let state = 'init';
let name, height, weight;
bot.on('message', (message) => {
  if (state === 'get_name') {
    name = message;
    state = 'get_height';
    sendMsg('What is your height in meters?');
  } else if (state === 'get_height') {
    height = Number(message);
    state = 'get_weight';
    sendMsg('What is your weight in kilograms?');  
  } else if (state === 'get_weight') {
    weight = Number(message);
    state = 'init';
    sendMsg(`hey ${name}, your bmi is ${weight/(height*height)}`);
  } else if (state === 'init) {
    state = 'get_name';
    sendMsg('Hello. What is your name?');
  }
});
```
### in async bot:
```JS
const bot = async (ctx) => {
  while (true) {
    const name = await ask(ctx, 'Hello. What is your name?');
    const height = Number(await ask(ctx, 'What is your height in meters?'));
    const weight = Number(await ask(ctx, 'What is your weight in kilograms?'));
    await sendMsg(ctx, `hey ${name}, your bmi is ${weight/(height*height)}`);
  }
};
```
