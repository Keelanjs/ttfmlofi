import { Client, Intents, Message } from "discord.js";

import { botInstancesCount, discordBotSecretsPath } from "./const";
import { getAWSSecrets } from "./utils/getAWSSecrets";
import { getArgsFromMessage } from "./utils/getArgsFromMessage";
import { BotMessages } from "./types";
import { onConnectHandler } from "./commandsHandlers/onConnectHandler";
import { createBots } from "./utils/createBots";
import { onPlayPlaylistHandler } from "./commandsHandlers/onPlayPlaylistHandler";
import { onLeaveDjSeatHandler } from "./commandsHandlers/onLeaveDjSeatHandler";
import { onDisconnectHandler } from "./commandsHandlers/onDisconnectHandler";
import { onStatusHandler } from "./commandsHandlers/onStatusHandler";

void (async () => {
  const { discord_token } = await getAWSSecrets<{
    discord_token: string;
  }>(discordBotSecretsPath);

  const bots = await createBots(botInstancesCount);

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.once("ready", () => {
    console.log("Bot is ready");
  });

  client.on("messageCreate", (message: Message) => {
    const { command, args } = getArgsFromMessage(message);

    switch (command) {
      case BotMessages.STATUS:
        onStatusHandler(bots, message);
        break;

      case BotMessages.CONNECT:
        onConnectHandler(bots, message, args);
        break;

      case BotMessages.DISCONNECT:
        onDisconnectHandler(bots, message, args);
        break;

      case BotMessages.PLAY_PLAYLIST:
        onPlayPlaylistHandler(bots, message, args);
        break;

      case BotMessages.LEAVE_DJ_SEAT:
        onLeaveDjSeatHandler(bots, message, args);
        break;

      default:
        return;
    }
  });

  client.login(discord_token);
})();
