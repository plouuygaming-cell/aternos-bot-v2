console.log("=== V7 PROXY WITH TIMEOUT ===");
const mineflayer = require('mineflayer');
const express = require('express');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const app = express();
app.get('/', (req,res)=>res.send('Mod Proxy Bot Live'));
app.listen(process.env.PORT||10000, ()=>console.log("WEB OK"));

const PROXY = process.env.PROXY_URL;
console.log("USING PROXY: "+(PROXY||"NONE - DIRECT"));

let afkInterval=null;
function start(){
 try{
  let agent=null;
  if(PROXY && PROXY.trim()!=""){
   if(PROXY.startsWith('socks')) agent=new SocksProxyAgent(PROXY);
   else agent=new HttpProxyAgent(PROXY);
   console.log("Agent created for "+PROXY);
  } else console.log("No proxy - direct connect");
  
  console.log("CONNECTING to Gpinoyserver.aternos.me:59345 as Mod...");
  const bot=mineflayer.createBot({
    host:'Gpinoyserver.aternos.me',port:59345,username:'Mod',auth:'offline',version:'1.21.1',
    agent:agent,connectTimeout:10000
  });
  bot.on('connect',()=>console.log(">>> TCP CONNECTED!"));
  bot.on('spawn',()=>{
    console.log(">>> MOD JOINED! SUCCESS!!!");
    bot.chat("Mod 24/7 online!");
    if(afkInterval) clearInterval(afkInterval);
    afkInterval=setInterval(()=>{
      if(!bot||!bot.entity) return;
      bot.setControlState('jump',true);
      setTimeout(()=>bot.setControlState('jump',false),300);
      console.log("AFK jump - Mod is alive");
    },30000);
  });
  bot.on('kicked',r=>{console.log("KICKED: "+JSON.stringify(r)); if(afkInterval) clearInterval(afkInterval); setTimeout(start,15000);});
  bot.on('end',r=>{console.log("END: "+r+" - retry in 15s"); if(afkInterval) clearInterval(afkInterval); setTimeout(start,15000);});
  bot.on('error',e=>{console.log("ERROR: "+e.message+" - retry in 10s"); if(afkInterval) clearInterval(afkInterval); setTimeout(start,10000);});
 }catch(err){console.log("START ERROR: "+err.message); setTimeout(start,10000);}
}
start();