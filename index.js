console.log("====== BOT FINAL - SINGLE INSTANCE ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot Single Mode!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

let bot = null;
let isConnecting = false;
let reconnectTimer = null;

function createBot() {
  if (isConnecting) {
    console.log("Already connecting, skipping duplicate...");
    return;
  }
  isConnecting = true;
  
  if (bot) {
    try { bot.quit(); } catch(e) {}
    bot = null;
  }

  console.log("CONNECTING to Gpinoyserver.aternos.me:59345 as Mod");
  
  bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'Mod',
    auth: 'offline'
  });

  bot.on('spawn', () => {
    console.log(">>> SUCCESS! MOD IS ONLINE STABLE! <<<");
    isConnecting = false;
    bot.chat("Bot Mod AFK 24/7 - Stable!");
  });

  bot.on('kicked', (r) => {
    console.log("KICKED: " + JSON.stringify(r));
    isConnecting = false;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(createBot, 30000);
  });

  bot.on('end', (reason) => {
    console.log("END: " + reason);
    isConnecting = false;
    if (reason.includes("another location")) {
      console.log(">>> DUPLICATE DETECTED - WAITING 60s BEFORE RETRY");
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(createBot, 60000);
    } else {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(createBot, 30000);
    }
  });

  bot.on('error', (e) => {
    console.log("ERROR: " + e.message);
    isConnecting = false;
  });
}

createBot();