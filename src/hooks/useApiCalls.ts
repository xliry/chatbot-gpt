import { Message } from "@/types";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendConversationToZapier } from "@/pages/api/zapier";

interface UseApiCalls {
  ipAddress: string;
  uniqueId: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const useApiCalls = ({
  ipAddress,
  uniqueId,
  messages,
  setMessages
}: UseApiCalls) => {
  useEffect(() => {
    const onUnload = async () => {
      await sendConversationToZapier(messages, uniqueId, ipAddress);
    };

    const intervalId = setInterval(async () => {
      await sendConversationToZapier(messages, uniqueId, ipAddress);
    }, 5 * 60 * 1000); // 5 dakikada bir gönder

    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("unload", onUnload);

    return () => {
      clearInterval(intervalId); // temizle
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("unload", onUnload);
    };
  }, [messages, uniqueId, ipAddress]);

  const handleSend = async (message: Message) => {
    // ... aynı handleSend kodu
  };

  return { handleSend };
};
