import IBotData from "types/IBotData";

declare global {
  var bot: IBotData | undefined;
}

const getBot = (): IBotData | null => global.bot || null;

const setBot = (data: IBotData | undefined) => {
  global.bot = data;
};

export { getBot, setBot };
