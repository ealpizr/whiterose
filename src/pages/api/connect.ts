import mineflayer from "mineflayer";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBot, setBot } from "utils/globals";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  const bot = mineflayer.createBot({
    host: process.env.SERVER_IP,
    port: Number.parseInt(process.env.SERVER_PORT || ""),
    username: "Whiterose",
  });

  let movementInterval: NodeJS.Timer;
  let updateInterval: NodeJS.Timer;
  let pingInterval: NodeJS.Timer;
  bot.on("spawn", () => {
    setBot({
      ping: bot.player.ping,
      uuid: bot.player.uuid,
      version: bot.version,
    });
    movementInterval = setInterval(() => {
      bot.setControlState("jump", true);
      bot.setControlState("jump", false);
      bot.look(bot.entity.yaw + 90, 0);
    }, 2000);
    updateInterval = setInterval(() => {
      setBot({ ...getBot()!, ping: bot.player.ping });
    }, 5000);
    pingInterval = setInterval(() => {
      const BASE_URL = process.env.NEXT_PUBLIC_URL || "";
      fetch(BASE_URL);
    }, 10 * 60 * 1000);
  });

  bot.on("death", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    clearInterval(pingInterval);
  });

  bot.on("end", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    clearInterval(pingInterval);
    setBot(undefined);
  });

  bot.on("kicked", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    clearInterval(pingInterval);
    setBot(undefined);
  });
  bot.on("error", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    clearInterval(pingInterval);
    setBot(undefined);
  });

  res.status(200).end();
}
