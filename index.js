console.log("====== BOT FINAL V3 - WITH PORT 59345 ======");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req,res)=>res.send('Bot V3'));
app.listen(process.env.PORT || 10000, ()=>console.log("WEB OK"));

function start(){
 console.log("CONNECTING to Gpinoyserver.aternos.me:59345 as Mod");
 
 const bot = mineflayer.createBot({
   host: 'Gpinoyserver.aternos.me',
   port: 59345,
   username: 'Mod',
   auth: 'offline',
   version: '1.21.1',
   connectTimeout: 30000
 });

 bot.on('connect', ()=>console.log(">>> TCP CONNECTED! OK!"));
 bot.on('login', ()=>console.log(">>> LOGIN PACKET OK!"));
 
 bot.on('spawn', ()=>{
   console.log(">>> MOD JOINED SUCCESS! NAA NA SA SERVER!");
   bot.chat("Bot Mod is now AFK 24/7!");
 });

 bot.on('kicked', r=>{
   console.log(">>> KICKED: "+JSON.stringify(r));
   setTimeout(start, 15000);
 });

 bot.on('end', r=>{
   console.log(">>> END: "+r);
   if(r && r.includes("another location")){
     console.log("DUPLICATE BOT - WAIT 60s");
     setTimeout(start, 60000);
   } else {
     setTimeout(start, 15000);
   }
 });

 bot.on('error', e=>{
   console.log(">>> ERROR: "+e.message);
   console.log("FULL: "+e.stack);
   setTimeout(start, 15000);
 });

 // TIMEOUT CHECK - KUNG 40 SECONDS WALAY CONNECT - I-LOG
 setTimeout(()=>{
   if(!bot || !bot.player){
     console.log(">>> TIMEOUT 40s - NO CONNECTION - RENDER IP MAYBE BLOCKED BY ATERNOS");
   }
 }, 40000);
}

start();