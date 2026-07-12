# Uzi-Doorman-Bot

Uzi-Doorman-Bot is a small, focused Discord bot that roleplays as Uzi Doorman (from Murder Drones).

## Key Features
- Roleplay responses inspired by Uzi Doorman
- Slash commands (registered globally on startup)

## Slash Commands
These commands are implemented and registered by index.js on startup:

- `/roleplay` — Allows users to roleplay with the bot
- `/commits`  — Shows the latest commits from GitHub

Notes:
- Global slash commands are registered using the CLIENT_ID and DISCORD_TOKEN.
- The `commits` command uses GitHub's public API and may be subject to rate limits.

## Environment Variables
Create a `.env` file and set these values:

- DISCORD_TOKEN=<your-bot-token>         # required
- CLIENT_ID=<your-application-client-id> # required (used to register global slash commands)
- GEMINI_API_KEY=<your-gemini-api-key>   # required (used to make the roleplay command work)  

Example `.env` (do not commit secrets):
```env
DISCORD_TOKEN=your_token_here
CLIENT_ID=123456789012345678
GEMINI_API_KEY=your_key_here
```
## Installation (Stable)

1. Clone the repo:
```bash
git clone https://github.com/coltonsr77/Uzi-Doorman-Bot/archive/refs/tags/v1.1.4.zip
```

2. Install dependencies:
```bash
npm install
```

3. Copy and fill in environment variables:
```bash
touch .env
# edit .env and add your values
```

4. Test the bot:
```bash
npm test
```

5. Run the bot:
```bash
npm start
```

## Installation (Beta)

1. Clone the repo:
```bash
git clone https://github.com/coltonsr77/Uzi-Doorman-Bot/archive/refs/tags/v1.1.5-Beta1.zip
```

2. Install dependencies:
```bash
npm install
```

3. Copy and fill in environment variables:
```bash
touch .env
# edit .env and add your values
```

4. Test the bot:
```bash
npm test
```

5. Run the bot:
```bash
npm start
```


On startup the bot will:
- Log in with DISCORD_TOKEN
- Register global slash commands for the application ID in CLIENT_ID
- Set the initial activity to "Online" and log startup events to the console

## Requirements
- Node.js 18+ (recommended). The code uses dynamic import and modern APIs that work reliably on Node 18 and newer.

## Behavior Details / Implementation Notes
- The bot uses discord.js and registers global slash commands using REST + Routes.applicationCommands(CLIENT_ID).

## Troubleshooting
- "Invalid token" on login — verify DISCORD_TOKEN.
- Commands not appearing — ensure CLIENT_ID is set and the bot has permissions; the bot registers global commands on startup (may take up to an hour to appear across all guilds due to Discord propagation).

## Contributing
Contributions, issues, and pull requests are welcome. For quick help or discussion you can join the project's Discord server: https://discord.gg/Rm4QAxfR

## License
Apache 2.0 License — feel free to use and modify as needed.
