console.log("=== V6 WITH PROXY ===");
const mineflayer = require('mineflayer');
const express = require('express');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');
const app = express();
app.get('/', (req,res)=>res.send('Mod Online via Proxy'));
app.listen(process.env.PORT||10000, ()=>console.log("WEB OK"));

const PROXY = process.env.PROXY_URL;
console.log("USING PROXY: "+(PROXY||"NONE"));

let afkInterval=null;
function start(){
 let agent=null;
 if(PROXY){
   if(PROXY.startsWith('socks')) agent=new SocksProxyAgent(PROXY);
   else agent=new HttpProxyAgent(PROXY);
   console.log("Agent created for "+PROXY);
 }
 console.log("CONNECTING to Gpinoyserver.aternos.me:59345 as Mod via Proxy...");
 const bot=mineflayer.createBot({
   host:'Gpinoyserver.aternos.me',port:59345,username:'Mod',auth:'offline',version:'1.21.1',agent:agent
 });
 bot.on('connect',()=>console.log(">>> TCP CONNECTED VIA PROXY!"));
 bot.on('spawn',()=>{
   console.log(">>> MOD JOINED! PROXY SUCCESS!");
   bot.chat("Mod 24/7 online via proxy!");
   if(afkInterval) clearInterval(afkInterval);
   afkInterval=setInterval(()=>{
     if(!bot||!bot.entity) return;
     bot.setControlState('jump',true);
     setTimeout(()=>bot.setControlState('jump',false),300);
     console.log("AFK jump");
   },30000);
 });
 bot.on('kicked',r=>{console.log("KICKED: "+JSON.stringify(r)); if(afkInterval) clearInterval(afkInterval); setTimeout(start,15000);});
 bot.on('end',r=>{console.log("END: "+r); if(afkInterval) clearInterval(afkInterval); setTimeout(start,15000);});
 bot.on('error',e=>{console.log("ERROR: "+e.message); if(afkInterval) clearInterval(afkInterval); setTimeout(start,15000);});
}
start();