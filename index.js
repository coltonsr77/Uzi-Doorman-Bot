require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  Events,
  Partials
} = require("discord.js");
const fetch = require("node-fetch");
const { askUzi } = require("./uziAI");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Create client with message content intents for mentions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// ---------------------
// Slash Commands
// ---------------------
const commandsData = [
  new SlashCommandBuilder()
    .setName("roleplay")
    .setDescription("Talk to Uzi Doorman")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("Your message")
        .setRequired(true)
    ),

  // ------- NEW COMMITS COMMAND -------
  new SlashCommandBuilder()
    .setName("commits")
    .setDescription("Shows the latest commits from GitHub")
].map(cmd => cmd.toJSON());

// ---------------------
// Command Registration
// ---------------------
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commandsData
    });
    console.log("Commands registered globally");
  } catch (err) {
    console.error("Command registration failed:", err);
  }
}

// ---------------------
// Ready Event
// ---------------------
client.once(Events.ClientReady, async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  await registerCommands();
});

// ---------------------
// Slash Command Handling
// ---------------------
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // ROLEPLAY COMMAND
  if (interaction.commandName === "roleplay") {
    const userMessage = interaction.options.getString("message");
    await interaction.deferReply();

    try {
      const uziReply = await askUzi(userMessage);
      await interaction.editReply(uziReply || "Uzi is silent...");
    } catch (err) {
      console.error("Gemini error:", err);
      await interaction.editReply("Uzi malfunctioned while processing that...");
    }
  }

  // ------- NEW COMMITS COMMAND -------
  if (interaction.commandName === "commits") {
    await interaction.deferReply();

    try {
      const url = "https://api.github.com/repos/coltonsr77/Uzi-Doorman-Bot/commits";
      const res = await fetch(url);
      const commits = await res.json();

      const latest = commits.slice(0, 5);

      let message = "**Latest Commits:**\n\n";
      latest.forEach((c, i) => {
        message += `**${i + 1}.** ${c.commit.message}\n`;
        message += `— *${c.commit.author.name}*\n\n`;
      });

      await interaction.editReply(message);
    } catch (err) {
      console.error("Commit fetch error:", err);
      await interaction.editReply("Could not fetch commits.");
    }
  }
});

// ---------------------
// Auto Roleplay on Mentions or Replies
// ---------------------
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  const mentioned =
    message.mentions.has(client.user) ||
    (message.reference &&
      (await message.channel.messages
        .fetch(message.reference.messageId)
        .then(m => m.author.id === client.user.id)
        .catch(() => false)));

  if (mentioned) {
    try {
      const userText = message.content.replace(`<@${client.user.id}>`, "").trim();
      const uziReply = await askUzi(userText || "Hi");

      if (uziReply && uziReply.trim() !== "") {
        await message.reply(uziReply);
      } else {
        await message.reply("Uzi remains silent...");
      }
    } catch (err) {
      console.error("Auto roleplay error:", err);
      await message.reply("Uzi glitched out...");
    }
  }
});

// ---------------------
// Login
// ---------------------
client.login(DISCORD_TOKEN);
