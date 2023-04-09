import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendConversationToZapier } from "@/pages/api/zapier";
import { isMobile } from "@/utils/isMobile";
import ConstructionPage from "@/components/ConstructionPage";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uniqueId, setUniqueId] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [showConstructionPage, setShowConstructionPage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowConstructionPage(isMobile());
    }
  }, []);

  useEffect(() => {
    const onUnload = () => {
      sendConversationToZapier(messages, uniqueId, ipAddress)
        .then(() => console.log("Görüşme başarıyla gönderildi."))
        .catch((error) => console.error("Görüşme gönderilemedi:", error));
    };

    const intervalId = setInterval(() => {
      sendConversationToZapier(messages, uniqueId, ipAddress);
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
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }
    const data = response.body;

    if (!data) {
      return;
    }
    try {
      const createConvResponse = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages,
          uniqueId: uniqueId,
          ipAddress: ipAddress
        })
      });

      if (!createConvResponse.ok) {
        throw new Error(createConvResponse.statusText);
      }

      console.log("Görüşme başarıyla veritabanına kaydedildi.");
    } catch (error) {
      console.error("Görüşme veritabanına kaydedilemedi:", error);
    }
    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
    /* try {
      await sendConversationToZapier(messages, uniqueId, ipAddress);
      console.log("Görüşme başarıyla Zapier'e gönderildi");
    } catch (error) {
      console.error("Görüşme gönderilemedi:", error);
    }*/
  };
  useEffect(() => {
    const fetchIp = async () => {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIpAddress(data.ip);
      setUniqueId(data.ip + uuidv4());
    };
    fetchIp();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello there! I'm Baldr, Here to help you with your Request for Quotation (RFQ) process. In order to give you the most accurate quote, I'll need some information from you. Please provide the following details:

        1. Product or service description: Clearly describe the product or service you're looking to purchase.
        2. Quantity: Specify the number of units or the amount of service you require.
        3. Desired delivery date: Mention the date by which you would like to receive the product or service.
        4. Budget: If you have a specific budget in mind, please share it.
        5. Special requirements or specifications: Let me know if you have any particular preferences or specifications, such as material, size, color, or other unique features.`
      }
    ]);
  }, []);
  if (showConstructionPage) {
    return <ConstructionPage />;
  }
  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta name="description" content="Supplyizi Chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://supplyizi.com/wp-content/uploads/fbrfg/apple-touch-icon.png"
        />
      </Head>

      <div className="flex flex-col h-screen bg-gradient-to-t from-blue-100">
        <Navbar />
        <div className="flex-1 overflow-auto bg-blue">
          <div className="flex flex-col justify-center max-w-[800px] mx-auto">
            <img
              className="max-w-[400px] ml-auto mr-auto justify-center"
              src="https://supplyizi.com/wp-content/uploads/2023/03/supplyizi-logo.png"
            />
            <div className="flex justify-center text-3xl mt-5">Welcome</div>
            <div className="flex justify-center text-2xl ">
              Your AI-powered RFQ Asistant
            </div>
          </div>
          <div className=" max-w-[800px] mx-auto mt-4 sm:mt-12 bg-blue relative">
            <Chat messages={messages} loading={loading} onSend={handleSend} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer onSend={handleSend} />
      </div>
    </>
  );
}
