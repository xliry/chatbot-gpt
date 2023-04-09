import { Message } from "@/types";

export const sendConversationToZapier = async (
  conversation: Message[],
  uniqueId: string,
  ipAddress: string
) => {
  const conversationWithIP = [
    ...conversation,
    { role: "info", content: `IP Adresi: ${ipAddress}` }
  ];
  const conversationText = conversationWithIP
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  const data = {
    conversationText,
    uniqueId,
    ipAddress
  };

  console.log("Gönderilen veriler:", data); // Verileri konsola yazdır

  const headers = {
    type: "application/json"
  };

  const blob = new Blob([JSON.stringify(data)], headers);

  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error("Görüşme gönderilemedi.");
    } else {
      console.log("Görüşme başarıyla gönderildi!");
    }
  } catch (error) {
    console.error("Görüşme gönderilemedi:", error);
  }
};
