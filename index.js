console.log("====== BOT STARTING ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot checking Aternos...'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot() {
  console.log("Checking Gpinoyserver.aternos.me...");
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    username: 'Mod',
    auth: 'offline',
    version: false,
    hideErrors: false
  });

  bot.on('spawn', () => {
    console.log(">>> SUCCESS! MOD IS ONLINE IN SERVER!");
    bot.chat("24/7 Bot Online!");
  });

  bot.on('kicked', (r) => {
    console.log("KICKED: " + JSON.stringify(r));
    console.log("Retrying in 30s - Aternos might be starting...");
    setTimeout(createBot, 30000);
  });

  bot.on('end', (r) => {
    console.log("END: " + r);
    console.log("Aternos closed connection - server maybe offline or queue - retry in 60s");
    setTimeout(createBot, 60000);
  });

  bot.on('error', (e) => {
    console.log("ERROR: " + e.message);
    if (e.message.includes("Connection closed before the server sent a status")) {
      console.log(">>> ATERNOS IS OFFLINE OR IN QUEUE - WAITING 60s");
      setTimeout(createBot, 60000);
    } else {
      setTimeout(createBot, 30000);
    }
  });
}

createBot();