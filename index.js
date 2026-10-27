console.log("====== 2 BOTS - MOD + MOD2 ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('2 Bots Alive!'));
app.listen(process.env.PORT || 10000, () => console.log("WEB OK"));

function createBot(username) {
  console.log(`CONNECTING ${username} to Gpinoyserver.aternos.me:59345`);
  
  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: username,
    auth: 'offline'
  });

  bot.on('spawn', () => {
    console.log(`>>> ${username} ONLINE!`);
    bot.chat(`${username} AFK 24/7!`);
  });

  bot.on('kicked', (r) => {
    console.log(`${username} KICKED: ${JSON.stringify(r)}`);
    setTimeout(() => createBot(username), 30000);
  });

  bot.on('end', (reason) => {
    console.log(`${username} END: ${reason}`);
    setTimeout(() => createBot(username), 30000);
  });

  bot.on('error', (e) => console.log(`${username} ERROR: ${e.message}`));
}

// BUHAT DUHA KA BOT - LAIN LAIN OG NGALAN!
createBot('Mod');
setTimeout(() => createBot('Mod2'), 5000); // 5 seconds pagitan para dili sabay