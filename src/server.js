'use strict';

const express = require('express');
const Telegraf = require('telegraf');


const configObj = require('../config.json');

const environment = process.env.NODE_ENV || 'development';
const finalConfig = configObj[environment];
//const environmentConfig = configObj[environment];
//const finalConfig = _.merge(defaultConfig, environmentConfig);
//const Config = config.development;

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);


// Constants
const PORT = global.gConfig.port;
const HOST = global.gConfig.host;

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello 4 world\n');
});



const bot = new Telegraf(process.env.BOT_TOKEN || global.gConfig.bot_token )
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()


app.listen(PORT, HOST);
console.log(`Running 3 on http://${HOST}:${PORT}`);