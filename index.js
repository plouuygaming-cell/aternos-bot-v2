console.log("BOT STARTING...");

const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req,res)=>res.send('Bot OK'));
app.listen(process.env.PORT || 10000, ()=>console.log("WEB OK"));

let bot;
function start(){
 console.log("CONNECTING to Gpinoyserver.aternos.me");
 bot = mineflayer.createBot({
   host: 'Gpinoyserver.aternos.me',
   username: 'Mod',
   auth: 'offline'
 });
 bot.on('connect', ()=>console.log("TCP CONNECTED"));
 bot.on('spawn', ()=>{
   console.log("MOD JOINED SUCCESS!");
   bot.chat("Bot Mod is now AFK 24/7!");
 });
 bot.on('kicked', r=>{
   console.log("KICKED "+JSON.stringify(r));
   setTimeout(start, 30000);
 });
 bot.on('end', r=>{
   console.log("END "+r);
   setTimeout(start, 30000);
 });
 bot.on('error', e=>console.log("ERR "+e.message));
}
start();