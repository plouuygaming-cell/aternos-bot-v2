console.log("====== BOT LOOP - KATONG SA SCREENSHOT ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Loop Bot!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("CONNECTING Mod to Gpinoyserver.aternos.me:59345");
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'Mod',
    auth: 'offline'
  });

  bot.on('spawn', () => {
    console.log(">>> MOD JOINED - CHATTING!");
    bot.chat("Bot Mod is now AFK 24/7!");
  });

  bot.on('kicked', (r) => {
    console.log("KICKED: " + JSON.stringify(r));
    setTimeout(createBot, 15000);
  });

  bot.on('end', (r) => {
    console.log("END: " + r);
    setTimeout(createBot, 15000);
  });

  bot.on('error', (e) => console.log("ERROR: " + e.message));
}

createBot();
setTimeout(createBot, 15000); // <-- KANI ANG NAGPA DUHA - 15 SECONDS NAAPAY USA - MAO NANG MAG AWAY SILA SA NGALAN!