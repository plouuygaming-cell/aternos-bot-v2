
console.log("=== AFK 24/7 PRO BOT V5 STARTING ===");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req,res)=>res.send('AFK 24/7 PRO - Mod is Online!'));
app.listen(process.env.PORT || 10000, ()=>console.log("WEB OK - AFK PRO"));

let afkInterval = null;

function startAFK(){
  console.log("CONNECTING to Gpinoyserver.aternos.me:59345 as Mod [AFK 24/7]");

  const bot = mineflayer.createBot({
    host: 'Gpinoyserver.aternos.me',
    port: 59345,
    username: 'Mod',
    auth: 'offline',
    version: '1.21.1'
  });

  bot.on('connect', ()=>console.log(">>> TCP CONNECTED"));
  
  bot.on('spawn', ()=>{
    console.log(">>> MOD JOINED! AFK 24/7 ACTIVE!");
    bot.chat("AFK 24/7 PRO - Mod is now online! 24/7 AFK enabled!");

    // CLEAR OLD INTERVAL
    if(afkInterval) clearInterval(afkInterval);

    // ANTI-AFK SYSTEM - EVERY 30 SECONDS MO LIHOK
    afkInterval = setInterval(()=>{
      if(!bot || !bot.entity) return;
      
      const actions = [
        () => { bot.setControlState('jump', true); setTimeout(()=>bot.setControlState('jump', false), 300); },
        () => { bot.look(Math.random()*Math.PI*2, (Math.random()-0.5)*Math.PI/2, true); },
        () => { bot.setControlState('forward', true); setTimeout(()=>bot.setControlState('forward', false), 500); },
        () => { bot.setControlState('back', true); setTimeout(()=>bot.setControlState('back', false), 500); },
        () => { bot.swingArm('right'); }
      ];
      
      const randomAction = actions[Math.floor(Math.random()*actions.length)];
      randomAction();
      console.log("AFK Action - Anti-kick movement done");
    }, 30000); // EVERY 30 SECONDS

    // CHAT EVERY 10 MINS PARA DILI MA AFK
    setInterval(()=>{
      if(bot) bot.chat("Mod AFK 24/7 - Still online! " + new Date().toLocaleTimeString());
    }, 600000);
  });

  bot.on('kicked', r=>{
    console.log("KICKED: "+JSON.stringify(r));
    if(afkInterval) clearInterval(afkInterval);
    console.log("Reconnecting in 15s...");
    setTimeout(startAFK, 15000);
  });

  bot.on('end', r=>{
    console.log("END: "+r);
    if(afkInterval) clearInterval(afkInterval);
    setTimeout(startAFK, 15000);
  });

  bot.on('error', e=>{
    console.log("ERROR: "+e.message);
    if(afkInterval) clearInterval(afkInterval);
    setTimeout(startAFK, 15000);
  });
}

startAFK();