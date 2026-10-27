console.log("=== BOT STARTING V4 ===");
console.log("=== CHECKPOINT 1 - FILE LOADED ===");

const mineflayer = require('mineflayer');
const express = require('express');

console.log("=== CHECKPOINT 2 - LIBS LOADED ===");

const app = express();
app.get('/', (req,res)=>res.send('Bot V4 Live'));
app.listen(process.env.PORT || 10000, ()=>console.log("=== WEB OK ==="));

console.log("=== CHECKPOINT 3 - WEB STARTED - STARTING MINECRAFT BOT ===");

function startBot(){
  console.log("=== CONNECTING TO Gpinoyserver.aternos.me:59345 as Mod ===");
  try{
    const bot = mineflayer.createBot({
      host: 'Gpinoyserver.aternos.me',
      port: 59345,
      username: 'Mod',
      auth: 'offline',
      version: '1.21.1'
    });

    bot.on('connect', ()=>console.log(">>> SUCCESS TCP CONNECTED"));
    bot.on('login', ()=>console.log(">>> SUCCESS LOGIN"));
    bot.on('spawn', ()=>{
      console.log(">>> SUCCESS MOD JOINED! NAA NA SI MOD SA SERVER!");
      bot.chat("Bot Mod is now AFK 24/7!");
    });
    bot.on('kicked', r=>{console.log("KICKED "+JSON.stringify(r)); setTimeout(startBot,15000);});
    bot.on('end', r=>{console.log("END "+r); setTimeout(startBot,15000);});
    bot.on('error', e=>{console.log("ERROR "+e.message);});
  }catch(err){
    console.log("CATCH ERROR "+err.message);
  }
}

startBot();