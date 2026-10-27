const mineflayer = require('mineflayer');
const express = require('express');

// KEEP ALIVE PARA DILI MO EXIT ANG RENDER
const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Web] Listening on ${PORT}`));

const config = {
  host: 'Gpinoyserver.aternos.me',
  port: 49768,
  username: 'Mod',
  version: '1.20.1',
  utils: { 'auto-reconnect': true }
};

let bot;
let reconnectTimeout;

function createBot() {
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version
  });

  bot.on('spawn', () => {
    console.log('[Bot] Spawned!');
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
  setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('sneak', true);
      setTimeout(() => {
        if (bot) bot.setControlState('sneak', false);
      }, 800);
    }
  }, 30000);

  setInterval(() => {
    if (bot && bot.entity) {
      const yaw = Math.random() * Math.PI * 2 - Math.PI;
      const pitch = (Math.random() - 0.5) * 1.2;
      bot.look(yaw, pitch, false);
      bot.swingArm('right');
      bot.setControlState('jump', true);
      setTimeout(() => {
        if (bot) bot.setControlState('jump', false);
      }, 200);
    }
  }, 60000);

  setInterval(() => {
    if (bot && bot.entity) {
      const forward = Math.random() > 0.5;
      bot.setControlState(forward ? 'forward' : 'back', true);
      setTimeout(() => {
        if (bot) {
          bot.setControlState('forward', false);
          bot.setControlState('back', false);
        }
      }, 1200);
    }
  }, 120000);
}

createBot();