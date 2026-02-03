require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once(Events.ClientReady, () => {
  console.log("Bot is online");
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (!newState.member || newState.member.user.bot) return;

  const joinedTarget =
    newState.channelId === process.env.TARGET_VOICE_CHANNEL_ID &&
    oldState.channelId !== process.env.TARGET_VOICE_CHANNEL_ID;

  if (!joinedTarget) return;

  const member = newState.member;

  try {
    if (member.voice.serverMute) {
      await member.voice.setMute(false, "Auto unmute");
    }

    if (member.voice.serverDeaf) {
      await member.voice.setDeaf(false, "Auto undeafen");
    }

    console.log(`Fixed voice state for ${member.user.tag}`);
  } catch (err) {
    console.error("Permission error:", err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);