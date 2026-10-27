const mineflayer = require('mineflayer');
const express = require('express');

// KEEP ALIVE PARA DILI MO EXIT ANG RENDER
const app = express();
app.get('/', (req, res) => res.send('Bot is running! Gpinoyserver Online!'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`[Web] Listening on ${PORT}`));

const config = {
  host: 'Gpinoyserver.aternos.me',
  username: 'Mod',
  version: false,
  utils: { 'auto-reconnect': true }
};

let bot;
let reconnectTimeout;

function createBot() {
  console.log(`[Bot] Trying to connect to ${config.host}...`);
  
  bot = mineflayer.createBot({
    host: config.host,
    username: config.username,
    version: false
  });

  bot.on('spawn', () => {
    console.log('[Bot] Spawned! Bot joined successfully!');
    setupAntiAfk();
  });

  bot.on('kicked', (reason) => {
    console.log('[Bot] Kicked:', reason);
    scheduleReconnect();
  });

  bot.on('end', () => {
    console.log('[Bot] Disconnected');
    scheduleReconnect();
  });

  bot.on('error', (err) => {
    console.log('[Bot] Error:', err.message);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  console.log('[Reconnect] In 5000ms...');
  reconnectTimeout = setTimeout(() => {
    createBot();
  }, 5000);
}

function setupAntiAfk() {
  // 1. Sneak every 30 sec
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('sneak', true);
      setTimeout(() => {
        if (bot) bot.setControlState('sneak', false);
      }, 800);
    }
  }, 30000);

  // 2. Look + Jump + Swing every 60 sec - AN