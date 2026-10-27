console.log("====== BOT STARTING - FINAL ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot Alive! Mod is here!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("CONNECTING to Gpinoyserver.aternos.me:59345");
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'Mod',
    auth: 'offline'
  });

  bot.on('spawn', () => {
    console.log(">>> SUCCESS! MOD IS ONLINE! <<<");
    bot.chat("Bot Mod is now AFK 24/7!");
  });

  bot.on('login', () => console.log(">>> LOGIN SUCCESS!"));

  bot.on('kicked', (r) => {
    console.log("KICKED: " + JSON.stringify(r));
    setTimeout(createBot, 15000);
  });

  bot.on('end', (r) => {
    console.log("DISCONNECTED: " + r);
    setTimeout(createBot, 15000);
  });

  bot.on('error', (e) => {
    console.log("ERROR: " + e.message);
    setTimeout(createBot, 15000);
  });
}

createBot();