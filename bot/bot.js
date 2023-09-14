const { Telegraf, Markup } = require('telegraf');
const ADMIN_CHAT_ID = 'YOUR_ADMIN_CHAT_ID';
const BOT_TOKEN = 'BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);
const admins = ['id1'];
let userStates = {};
const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
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


//Server Account Request 
bot.command('login', (ctx) => {
    ctx.reply('Please enter your first name.');
    userStates[ctx.from.id] = 'name';
});

bot.on('text', async (ctx) => {
    switch (userStates[ctx.from.id]) {
        case 'name':
            if (/^[a-zA-Z]+$/.test(ctx.message.text)) {
                if (!userStates[ctx.from.id]) userStates[ctx.from.id] = {};
                userStates[ctx.from.id] = { name: ctx.message.text };
                await ctx.reply('Now, please enter your last name.');
                userStates[ctx.from.id] = 'surname';
            } else {
                await ctx.reply('That doesn't seem like a valid name.');
            }
            break;
        case 'surname':
            if (/^[a-zA-Z]+$/.test(ctx.message.text)) {
                userStates[ctx.from.id] = { surname: ctx.message.text };
                await ctx.reply('Now, please enter your class/grade.');
                userStates[ctx.from.id] = 'class';
            } else {
                await ctx.reply('That doesn't seem like a valid surname.');
            }
            break;
        case 'class':
            userStates[ctx.from.id] = { class: ctx.message.text };
            await ctx.reply('Thank you, we will get back to you soon.');

            const msg = await bot.telegram.sendMessage(
                ADMIN_CHAT_ID,
                `New user alert.\n\nID: ${ctx.from.id}\nFirst Name: ${userStates[ctx.from.id].name}\nLast Name: ${userStates[ctx.from.id].surname}\nClass: ${userStates[ctx.from.id].class}`,
                Markup.inlineKeyboard([
                    Markup.button.callback('Reject', 'user_reject'),
                    Markup.button.callback('Approve', 'user_create')
                ])
            );

            
            users[ctx.from.id] = {
                name: userStates[ctx.from.id].name,
                surname: userStates[ctx.from.id].surname,
                class: userStates[ctx.from.id].class
            };
            fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
            break;
    }
});

bot.action('user_reject', async (ctx) => {
    if (admins.includes(String(ctx.from.id))) {
        const originalMessage = ctx.callbackQuery.message.text;
        const userId = originalMessage.match(/ID: (\d+)/)[1];
        bot.telegram.sendMessage(userId, 'Our admin has rejected your request.');
        ctx.editMessageText(originalMessage + '\n\nThis request was rejected.');
    } else {
        ctx.answerCbQuery('Who are you? This button is for my admin.');
    }
});


bot.launch();
