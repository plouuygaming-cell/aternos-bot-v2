console.log("====== BOT SRV MODE - NO PORT ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('SRV Bot!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("CONNECTING via SRV to Gpinoyserver.aternos.me (no port)");
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    // WALAY PORT - SRV RAY GAMITON - AUTO DETECT!
    username: 'Mod',
    auth: 'offline',
    version: false
  });

  bot.on('connect', () => console.log(">>> TCP CONNECTED!"));
  bot.on('login', () => console.log(">>> LOGIN!"));
  
  bot.on('spawn', () => {
    console.log(">>> MOD JOINED! SUCCESS!");
    bot.chat("Bot Mod is now AFK 24/7!");
  });

  bot.on('kicked', (r) => {
    console.log("KICKED: " + JSON.stringify(r));
    setTimeout(createBot, 30000);
  });

  bot.on('end', (r) => {
    console.log("END: " + r);
    setTimeout(createBot, 30000);
  });

  bot.on('error', (e) => {
    console.log("ERROR: " + e.message);
    setTimeout(createBot, 30000);
  });
}

createBot();