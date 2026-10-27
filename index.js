const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(process.env.PORT || 10000, () => console.log('Web OK'));

function createBot() {
  console.log('Connecting to Gpinoyserver.aternos.me:59345');
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'Mod',
    version: false
  });

  bot.on('spawn', () => console.log('>>> SUCCESS! Bot Spawned! Mod is online!'));
  bot.on('login', () => console.log('>>> Login OK!'));
  bot.on('kicked', (r) => { console.log('>>> KICKED: ' + r); setTimeout(createBot, 10000); });
  bot.on('end', (r) => { console.log('>>> END: ' + r); setTimeout(createBot, 10000); });
  bot.on('error', (e) => { console.log('>>> ERROR: ' + e.message); });
}

createBot();