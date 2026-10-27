function setupAntiAfk() {
  setInterval(() => {
    if (bot.entity) {
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 800);
    }
  }, 30000);

  setInterval(() => {
    if (bot.entity) {
      const yaw = Math.random() * Math.PI * 2 - Math.PI;
      const pitch = (Math.random() - 0.5) * 1.2;
      bot.look(yaw, pitch, false);
      bot.swingArm('right');
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 200);
    }
  }, 60000);

  setInterval(() => {
    if (bot.entity) {
      const forward = Math.random() > 0.5;
      bot.setControlState(forward ? 'forward' : 'back', true);
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('back', false);
      }, 1200);
    }
  }, 120000);
}