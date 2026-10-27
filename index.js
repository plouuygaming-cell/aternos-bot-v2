const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', function(req, res) { res.send('Bot is running!'); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, function() { console.log('Web Listening on ' + PORT); });

const config = {
  host: 'Gpinoyserver.aternos.me:59345',
  username: 'Mod',
  version: false
};

let bot;
let reconnectTimeout;

function createBot() {
  console.log('Bot Connecting to ' + config.host);
  bot = mineflayer.createBot({
    host: config.host,
    username: config.username,
    version: false
  });

  bot.on('spawn', function() {
    console.log('Bot Spawned!');
    setupAntiAfk();
  });

  bot.on('kicked', function(r) {
    console.log('Bot Kicked: ' + r);
    scheduleReconnect();
  });

  bot.on('end', function() {
    console.log('Bot Disconnected');
    scheduleReconnect();
  });

  bot.on('error', function(e) {
    console.log('Bot Error: ' + e.message);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  console.log('Reconnect In 5s...');
  reconnectTimeout = setTimeout(createBot, 5000);
}

function setupAntiAfk() {
  setInterval(function() {
    if (bot && bot.entity) {
      bot.setControlState('sneak', true);
      setTimeout(function() { if (bot) bot.setControlState('sneak', false); }, 800);
    }
  }, 30000);

  setInterval(function() {
    if (bot && bot.entity) {
      var yaw = Math.random() * Math.PI * 2 - Math.PI;
      var pitch = (Math.random() - 0.5) * 1.2;
      bot.look(yaw, pitch, false);
      bot.swingArm('right');
      bot.setControlState('jump', true);
      setTimeout(function() { if (bot) bot.setControlState('jump', false); }, 200);
    }
  }, 60000);

  setInterval(function() {
    if (bot && bot.entity) {
      var forward = Math.random() > 0.5;
      bot.setControlState(forward ? 'forward' : 'back', true);
      setTimeout(function() {
        if (bot) {
          bot.setControlState('forward', false);
          bot.setControlState('back', false);
        }
      }, 1200);
    }
  }, 120000);
}

createBot();