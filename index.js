const { Client, GatewayIntentBits } = require('discord.js');
const OpenAI = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.once('ready', async () => {
  console.log('Bot aktif!');

  const channel = await client.channels.fetch('1507495576479076424');

  channel.send(`
📃│rules

Rules you must follow!

• Respect everyone
Harassment, hate speech, threats, or discrimination of any kind is not tolerated.

• No spam or flooding
Do not spam messages, emojis, mentions, links, or media.

• No advertising without permission
Self-promotion, referral links, or server invites are only allowed if approved by staff.

• Follow Discord Terms of Service
Any activity that violates Discord TOS is strictly prohibited.

• No scams or misleading content
Fake giveaways, impersonation, or deceptive behavior will result in immediate action.

• Keep content appropriate
NSFW, illegal, or disturbing content is not allowed in any channel.

• Use channels correctly
Post content only in its relevant channel. Off-topic messages may be removed.

• Do not abuse giveaways
Using multiple accounts, bots, or exploits to gain an advantage is forbidden.

• Staff decisions are final
Arguing moderation actions publicly will not be tolerated. Use proper channels for appeals.

• Common sense applies
If something is clearly disruptive or harmful, it will be dealt with even if not listed above.
`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (!message.content.startsWith('!ai ')) return;

  const soru = message.content.slice(4);

  try {
    const cevap = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: soru
        }
      ]
    });

    message.reply(cevap.choices[0].message.content);

  } catch (err) {
    console.log(err);
    message.reply('AI hatası oluştu.');
  }
});

client.login(process.env.TOKEN);
