const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`[Web] Listening on ${PORT}`));

const config = {
  host: 'Gpinoyserver.aternos.me',
  username: 'Mod',
  version: false
};

let bot;
let reconnectTimeout;

function createBot() {
  console.log(`[Bot] Connecting to ${config.host}...`);
  bot = mineflayer.createBot({
    host: config.host,
    username: config.username,
    version: false
  });

  bot.on('spawn', () => {
    console.log('[Bot] Spawned!');
    setupAntiAfk();
  });

  bot.on('kicked', (r) => {
    console.log('[Bot] Kicked:', r);
    scheduleReconnect();
  });

  bot.on('end', () => {
    console.log('[Bot] Disconnected');
    scheduleReconnect();
  });

  bot.on('error', (e) => {
    console.log('[Bot] Error:', e.message);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  console.log('[Reconnect] In 5