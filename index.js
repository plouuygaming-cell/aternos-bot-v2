const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalBlock = goals.GoalBlock;
const express = require('express');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));

const app = express();
app.get('/', (req, res) => res.send(`Bot ${config['bot-account'].username} is running!`));
app.get('/status', (req, res) => res.json(botState));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Web] Listening on ${PORT}`));

let bot = null;
let botState = { connected: false, lastActivity: Date.now(), reconnectAttempts: 0, errors: [] };
let activeIntervals = [];
let isReconnecting = false;

function clearAllIntervals() { activeIntervals.forEach(id => clearInterval(id)); activeIntervals = []; }
function addInterval(cb, delay) { const id = setInterval(cb, delay); activeIntervals.push(id); return id; }
function getReconnectDelay() {
  const base = config.utils['auto-reconnect-delay'] || 2000;
  const max = config.utils['max-reconnect-delay'] || 15000;
  return Math.min(base + (botState.reconnectAttempts * 1000), max);
}
function scheduleReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  const delay = getReconnectDelay();
  console.log(`[Reconnect] Reconnecting in ${delay}ms...`);
  botState.reconnectAttempts++;
  setTimeout(() => { isReconnecting = false; createBot(); }, delay);
}
function sendDiscordWebhook(msg, color) {
  if (!config.discord?.enabled || !config.discord?.webhookUrl) return;
  try { fetch(config.discord.webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [{ description: msg, color: color || 0x4ade80 }] }) }).catch(()=>{}); } catch(e){}
}

function createBot() {
  if (isReconnecting) return;
  if (bot) { clearAllIntervals(); try { bot.removeAllListeners(); bot.end(); } catch(e){} bot = null; }
  console.log(`[Bot] Creating ${config['bot-account'].username} -> ${config.server.ip}:${config.server.port}`);
  bot = mineflayer.createBot({
    username: config['bot-account'].username,
    auth: config['bot-account'].type || 'offline',
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  });
  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    botState.connected = true;
    botState.reconnectAttempts = 0;
    isReconnecting = false;
    console.log('[Bot] [+] Spawned!');
    if (config.discord?.events?.connect) sendDiscordWebhook(`[+] Connected to \`${config.server.ip}\``, 0x4ade80);
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    if (config.position.enabled) {
      bot.pathfinder.setMovements(defaultMove);
      bot.pathfinder.setGoal(new GoalBlock(config.position.x, config.position.y, config.position.z));
    }
    initializeModules(bot, mcData, defaultMove);
    try { const setupLeaveRejoin = require('./leaveRejoin'); setupLeaveRejoin(bot, createBot); } catch(e){ console.log('[Rejoin] leaveRejoin.js not found'); }
  });

  bot.on('end', (reason) => {
    console.log(`[Bot] Disconnected: ${reason}`);
    botState.connected = false;
    clearAllIntervals();
    if (config.utils['auto-reconnect']) scheduleReconnect();
  });
  bot.on('kicked', (reason) => console.log('[KICK]', reason));
  bot.on('error', (err) => console.log('[Error]', err.message));
}

function initializeModules(bot, mcData, defaultMove) {
  console.log('[Modules] Initializing...');
  let authDone = false;
  bot.on('messagestr', (msg) => {
    const message = msg.toLowerCase();
    if (authDone) return;
    if (message.includes('register')) { authDone = true; bot.chat('/register Perzuu Perzuu'); console.log('[Auth] Register sent'); return; }
    if (message.includes('login')) { authDone = true; bot.chat('/login Perzuu'); console.log('[Auth] Login sent'); return; }
  });
  if (config.utils['anti-afk'].enabled) {
    addInterval(() => {
      if (bot && botState.connected) { bot.setControlState('jump', true); setTimeout(() => { if(bot) bot.setControlState('jump', false); }, 100); }
    }, 3000);
    if (config.utils['anti-afk'].sneak) bot.setControlState('sneak', true);
  }
  if (config.movement['circle-walk'].enabled) startCircleWalk(bot, defaultMove);
  if (config.movement['random-jump'].enabled) startRandomJump(bot);
  if (config.movement['look-around'].enabled) startLookAround(bot);
  if (config.modules.chat) chatModule(bot);
  console.log('[Modules] All modules initialized!');
}

function periodicRejoin(bot) { console.log('[Rejoin] Using new leaveRejoin system.'); }
function startCircleWalk(bot, defaultMove) {
  console.log('[Movement] Circle walk started');
  let angle = 0;
  addInterval(() => {
    if (!bot || !botState.connected) return;
    angle += 0.2; bot.look(angle, 0, true);
    bot.setControlState('forward', true);
    setTimeout(() => { if(bot) bot.setControlState('forward', false); }, 400);
  }, config.movement['circle-walk'].speed || 3000);
}
function startRandomJump(bot) {
  addInterval(() => {
    if (!bot || !botState.connected) return;
    bot.setControlState('jump', true);
    setTimeout(() => { if(bot) bot.setControlState('jump', false); }, 150);
  }, config.movement['random-jump'].interval || 10000);
}
function startLookAround(bot) {
  addInterval(() => {
    if (!bot || !botState.connected) return;
    bot.look(Math.random()*Math.PI*2, (Math.random()-0.5)*0.5, true);
  }, config.movement['look-around'].interval || 5000);
}
function avoidMobs(bot) {}
function combatModule(bot, mcData) {}
function bedModule(bot, mcData) {}
function chatModule(bot) { console.log('[Module] chat enabled'); }

function startSelfPing() {
  setInterval(() => { fetch(`http://localhost:${PORT}`).catch(()=>{}); }, 10*60*1000);
  console.log('[KeepAlive] Self-ping started');
}
startSelfPing();
createBot();