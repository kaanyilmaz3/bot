const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log('Bot aktif!');

  const channel = await client.channels.fetch('1507495576479076424');

  channel.send(`
📃│rules

1- 
2- Spam yasak
3- Saygılı olun
`);
});

client.login(process.env.TOKEN);
