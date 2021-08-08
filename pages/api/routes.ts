import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Data = {
  routes?: Array<string>;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(
        path.join(__filename, "..", "..", "..", "..", "..", "data", "Travel.xml"),
        "utf8"
      );

      const routesXML = data.match(/<route part="\w+"/g);
      if (!routesXML) {
        res.status(500).send({ message: "no data" });
      } else {
        const routes = routesXML.map((route) => route.substr(13).replace(">", "").replace('"', ""));
        res.status(200).send({ routes });
      }
    } catch (err) {
      res.status(500).send({ message: "error" });
    }
  }
}
