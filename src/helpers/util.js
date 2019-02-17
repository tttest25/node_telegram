const Telegram = require('telegraf');
const crypto = require('crypto');
// import Telegram from 'telegraf';
// import crypto from 'crypto';
// import querystring from 'querystring';
// import fetch from 'node-fetch';
// import songs from '../songs';
// import { findUserByIdAndUpdate, createSucceededMessage, createFailedMessage } from './dbmanager';
// import { ADMIN_ID } from '../../config';
// import bot from '../bot';

var bot = null;

function setBot(pbot) {
  bot=pbot;
}

const GLOBAL_KEYBOARD = Telegram.Markup.keyboard([['🎵 Track', '💽 Album', '📃 Tracklist']]).resize().extra();

function sendToAdmin(text) {
  return bot.telegram.sendMessage(global.gConfig.ADMIN_ID, text);
}

function md5(text) {
  return crypto.createHash('md5').update(text, 'utf8').digest('hex');
}



//-------------------

function userString(ctx) {
    return JSON.stringify(ctx.from.id == ctx.chat.id ? ctx.from : {
        from: ctx.from,
        chat: ctx.chat
    });
}

function logMsg(ctx) {
    var from = userString(ctx);
    console.log('<', ctx.message.text, from)
}

function logOutMsg(ctx, text) {
    console.log('>', {
        id: ctx.chat.id
    }, text);
}



module.exports = {
  setBot,sendToAdmin,logMsg,logOutMsg
};