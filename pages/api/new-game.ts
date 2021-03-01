import newGame from "../../lib/newGame";
import { NextApiRequest, NextApiResponse } from "next";
import { IGameOptions } from "../../lib/game";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const options = req.body as IGameOptions;
  res.json({ game: newGame(options) });
};
