console.log("====== BOT TEST - VERBOSE ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Testing...'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("ATTEMPT CONNECT to Gpinoyserver.aternos.me:59345");
  console.log("Using username: ModAFK123");
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'ModAFK123',
    auth: 'offline',
    version: '1.21.1',
    connectTimeout: 30000,
    checkTimeoutInterval: 10000
  });

  bot.on('connect', () => console.log(">>> TCP CONNECTED!"));
  bot.on('login', () => console.log(">>> LOGIN PACKET RECEIVED!"));
  bot.on('spawn', () => {
    console.log(">>> SUCCESS! ModAFK123 IS ONLINE!");
    bot.chat("Bot is online!");
  });
  bot.on('message', (msg) => console.log("CHAT: " + msg.toString()));
  bot.on('kicked', (r) => {
    console.log(">>> KICKED: " + JSON.stringify(r));
    setTimeout(createBot, 15000);
  });
  bot.on('end', (reason) => {
    console.log(">>> END: " + reason);
    console.log(">>> RETRY IN 15s");
    setTimeout(createBot, 15000);
  });
  bot.on('error', (e) => {
    console.log(">>> ERROR: " + e.message);
    console.log(">>> Full error: " + e.stack);
    setTimeout(createBot, 15000);
  });
}

createBot();