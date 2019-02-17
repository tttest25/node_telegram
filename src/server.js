'use strict';

const fs = require('fs');
const express = require('express');
const https = require('https');
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
const SSL_KEY = global.gConfig.ssl_key;
const SSL_CERT = global.gConfig.ssl_cert;
const SSL_PASSPHRASE =  global.gConfig.ssl_passphrase;

// App
const app = express();

//  remove header X-Powered-By:express
app.disable('x-powered-by');
// or
// app.use(function (req, res, next) {
//   res.removeHeader("X-Powered-By");
//   next();
// });

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked

app.use('/api', function(req, res, next){
  var key = req.query['api-key'];

  // key isn't present
  if (!key) return next(error(400, 'api key required'));

  // key is invalid
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  // all good, store req.key for route access
  req.key = key;
  next();
});

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

var apiKeys = ['agppass'];


// we now can assume the api key is valid,
// and simply expose the data

var users = [
  { name: 'tobi' }
, { name: 'loki' }
, { name: 'jane' }
];

// example: http://localhost:3000/api/users/?api-key=agppass
app.get('/api/users', function(req, res, next){
  res.send(users);
});

// example: http://localhost:3000/api/users/?api-key=agppass
app.get('/api/sendtoadmin', function(req, res, next){
  var resp ={'is_error':0, error: 'message', data: {} };
  // var msg =  req.query.msg.toString() | 'Default message';
  var msg =  !req.query.msg ? 'Default message' : req.query.msg;
  util.sendToAdmin(`sendtoadmin: ${msg.toString()}`);
  Object.assign(resp.data, {'message':msg});
  res.json(resp);
});


// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ 'is_error':1, error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  util.sendToAdmin(`err authorize: ${req.ip}`);
  res.send({ 'is_error':0, error: "404.Authorize and use TLS" });
});



process.on('unhandledRejection', (e) => {
  console.log(e);
//   sendToAdmin(`Unhandled Rejection! ${e.message}`);
});

process.on('uncaughtException', (e) => {
  console.log(e);
//   sendToAdmin(`Uncaught Exception! ${e.message}`);
});

// https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb
// we will pass our 'app' to 'https' server
https.createServer({
  key: fs.readFileSync(SSL_KEY,   'utf8'),
  cert: fs.readFileSync(SSL_CERT, 'utf8'),
  passphrase: SSL_PASSPHRASE
}, app)
.listen(PORT, HOST);
// app.listen(PORT, HOST);
console.log(`-> Running 3 on https://${HOST}:${PORT}`);
