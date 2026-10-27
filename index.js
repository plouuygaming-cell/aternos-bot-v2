console.log("=== V9 FINAL - USING HILSHA DIRECT IP ===");
const mineflayer = require('mineflayer');
const express = require('express');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const app = express();
app.get('/', (req,res)=>res.send('Mod Bot V9 Live hilsha:59345 '+new Date()));
app.listen(process.env.PORT||10000, ()=>console.log("WEB OK"));

const PROXY = process.env.PROXY_URL;
console.log("USING PROXY: "+(PROXY||"NONE"));
console.log("TARGET: hilsha.aternos.host:59345");

let afk=null;
function start(){
  try{
    let agent=null;
    if(PROXY && PROXY.trim()!=""){
      if(PROXY.startsWith('socks')) agent=new SocksProxyAgent(PROXY);
      else agent=new HttpProxyAgent(PROXY);
      console.log("Agent created: "+PROXY);
    }
    console.log("CONNECTING to hilsha.aternos.host:59345 as Mod...");
    const bot=mineflayer.createBot({
      host:'hilsha.aternos.host', // <-- DIRECT IP - DILI NA Gpinoyserver!
      port:59345,
      username:'Mod',
      auth:'offline',
      version:'1.21.1',
      agent:agent,
      connectTimeout:20000,
      keepAlive:true
    });
    bot.on('connect',()=>console.log(">>> TCP CONNECTED!"));
    bot.on('login',()=>console.log(">>> LOGIN SUCCESS!"));
    bot.on('spawn',()=>{
      console.log(">>> MOD JOINED! SUCCESS!!! ONLINE NA!!!");
      bot.chat("Mod 24/7 online! Using hilsha host");
      if(afk) clearInterval(afk);
      afk=setInterval(()=>{
        if(!bot?.entity) return;
        bot.setControlState('jump',true);
        setTimeout(()=>bot.setControlState('jump',false),300);
        console.log("AFK keepalive");
      },30000);
    });
    bot.on('kicked',r=>{console.log("KICKED: "+JSON.stringify(r).slice(0,300)); if(afk) clearInterval(afk); setTimeout(start,15000);});
    bot.on('end',r=>{console.log("END: "+r+" retry 15s"); if(afk) clearInterval(afk); setTimeout(start,15000);});
    bot.on('error',e=>{console.log("ERROR: "+e.message+" retry 10s"); if(afk) clearInterval(afk); setTimeout(start,10000);});
  }catch(err){console.log("START ERR: "+err.message); setTimeout(start,10000);}
}
start();