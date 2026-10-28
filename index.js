console.log("=== MOD BOT V11 - DIRECT HILSHA ===");
const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req,res)=>{
  res.send('Mod Bot Online - '+new Date().toLocaleString()+' - hilsha:59345');
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log(`[Web] Listening on ${PORT}`));

console.log("[Bot] Creating Mod -> hilsha.aternos.host:59345");

function createBot(){
  const bot = mineflayer.createBot({
    host: 'hilsha.aternos.host',
    port: 59345,
    username: 'Mod',
    auth: 'offline',
    version: '1.21.1',
    hideErrors: false
  });

  bot.on('connect', ()=>console.log("[Bot] CONNECTED to server"));
  bot.on('login', ()=>console.log("[Bot] LOGIN success"));
  
  bot.on('spawn', ()=>{
    console.log("[Bot] >>> SPAWNED - MOD JOINED SUCCESS!!!");
    bot.chat("Mod online 24/7!");
    
    setInterval(()=>{
      try{
        if(bot && bot.entity){
          bot.setControlState('jump', true);
          setTimeout(()=>{ try{bot.setControlState('jump', false)}catch(e){} }, 500);
          console.log("[AFK] Jump");
        }
      }catch(e){ console.log("[AFK] Error: "+e.message); }
    }, 30000);
  });

  bot.on('kicked', (reason)=>{
    console.log("[Bot] KICKED: "+JSON.stringify(reason));
    console.log("[Bot] Reconnect in 15s...");
    setTimeout(createBot, 15000);
  });

  bot.on('end', (reason)=>{
    console.log("[Bot] END: "+reason);
    console.log("[Bot] Reconnect in 15s...");
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err)=>{
    console.log("[Bot] ERROR: "+err.message);
    console.log("[Bot] Reconnect in 10s...");
    setTimeout(createBot, 10000);
  });
}

// KeepAlive self-ping para dili matulog ang Render
console.log("[KeepAlive] Self-ping started");
setInterval(()=>{
  console.log("[KeepAlive] Ping - Bot still running - "+new Date().toLocaleTimeString());
}, 60000);

createBot();