import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import parser from "xml2json";

type Data = {
  route?: Array<{ name: string; lat: number; long: number }>;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).send({ message: "invalid input" });
      } else {
        const data = fs.readFileSync(
          path.join(__filename, "..", "..", "..", "..", "..", "..", "data", "Travel.xml"),
          "utf8"
        );

        const regexString = new RegExp(`<route part="${id}">(.*?)</route>`, "s");
        const routeData = data.match(regexString);
        // console.log(routeData[0]);
        if (routeData) {
          const jsonData = JSON.parse(parser.toJson(routeData[0], { reversible: true }));
          const places = jsonData.route.place.map((item: any) => {
            return { lat: Number(item.lat.$t), name: item.name.$t, long: Number(item.long.$t) };
          });
          res.status(200).send({ route: places });
        } else {
          res.status(500).send({ message: "no data" });
        }
      }
    } catch (err) {
      res.status(500).send({ message: "error" });
    }
  }
}
