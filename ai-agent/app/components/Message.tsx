"use client";
import { Message } from "@/types/types";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Messages({ messages }: { messages: Message[] }) {
  const path = usePathname();

  const isReviewsPage = path.includes("review-sessions");

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg">
      {messages.map((message) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {isReviewsPage && (
              <p className="absolute -bottom-5 text-xs text-gray-300">
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}

            <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"}`}>
              {isSender ? (
                <Image src={"/ai.png"} height={20} width={20} alt="ai" />
              ) : (
                <UserCircle className="text-[#2991EE]" />
              )}
            </div>
            <p
              className={`chat-bubble text-white ${
                isSender
                  ? "chat-bubble-primary bg-[#2991EE]"
                  : "chat-bubble-secondary bg-green-200 "
              }`}
            >
              <ReactMarkdown rehypePlugins={[remarkGfm]}>
                {message?.content || "KUNG ÄR DU ALAIN"}
              </ReactMarkdown>
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Messages;
