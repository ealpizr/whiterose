import type { NextApiRequest, NextApiResponse } from "next";
import IBotData from "types/IBotData";
import { getBot } from "utils/globals";

type Data = {
  status: IBotData | null;
};

export default function handler(_: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ status: getBot() });
}
