// components/ChatInputFooter/ChatInputFooter.tsx

import { FC } from "react";
import { ChatInput } from "@/components/Chat/ChatInput";
import { Message } from "@/types";

interface Props {
  onSend: (message: Message) => void;
}

export const ChatInputFooter: FC<Props> = ({ onSend }) => {
  return (
    <div className="absolute bottom-0 max-w-[800px] mx-auto mt-4 sm:mt-8  rounded-full  w-full">
      <ChatInput onSend={onSend} />
    </div>
  );
};
