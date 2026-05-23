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
  console.log('Bot aktif!');
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
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an English-speaking Discord bot. Always reply in English.'
          },
          {
            role: 'user',
            content: soru
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.log(data);
      return message.reply(JSON.stringify(data));
    }

    message.reply(data.choices[0].message.content);

  } catch (err) {
    console.log(err);
    message.reply('AI error.');
  }
});

client.login(process.env.TOKEN);
