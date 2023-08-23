const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = 'BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);


function botStart(ctx) {
    const name = ctx.from.first_name;
    ctx.reply(`Hello ${name}`, Markup.inlineKeyboard([
        [Markup.button.callback('Help', 'HELP'),
        Markup.button.callback('Support', 'SUPPORT')],
        [Markup.button.callback('Close', 'CLOSE')]
    ]).resize());
}

bot.start((ctx) => {
    botStart(ctx);
});

bot.command('dev', (ctx) => {
    ctx.reply('Dev', Markup.inlineKeyboard([
        Markup.button.url('Go to Dev', 'https://t.me/qiyascc')
    ]).resize());
});

bot.action('HELP', (ctx) => {
    ctx.editMessageText("The purpose of this bot is to keep you up to date with certain developments and help you solve your relevant issues." +
    "\nThe bot will update over time and get better." +
    "\n\nIf you have a feature or other offer you want to be added, you can notify the developer with the /dev command.", 
    Markup.inlineKeyboard([
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
    ctx.deleteMessage();
    botStart(ctx);
});

bot.action('CLOSE', (ctx) => {
    ctx.deleteMessage();
});

bot.launch();
