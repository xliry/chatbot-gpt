import { FC } from "react";
import { ChatInputFooter } from "../Chat/ChatInputFooter";
import { ChatInput } from "@/components/Chat/ChatInput";
import { Message } from "@/types";
import ButtonList from "@/components/Chat/ButtonList"; // ButtonList'i import edin

interface Props {
  onSend: (message: Message) => void;
}

export const Footer: FC<Props> = ({ onSend }) => {
  return (
    <div className="flex flex-col h-[140px] py-2 px-8">
      <div className="h-12">
        <div className="flex flex-row justify-center  mr-96 mb-2 ">
          <ButtonList onSend={onSend} />
        </div>
      </div>

      <div className="max-w-[850px] mx-auto w-full drop-shadow-lg ">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
};
