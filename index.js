const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log('Bot aktif!');
});
const channel = await client.channels.fetch('1507495583563386910');

channel.send(`
📃│rules

1- 
2- Spam yasak
3- Saygılı olun
`);

client.login(process.env.TOKEN);
