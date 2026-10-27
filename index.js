console.log("====== BOT STARTING ======");

const mineflayer = require('mineflayer');
const express = require('express');

console.log("Modules OK");

const app = express();
app.get('/', (req, res) => res.send('Bot Alive!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("CONNECTING to Gpinoyserver.aternos.me");
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    username: 'Mod',
    auth: 'offline'
  });

  bot.on('spawn', () => console.log(">>> SUCCESS! MOD ONLINE!"));
  bot.on('kicked', (r) => { console.log("KICKED: " + JSON.stringify(r)); setTimeout(createBot, 15000); });
  bot.on('end', () => { console.log("END - retry 15s"); setTimeout(createBot, 15000); });
  bot.on('error', (e) => console.log("ERROR: " + e.message));
}

createBot();