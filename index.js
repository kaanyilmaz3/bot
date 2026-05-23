const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} aktif!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!ai ')) return;

  const soru = message.content.slice(4);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a multilingual Discord AI bot. Respond in the same language as the user (Turkish, English, Finnish, etc.). Be natural, helpful and clear.'
          },
          {
            role: 'user',
            content: soru
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.log(data);
      return message.reply('AI error.');
    }

    await message.reply(data.choices[0].message.content);

  } catch (err) {
    console.log(err);
    message.reply('AI error.');
  }
});

client.login(process.env.TOKEN);
