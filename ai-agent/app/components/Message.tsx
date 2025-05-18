/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Message } from "@/types/types";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Messages({ messages }: { messages: Message[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const isReviewsPage = path.includes("review-sessions");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg">
      {messages?.map((message) => {
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
              <ReactMarkdown
                rehypePlugins={[remarkGfm]}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-inside ml-5 mb-5"
                    />
                  ),

                  ol: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-decimal list-inside ml-5 mb-5"
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-2xl font-bold ml-5 mb-5" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-xl font-bold ml-5 mb-5" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-lg font-bold ml-5 mb-5" />
                  ),
                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white ml-5 mb-5"
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th {...props} className="text-left underline" />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className={`whitespace-break-spaces mb-5 ${
                        message.content === "Thinking..." && "animate-pulse"
                      }
                    ${isSender ? "text-white" : "text-gray-400"}`}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      className="font-bolde underline hover:text-blue-300"
                      rel="noopener norferrer"
                    />
                  ),
                }}
              >
                {message?.content || "KUNG ÄR DU ALAIN"}
              </ReactMarkdown>
            </p>
          </div>
        );
      })}
      <div ref={ref} />
    </div>
  );
}

export default Messages;
