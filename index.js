const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
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

// --- 1. KISIM: KOMUTLAR (MESSAGE CREATE) ---
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // LOAN MENÜSÜNÜ KURMA KOMUTU (!loan-kur)
  if (message.content === '!loan-kur') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply('Bu komutu kullanmak için Yönetici yetkiniz olmalı.');
    }

    const loanEmbed = new EmbedBuilder()
        .setColor('#8a2be2')
        .setTitle('💸 Loan Service')
        .setDescription(
            'Welcome to the official loan service. Please read the options below carefully before proceeding.\n\n' +
            '**📝 Take a Loan**\nApply for a loan on **Gamblit** — select your tier and submit your desired loan amount. A private ticket opens after you submit.\n\n' +
            '**📖 Loan Rules**\nView the full loan terms, interest rates, and repayment limits before applying.\nBy taking a loan you agree to all terms and conditions of our loan service.'
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('take_loan_btn')
            .setLabel('Take a Loan')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('loan_rules_btn')
            .setLabel('Loan Rules')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('loan_guide_btn')
            .setLabel('Guide')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('loan_limit_btn')
            .setLabel('My Limit')
            .setStyle(ButtonStyle.Secondary)
    );

    await message.channel.send({ embeds: [loanEmbed], components: [row] });
    return message.delete().catch(() => {});
  }

  // YAPAY ZEKA KOMUTUN (!ai)
  if (message.content.startsWith('!ai ')) {
    const soru = message.content.slice(4);

    try {
      // 🔑 DÜZELTME 1: Groq API Key'ini buradaki iki tırnak arasına yapıştır!
      const gApiKey = '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';
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${gApiKey}`
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
  }
});

// --- 2. KISIM: BUTON ETKİLEŞİMLERİ (INTERACTION CREATE) ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const guild = interaction.guild;
    const user = interaction.user;

    if (interaction.customId === 'take_loan_btn') {
        try {
            const ticketChannel = await guild.channels.create({
                name: `loan-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    }
                ],
            });

            await interaction.reply({ content: `Kredi başvurunuz için özel kanal oluşturuldu: ${ticketChannel}`, ephemeral: true });

            await ticketChannel.send({
                content: `👋 Merhaba ${user}, Kredi başvuru talebiniz başarıyla alındı.\nBuradan yetkililerle görüşebilir veya botun diğer komutlarını kullanabilirsiniz.`
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Kanal oluşturulurken bir hata meydana geldi!', ephemeral: true });
        }
    }

    if (interaction.customId === 'loan_rules_btn') {
        await interaction.reply({ content: '📖 **Loan Rules:** Kredi kuralları henüz eklenmedi.', ephemeral: true });
    }
    if (interaction.customId === 'loan_guide_btn') {
        await interaction.reply({ content: '📘 **Guide:** Kredi rehberi henüz eklenmedi.', ephemeral: true });
    }
    if (interaction.customId === 'loan_limit_btn') {
        await interaction.reply({ content: '💳 **My Limit:** Mevcut kredi limitiniz sorgulanamıyor.', ephemeral: true });
    }
});

// 🔑 DÜZELTME 2: Discord Developer Portaldan sıfırlayıp aldığın en güncel tokenı buraya yapıştır!
client.login(process.env.DISCORD_TOKEN);
