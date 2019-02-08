'use strict';

const express = require('express');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const session = require('telegraf/session')
const Markup = require('telegraf/markup')
const { reply } = Telegraf

const configObj = require('../config.json');

const environment = process.env.NODE_ENV || 'development';

const defaultConfig = configObj['development'];
const environmentConfig = configObj[environment];
const finalConfig = Object.assign(defaultConfig, environmentConfig);
//const Config = config.development;

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);


const util = require('./helpers/util');
const dataService = require('./helpers/dataService');

dataService.loadUsers();

const bot = new Telegraf(process.env.BOT_TOKEN || global.gConfig.bot_token )
util.setBot(bot);

// // Register session middleware
bot.use(session())

// Register logger middleware
bot.use((ctx, next) => {
  const start = new Date()
  return next().then(() => {
    const ms = new Date() - start
    console.log('response time %sms', ms)
  })
})

bot.catch((err) => {
  console.error('Error', err)
})

bot.command('start', ctx => {
    util.logMsg(ctx);
    dataService.registerUser(ctx);
    //dataService.setCounter(ctx.chat.id, '0', 0);
    var m = "Hello, I'm your AGP bot, please ask admin to add you to group";
    ctx.reply(m);
    util.logOutMsg(ctx, m);
    setTimeout(() => {
        ctx.reply(0);
        util.logOutMsg(ctx, 0)
    }, 50); //workaround to send this message definitely as second message
});
//bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there!'))
bot.hears('log', (ctx) => {
  ctx.reply('See log!');
  util.logMsg(ctx);
})
bot.launch()


// Constants
const PORT = global.gConfig.port;
const HOST = global.gConfig.host;

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello 4 world\n');
  util.sendToAdmin('test send to admin');
});


process.on('unhandledRejection', (e) => {
  console.log(e);
//   sendToAdmin(`Unhandled Rejection! ${e.message}`);
});

process.on('uncaughtException', (e) => {
  console.log(e);
//   sendToAdmin(`Uncaught Exception! ${e.message}`);
});

app.listen(PORT, HOST);
console.log(`-> Running 3 on http://${HOST}:${PORT}`);
