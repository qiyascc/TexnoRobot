const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    const name = ctx.from.first_name;
    ctx.reply(`Hello ${name}`, Markup.inlineKeyboard([
        [Markup.button.callback('Help', 'HELP')],
        [Markup.button.callback('Support', 'SUPPORT')],
        [Markup.button.callback('Close', 'CLOSE_START')]
    ]).resize());
});

bot.command('dev', (ctx) => {
    ctx.reply('Dev', Markup.inlineKeyboard([
        Markup.button.url('Go to Dev', 'https://t.me/qiyascc')
    ]).resize());
});

bot.action('HELP', (ctx) => {
    ctx.editMessageText('Help', Markup.inlineKeyboard([
        [Markup.button.callback('Geri', 'BACK_TO_START')],
        [Markup.button.callback('Close', 'CLOSE')]
    ]).resize());
});

bot.action('SUPPORT', (ctx) => {
    ctx.editMessageText('Support', Markup.inlineKeyboard([
        [Markup.button.callback('Geri', 'BACK_TO_START')],
        [Markup.button.callback('Close', 'CLOSE')]
    ]).resize());
});

bot.action('BACK_TO_START', (ctx) => {
    const name = ctx.from.first_name;
    ctx.editMessageText(`HEllo ${name}`, Markup.inlineKeyboard([
        [Markup.button.callback('Help', 'HELP')],
        [Markup.button.callback('Support', 'SUPPORT')],
        [Markup.button.callback('Close', 'CLOSE')]
    ]).resize());
});

bot.action('CLOSE', (ctx) => {
    ctx.deleteMessage();


bot.launch();
