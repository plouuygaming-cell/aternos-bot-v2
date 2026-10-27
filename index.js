const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot running auto mode'));
app.listen(process.env.PORT || 10000, () => console.log('Web OK - Auto Mode'));

function createBot() {
  console.log('CONNECTING to Gpinoyserver.aternos.me (auto port detection)');
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    username: 'Mod',
    auth: 'offline',
    version: false
  });

  bot.on('spawn', () => {
    console.log('>>> SUCCESS! Bot MOD is now in server!');
    bot.chat('Bot online 24/7!');
  });

  bot.on('login', () => console.log('>>> LOGIN SUCCESS!'));
  bot.on('kicked', (reason) => {
    console.log('>>> KICKED: ' + JSON.stringify(reason));
    console.log('>>> Will retry in 15s');
    setTimeout(createBot, 15000);
  });
  bot.on('end', (reason) => {
    console.log('>>> DISCONNECTED: ' + reason);
    console.log('>>> Retry in 15s');
    setTimeout(createBot, 15000);
  });
  bot.on('error', (err) => {
    console.log('>>> ERROR: ' + err.message);
    setTimeout(createBot, 15000);
  });
}

createBot();