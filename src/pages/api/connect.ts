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
  });

  bot.on("death", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
  });

  bot.on("end", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    setBot(undefined);
  });

  bot.on("kicked", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    setBot(undefined);
  });
  bot.on("error", () => {
    clearInterval(movementInterval);
    clearInterval(updateInterval);
    setBot(undefined);
  });

  res.status(200).end();
}
