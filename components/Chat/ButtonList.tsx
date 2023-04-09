import React, { useState, FC } from "react";
import { Message } from "@/types";

interface Props {
  onSend: (message: Message) => void;
}
interface Question {
  content: string;
  next: string;
}
export const ButtonList: FC<Props> = ({ onSend }) => {
  const [questions, setQuestions] = useState([
    { content: "I have a request!", next: "Products/services?" },
    { content: "Info for quote?", next: "Quote time?" },
    {
      content: "Need [product/service].",
      next: "[quantity] units, [delivery date]?"
    },
    { content: "Payment terms?", next: "Delivery time?" },
    { content: "Support provided?", next: "Warranty policy?" }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (question: Question) => {
    onSend({ role: "user", content: question.content });

    const newQuestions = questions.filter(
      (q) => q.content !== question.content
    );

    if (question.next) {
      newQuestions.push({ content: question.next, next: "" });
    }

    setQuestions(newQuestions);
  };

  return (
    <div className="flex mr-32">
      {questions
        .slice(currentIndex, currentIndex + 2)
        .map((question, index) => (
          <button
            key={index}
            onClick={() => handleClick(question)}
            className="px-4 py-1 mx-2 text-sm text-blue-600 font-semibold rounded-full border-2 border-blue-500 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {question.content}
          </button>
        ))}
    </div>
  );
};

export default ButtonList;
