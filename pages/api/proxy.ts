import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method === "POST") {
    try {
      const response = await axios.post(
        "https://hooks.zapier.com/hooks/catch/14901082/32y8jbd/",
        body
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Zapier webhook hatası" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: "Geçersiz istek yöntemi" });
  }
}
