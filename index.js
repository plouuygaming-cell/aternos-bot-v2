console.log("====== BOT STARTING ======");
console.log("Time: " + new Date().toString());

const mineflayer = require('mineflayer');
const express = require('express');

console.log("Modules loaded OK");

const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("WEB OK on port " + PORT);
});

function createBot() {
  console.log("CONNECTING to Gpinoyserver.aternos.me");
  try {
    const bot = mineflayer.createBot({
      host: 'Gpinoyserver.aternos.me',
      username: 'Mod',
      auth: 'offline'
    });

    bot.on('spawn', () => console.log(">>> SUCCESS! MOD IS ONLINE!"));
    bot.on('kicked', (r) => { console.log("KICKED: " + r); setTimeout(createBot, 10000); });
    bot.on('end', (r) => { console.log("END: " + r); setTimeout(createBot, 10000); });
    bot.on('error', (e) => { console.log("ERROR: " + e.message); });
  } catch(e) {
    console.log("CRASH: " + e.message);
    setTimeout(createBot, 10000);
  }
}

createBot();
console.log("====== BOT FILE LOADED ======");