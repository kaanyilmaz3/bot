const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log('Bot aktif!');
});

client.login('MTUwNzQ1OTc2MTkxMjY4MDY3MA.GdO-EO.rznz65JgE238e_99wBngYuMVQcI4pjLGGPxopo');