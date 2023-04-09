import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "@/types";
import {
  ConversationRequestBody,
  saveConversation
} from "./conversationController";
import { v4 as uuidv4 } from "uuid";

export interface Conversation {
  id: number;
  messages: Message[];
  uniqueId: string;
  ipAddress: string;
}

type Data = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { messages }: ConversationRequestBody = req.body;

    // IP adresini al
    const ipAddress = (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Unknown"
    ).toString();
    console.log("IP Adresi:", ipAddress);
    const uniqueId = uuidv4();
    // Veritabanına kaydet
    try {
      const conversationData: ConversationRequestBody = {
        messages,
        uniqueId,
        ipAddress
      };
      await saveConversation(conversationData);
      res
        .status(200)
        .json({ success: true, message: "Görüşme başarıyla kaydedildi." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Görüşme kaydedilemedi." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: "Geçersiz istek yöntemi." });
  }
}
